import "@testing-library/jest-dom";

import {
  CandidateSummary,
  ElectionsByState,
  Party,
  Race,
  RaceType,
} from "@/app/types/Elections";
import { getRaceCallStatus, withCalledAt } from "@/app/utils/races";
import {
  getCandidatesBackedEarlier,
  getRaceGoal,
  getResultRaces,
  getResultsTally,
} from "@/app/utils/results";

const race = (
  candidates: Race["candidates"],
  extra: Partial<Race> = {},
): Race => ({
  type: RaceType.General,
  date: "2026-11-03",
  candidates,
  ...extra,
});

const summary = (
  name: string,
  support: number,
  oppose: number,
): CandidateSummary =>
  ({
    common_name: name,
    support_total: support,
    oppose_total: oppose,
    races: [RaceType.General],
    FEC_name: name,
  }) as CandidateSummary;

// One PAC's spending in one round, keyed the way ElectionGroup.spending is
const spendingIn = (
  round: string,
  candidates: Record<string, { support: number; oppose: number }>,
) => ({
  C001: { total: 0, subraces: { [round]: { total: 0, candidates } } },
});

describe("getRaceCallStatus", () => {
  test("ignores candidates who left the race", () => {
    expect(
      getRaceCallStatus(
        race([{ name: "A", won: true }, { name: "B", withdrew: true }]),
      ),
    ).toBe("called");
  });

  test("is partial until every remaining candidate has a result", () => {
    expect(getRaceCallStatus(race([{ name: "A", won: true }, { name: "B" }]))).toBe(
      "partial",
    );
    expect(getRaceCallStatus(race([{ name: "A" }, { name: "B" }]))).toBe(
      "uncalled",
    );
  });
});

describe("withCalledAt", () => {
  const called = race([
    { name: "A", won: true },
    { name: "B", won: false },
  ]);

  test("stamps a race when it becomes called", () => {
    expect(withCalledAt(race([{ name: "A" }]), called, 100).calledAt).toBe(100);
  });

  test("keeps the original time when the winners don't change", () => {
    const previous = { ...called, calledAt: 50 };
    expect(withCalledAt(previous, { ...called }, 100).calledAt).toBe(50);
  });

  test("restamps when the winner changes", () => {
    const previous = { ...called, calledAt: 50 };
    const flipped = race([
      { name: "A", won: false },
      { name: "B", won: true },
    ]);
    expect(withCalledAt(previous, flipped, 100).calledAt).toBe(100);
  });

  test("removes the time when the race is no longer called", () => {
    const previous = { ...called, calledAt: 50 };
    const uncalled = { ...race([{ name: "A" }, { name: "B" }]), calledAt: 50 };
    expect("calledAt" in withCalledAt(previous, uncalled, 100)).toBe(false);
  });
});

describe("getResultRaces", () => {
  const elections: Record<string, ElectionsByState> = {
    PA: {
      "H-01": {
        races: [race([{ name: "A", won: true }, { name: "B", won: false }], { calledAt: 10 })],
        candidates: { A: summary("A", 100, 0), B: summary("B", 0, 50) },
        spending: spendingIn("general", {
          A: { support: 100, oppose: 0 },
          B: { support: 0, oppose: 50 },
        }),
        year: "2026",
      },
      "H-02": {
        races: [race([{ name: "C", won: true }, { name: "D", won: false }], { calledAt: 20 })],
        candidates: { C: summary("C", 0, 0), D: summary("D", 30, 0) },
        spending: spendingIn("general", { D: { support: 30, oppose: 0 } }),
        year: "2026",
      },
      "H-03": {
        races: [race([{ name: "E" }, { name: "F" }])],
        candidates: { E: summary("E", 1000, 0), F: summary("F", 0, 0) },
        spending: spendingIn("general", { E: { support: 1000, oppose: 0 } }),
        year: "2026",
      },
      "H-04": {
        races: [race([{ name: "G" }])],
        candidates: { G: summary("G", 0, 0) },
        spending: {},
        year: "2026",
      },
    },
  };

  test("orders called races by most recent call, then the rest by money", () => {
    const races = getResultRaces(elections, {}, {}, {}, {}, {}, "all", "2026-11-03");
    expect(races.map((r) => r.raceId)).toEqual(["PA-H-02", "PA-H-01", "PA-H-03"]);
  });

  test("tallies money by which side won", () => {
    const tally = getResultsTally(
      getResultRaces(elections, {}, {}, {}, {}, {}, "all", "2026-11-03"),
    );
    expect(tally.called).toBe(2);
    expect(tally.races).toBe(3);
    expect(tally.superPacRaces).toBe(3);
    expect(tally.superPacCalled).toBe(2);
    // Supporting A (won) and opposing B (lost)
    expect(tally.superPac.won).toBe(150);
    // Supporting D (lost)
    expect(tally.superPac.lost).toBe(30);
    expect(tally.superPac.uncalled).toBe(1000);
  });

  test("marks each race's goal by which side its money landed on", () => {
    const byId = Object.fromEntries(
      getResultRaces(elections, {}, {}, {}, {}, {}, "all", "2026-11-03").map((r) => [
        r.raceId,
        getRaceGoal(r),
      ]),
    );
    // Supported the winner and opposed the loser
    expect(byId["PA-H-01"]).toBe("achieved");
    // Supported the loser
    expect(byId["PA-H-02"]).toBe("failed");
    // No result yet
    expect(byId["PA-H-03"]).toBeNull();
  });

  test("doesn't call a goal mixed over a small share on the other side", () => {
    // OH-S-special: most PAC money backed the loser, one PAC opposed them
    const oneSidedMostly: Record<string, ElectionsByState> = {
      OH: {
        "S-special": {
          races: [race([{ name: "B", won: true }, { name: "H", won: false }])],
          candidates: { B: summary("B", 0, 0), H: summary("H", 1000, 10) },
          spending: spendingIn("general", { H: { support: 1000, oppose: 10 } }),
          year: "2026",
        },
      },
    };
    const races = getResultRaces(oneSidedMostly, {}, {}, {}, {}, {}, "all", "2026-11-03");
    expect(getRaceGoal(races[0])).toBe("failed");
  });

  test("doesn't score money spent in the primary", () => {
    const primaryOnly: Record<string, ElectionsByState> = {
      AK: {
        H: {
          races: [race([{ name: "A", won: false }, { name: "B", won: true }])],
          candidates: { A: summary("A", 500, 0), B: summary("B", 0, 0) },
          spending: spendingIn("primary", { A: { support: 500, oppose: 0 } }),
          year: "2026",
        },
      },
    };
    const races = getResultRaces(primaryOnly, {}, {}, {}, {}, {}, "all", "2026-11-03");
    expect(getRaceGoal(races[0])).toBeNull();
    const tally = getResultsTally(races);
    expect(tally.superPac).toEqual({ won: 0, lost: 0, uncalled: 0 });
    expect(tally.superPacRaces).toBe(0);
    expect(tally.earlierOnlyRaces).toBe(1);
  });

  test("scores primary money against the primary results", () => {
    const withPrimary: Record<string, ElectionsByState> = {
      AZ: {
        "H-01": {
          races: [
            race([{ name: "A", won: true }], { type: RaceType.Primary, date: "2026-08-04", party: Party.Republican }),
            race([{ name: "C", won: false }, { name: "D", won: true }], { type: RaceType.Primary, date: "2026-08-04", party: Party.Democratic }),
            race([{ name: "A" }, { name: "D" }]),
          ],
          candidates: {
            A: summary("A", 100, 0),
            C: summary("C", 40, 0),
            D: summary("D", 0, 0),
          },
          spending: spendingIn("primary", {
            A: { support: 100, oppose: 0 },
            // C lost the primary and isn't on the general ballot
            C: { support: 40, oppose: 0 },
          }),
          year: "2026",
        },
      },
    };
    const races = getResultRaces(withPrimary, {}, {}, {}, {}, {}, "all", "2026-11-03");
    expect(races[0].earlierRounds).toEqual({
      rounds: ["primary"],
      superPac: { won: 100, lost: 40, uncalled: 0 },
      goal: "mixed",
    });
    const tally = getResultsTally(races);
    expect(tally.earlier.seats).toBe(1);
    expect(tally.earlier.goals.mixed).toBe(1);
    // Only A, of this election's candidates, was backed in the primary
    expect(getCandidatesBackedEarlier(races[0]).map((c) => c.candidate.name)).toEqual(["A"]);
    // C lost the primary, so they're listed with the earlier rounds
    expect(races[0].earlierCandidates).toHaveLength(1);
    expect(races[0].earlierCandidates[0]).toMatchObject({
      candidate: { name: "C", won: false },
      support: 40,
      current: { support: 0, oppose: 0 },
      earlier: { support: 40, oppose: 0, rounds: ["primary"] },
    });
  });

  test("keeps a seat whose PAC money only went to primary losers", () => {
    const primaryLosersOnly: Record<string, ElectionsByState> = {
      NV: {
        "H-03": {
          races: [
            race([{ name: "L", won: false }, { name: "W", won: true }], { type: RaceType.Primary, date: "2026-06-09", party: Party.Democratic }),
            race([{ name: "W" }, { name: "X" }]),
          ],
          candidates: { L: summary("L", 200, 0), W: summary("W", 0, 0), X: summary("X", 0, 0) },
          spending: spendingIn("primary", { L: { support: 200, oppose: 0 } }),
          year: "2026",
        },
      },
    };
    const races = getResultRaces(primaryLosersOnly, {}, {}, {}, {}, {}, "all", "2026-11-03");
    expect(races).toHaveLength(1);
    const tally = getResultsTally(races);
    expect(tally.earlierOnlyRaces).toBe(1);
    expect(tally.earlier.superPac.lost).toBe(200);
  });

  test("scores opposition by whether the candidate it helps won", () => {
    // IL-H-02: support for J and opposition to P (meant to help J) in a
    // primary that M won
    const crowdedPrimary: Record<string, ElectionsByState> = {
      IL: {
        "H-02": {
          races: [
            race(
              [
                { name: "J", won: false },
                { name: "M", won: true },
                { name: "P", won: false },
              ],
              { type: RaceType.Primary, date: "2026-03-17", party: Party.Democratic },
            ),
            race([{ name: "M" }, { name: "N" }]),
          ],
          candidates: {
            J: summary("J", 1400, 0),
            M: summary("M", 0, 0),
            N: summary("N", 0, 0),
            P: { ...summary("P", 0, 800), candidate_id: "H6IL02298" },
          },
          spending: spendingIn("primary", {
            J: { support: 1400, oppose: 0 },
            P: { support: 0, oppose: 800 },
          }),
          year: "2026",
        },
      },
    };
    const score = (opposition: Record<string, { benefitsCandidate?: string }>) =>
      getResultRaces(crowdedPrimary, {}, {}, {}, {}, opposition, "all", "2026-11-03")[0]
        .earlierRounds;
    // Opposing P helped J, who lost
    expect(score({ H6IL02298: { benefitsCandidate: "J" } })).toMatchObject({
      superPac: { won: 0, lost: 2200, uncalled: 0 },
      goal: "failed",
    });
    // Without a known beneficiary, P losing counts as a win
    expect(score({ H6IL02298: { benefitsCandidate: "–" } })).toMatchObject({
      superPac: { won: 800, lost: 1400, uncalled: 0 },
      goal: "mixed",
    });
  });

  test("finds when the PACs backed both nominees in their primaries", () => {
    const bothNominees: Record<string, ElectionsByState> = {
      FL: {
        "H-25": {
          races: [
            race([{ name: "R", won: true }], { type: RaceType.Primary, date: "2026-08-18", party: Party.Republican }),
            race([{ name: "D", won: true }], { type: RaceType.Primary, date: "2026-08-18", party: Party.Democratic }),
            race([{ name: "D", won: true }, { name: "R", won: false }]),
          ],
          candidates: { R: summary("R", 800, 0), D: summary("D", 300, 0) },
          spending: spendingIn("primary", {
            R: { support: 800, oppose: 0 },
            D: { support: 300, oppose: 0 },
          }),
          year: "2026",
        },
      },
    };
    const [result] = getResultRaces(bothNominees, {}, {}, {}, {}, {}, "all", "2026-11-03");
    expect(getCandidatesBackedEarlier(result).map((c) => c.candidate.name)).toEqual(["D", "R"]);
    expect(result.earlierRounds?.goal).toBe("achieved");
  });

  test("splits out spending from other rounds of the race", () => {
    const withPrimary: Record<string, ElectionsByState> = {
      OH: {
        S: {
          races: [race([{ name: "A", won: true }, { name: "B", won: false }])],
          candidates: { A: summary("A", 300, 0), B: summary("B", 0, 0) },
          spending: {
            C001: {
              total: 300,
              subraces: {
                primary: {
                  total: 200,
                  candidates: { A: { support: 200, oppose: 0 } },
                },
                general: {
                  total: 100,
                  candidates: { A: { support: 100, oppose: 0 } },
                },
              },
            },
          },
          year: "2026",
        },
      },
    };
    const [result] = getResultRaces(withPrimary, {}, {}, {}, {}, {}, "all", "2026-11-03");
    const a = result.candidates.find((c) => c.candidate.name === "A");
    expect(a?.earlier).toEqual({ support: 200, oppose: 0, rounds: ["primary"] });
  });

  describe("race tags", () => {
    // MA-S is rated Solid D, so money helping the Democrat backs the favorite
    const maSenate = (
      markey: { support: number; oppose: number },
      deaton: { support: number; oppose: number },
    ): Record<string, ElectionsByState> => ({
      MA: {
        S: {
          races: [
            race([
              { name: "Ed Markey", party: Party.Democratic, won: true },
              { name: "John Deaton", party: Party.Republican, won: false },
            ]),
          ],
          candidates: {
            "Ed Markey": {
              ...summary("Ed Markey", markey.support, markey.oppose),
              party: Party.Democratic,
            },
            "John Deaton": {
              ...summary("John Deaton", deaton.support, deaton.oppose),
              party: Party.Republican,
            },
          },
          spending: {
            C001: {
              total: 0,
              subraces: {
                general: {
                  total: 0,
                  candidates: { "Ed Markey": markey, "John Deaton": deaton },
                },
              },
            },
          },
          year: "2026",
        },
      },
    });
    const tagFor = (elections: Record<string, ElectionsByState>) =>
      getResultRaces(
        elections,
        {},
        {},
        {},
        { "MA-S": "solid-d" },
        {},
        "all",
        "2026-11-03",
      )[0].tag;

    test("money against the favorite in a Solid race backs the underdog", () => {
      expect(
        tagFor(maSenate({ support: 0, oppose: 61500 }, { support: 644500, oppose: 0 })),
      ).toBe("underdog");
    });

    test("money for the favorite in a Solid race backs the winners", () => {
      expect(
        tagFor(maSenate({ support: 500, oppose: 0 }, { support: 0, oppose: 0 })),
      ).toBe("safe");
    });

    test("significant money on both sides is mixed", () => {
      expect(
        tagFor(maSenate({ support: 700, oppose: 0 }, { support: 300, oppose: 0 })),
      ).toBe("mixed");
      // Under the threshold, the larger side decides
      expect(
        tagFor(maSenate({ support: 900, oppose: 0 }, { support: 100, oppose: 0 })),
      ).toBe("safe");
    });
  });
});
