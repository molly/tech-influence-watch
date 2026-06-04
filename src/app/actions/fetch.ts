import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { cache } from "react";

import { db } from "@/app/lib/db";
import {
  AllCommitteesSummary,
  CommitteeConstant,
  CommitteeConstantWithContributions,
  CommitteeDetails,
  CommitteeTotalsSnapshot,
  TotalsForCommittees,
  TransferEdge,
} from "@/app/types/Committee";
import {
  Contributions,
  RecentContribution,
  RecipientDetails,
} from "@/app/types/Contributions";
import { getAdDate } from "@/app/utils/ads";
import { ErrorType, isError } from "@/app/utils/errors";

import { TRUMP_CANDIDATE_ID } from "../data/trump";
import { Ad, AdGroup } from "../types/Ads";
import { Beneficiary } from "../types/Beneficiaries";
import {
  AllCompanyTotals,
  Company,
  CompanyConstant,
  CompanyTotals,
} from "../types/Companies";
import {
  ElectionGroup,
  ElectionsByState,
  OppositionConstant,
  RaceInsight,
} from "../types/Elections";
import {
  CommitteeTotalExpenditures,
  Expenditure,
  ExpenditureCandidateSummary,
  ExpenditureId,
  ExpendituresByCandidate,
  ExpendituresByParty,
  ExpendituresByPartySnapshot,
  ExpenditureTotals,
  PopulatedStateExpenditures,
  PriorCycleDetail,
  RecentExpenditures,
  StateExpenditures,
} from "../types/Expenditures";
import {
  IndividualContributions,
  IndividualTotals,
} from "../types/Individuals";
import { MapData } from "../types/MapData";
import { QPQ } from "../types/Qpq";
import { Sector } from "../types/Sector";
import {
  getCommitteeIdsForSector,
  getCompanyIdsForSector,
} from "../utils/sector";
import { hydrateStateExpenditures } from "./hydrate";

const fetchSnapshot = async (
  path: string,
  ...pathSegments: string[]
): Promise<any | ErrorType> => {
  try {
    const docRef = doc(db, path, ...pathSegments);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      return { error: true, statusCode: 404 };
    }
  } catch (e) {
    return { error: true };
  }
};

const fetchCollection = async (
  collectionName: string,
): Promise<DocumentData | ErrorType> => {
  const docRef = collection(db, collectionName);
  const snapshot = await getDocs(docRef);
  // TODO: Better error checking when I'm not on a plane; this doesn't throw.
  if (snapshot.docs.length === 0) {
    return { error: true };
  }
  return snapshot.docs;
};

const fetchCollectionAsRecord = async <T>(
  collectionName: string,
): Promise<Record<string, T> | ErrorType> => {
  const docRef = collection(db, collectionName);
  const snapshot = await getDocs(docRef);
  if (snapshot.docs.length === 0) {
    return { error: true };
  }
  const result: Record<string, T> = {};
  for (const d of snapshot.docs) {
    result[d.id] = d.data() as T;
  }
  return result;
};

export const fetchConstant = cache(
  async <T>(key: string): Promise<T | null> => {
    const docRef = doc(db, "constants", key);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (key === "individualEmployers" && "individualEmployers" in data) {
        return data.individualEmployers as T;
      }
      return data as T;
    } else {
      return null;
    }
  },
);

export const fetchQpq = cache(
  async (): Promise<Record<string, QPQ> | null> => {
    return fetchConstant<Record<string, QPQ>>("qpq");
  },
);

// ----------------------------------------------------------------------
// TOTALS ---------------------------------------------------------------
export const fetchCommitteeTotalReceipts = cache(
  async (
    sector: Sector = "all",
  ): Promise<CommitteeTotalsSnapshot | ErrorType> => {
    const snapshot = await fetchSnapshot("totals", "committees");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    } else {
      const data = snapshot as TotalsForCommittees;
      return data[sector];
    }
  },
);

export const fetchAllCommitteeTotalExpenditures = cache(
  async (sector: Sector = "all"): Promise<number | ErrorType> => {
    const snapshot = await fetchSnapshot("expenditures", "total");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    }
    return (snapshot as ExpenditureTotals)[sector].total;
  },
);

export const fetchAllCommitteeExpenditures = cache(
  async (
    sector: Sector = "all",
  ): Promise<Record<string, number> | ErrorType> => {
    const snapshot = await fetchSnapshot("expenditures", "total");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    }
    return (snapshot as ExpenditureTotals)[sector].by_committee;
  },
);

export const fetchCommitteeTotalExpenditures = cache(
  async (
    committeeId: string,
  ): Promise<CommitteeTotalExpenditures | ErrorType> => {
    const [expendituresSnapshot, committeeSnapshot] = await Promise.all([
      fetchSnapshot("expenditures", "total"),
      fetchSnapshot("committees", committeeId),
    ]);
    if (isError(expendituresSnapshot)) {
      return expendituresSnapshot as ErrorType;
    } else if (isError(committeeSnapshot)) {
      return committeeSnapshot as ErrorType;
    }
    const committee = committeeSnapshot as CommitteeDetails;
    const result: CommitteeTotalExpenditures = {
      expenditures: null,
      disbursements: null,
    };
    const allByCommittee = (expendituresSnapshot as ExpenditureTotals)["all"]
      .by_committee;
    if (committeeId in allByCommittee) {
      result.expenditures = allByCommittee[committeeId];
    }
    if ("disbursements_by_committee" in committeeSnapshot) {
      result.disbursements = Object.values(
        committee.disbursements_by_committee,
      ).reduce((acc, disbursementGroup) => acc + disbursementGroup.total, 0);
    }
    return result;
  },
);

export const fetchCompanyTotalSpending = cache(
  async (sector: Sector = "all"): Promise<CompanyTotals | ErrorType> => {
    const snapshot = await fetchSnapshot("totals", "companies");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    }
    return (snapshot as AllCompanyTotals)[sector];
  },
);

// ALL COMMITTEES -------------------------------------------------------
export const fetchPACsByReceipts = cache(
  async (): Promise<AllCommitteesSummary[] | ErrorType> => {
    const data = await fetchSnapshot("allCommittees", "allPacs");
    if (isError(data)) {
      return data as ErrorType;
    }
    return data.by_receipts as AllCommitteesSummary[];
  },
);

export const fetchSuperPACsByReceipts = cache(
  async (): Promise<AllCommitteesSummary[] | ErrorType> => {
    const data = await fetchSnapshot("allCommittees", "superPacs");
    if (isError(data)) {
      return data as ErrorType;
    }
    return data.by_receipts as AllCommitteesSummary[];
  },
);

// COMMITTEES -----------------------------------------------------------

// Fetch all committees and sort them by total receipts
export const fetchCommitteesWithContributions = cache(
  async (
    sector: Sector = "all",
  ): Promise<CommitteeConstantWithContributions[] | ErrorType> => {
    const [
      contributionsData,
      committeesData,
      committeeConstants,
      expendituresData,
    ] = await Promise.all([
      fetchCollection("contributions"),
      fetchCollection("committees"),
      fetchConstant<Record<string, CommitteeConstant>>("committees"),
      fetchSnapshot("expenditures", "total"),
    ]);
    if (isError(contributionsData)) {
      return contributionsData as ErrorType;
    } else if (isError(committeesData)) {
      return committeesData as ErrorType;
    } else if (!committeeConstants) {
      return {
        error: true,
        message: "Committee constants not found",
      } as ErrorType;
    } else {
      const contributions = contributionsData as DocumentData[];
      const committeesDocData = committeesData as DocumentData[];
      const committees: Record<string, CommitteeDetails> = {};
      committeesDocData.forEach((doc) => {
        committees[doc.id] = doc.data() as CommitteeDetails;
      });
      const expendituresByCommittee: Record<string, number> = isError(
        expendituresData,
      )
        ? {}
        : ((expendituresData as ExpenditureTotals)["all"].by_committee ?? {});
      const contributionsCommittees = contributions.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as (Contributions & { id: string })[];

      const committeesWithTotals = contributionsCommittees
        .map((committee) => ({
          ...committeeConstants[committee.id],
          total_contributed: committee.total_contributed || 0,
          total_transferred: committee.total_transferred || 0,
          last_cash_on_hand_end_period:
            committees[committee.id]?.last_cash_on_hand_end_period || 0,
          committee_type: committees[committee.id]?.committee_type,
          designation: committees[committee.id]?.designation,
          organization_type: committees[committee.id]?.organization_type,
          independent_expenditures:
            expendituresByCommittee[committee.id] ?? null,
          total:
            (committee.total_contributed || 0) +
            (committee.total_transferred || 0) +
            (committees[committee.id]?.last_cash_on_hand_end_period || 0),
        }))
        .filter(
          (committee) =>
            committee.total + (committee.claimedCommitted || 0) > 0,
        )
        .filter(
          (committee) =>
            sector === "all" ||
            committee.sector === sector ||
            committee.sector === "tech",
        );
      committeesWithTotals.sort((a, b) => b.total - a.total);
      return committeesWithTotals;
    }
  },
);

// Fetch details for a specific committee
export const fetchCommitteeDetails = cache(
  async (committeeId: string): Promise<CommitteeDetails | ErrorType> =>
    fetchSnapshot("committees", committeeId),
);

// Fetch the inter-committee transfer graph.
//
// Transfers are reported twice to the FEC: by the sender (Schedule B, stored on
// the committee doc as disbursements_by_committee) and by the recipient
// (Schedule A, stored on the recipient's contributions doc as donor groups
// linking back to /committees/{senderId}). Neither is complete on its own:
//   - The recipient's report is the most current/complete for transfers between
//     committees we track, but it can't see transfers to committees we don't.
//   - The sender's report is the only source for transfers to untracked
//     committees (e.g. corporate PACs giving to individual candidate campaigns),
//     but it lags for super-PAC transfers the sender hasn't filed yet.
// So we take a per-recipient hybrid: prefer the recipient's Schedule A figure
// when the recipient is one we track (falling back to the sender's figure if the
// recipient hasn't logged it), and use the sender's Schedule B figure for
// untracked recipients.
export const fetchCommitteeTransferGraph = cache(
  async (sector: Sector = "all"): Promise<TransferEdge[] | ErrorType> => {
    const [contributionsData, committeesData, committeeConstants] =
      await Promise.all([
        fetchCollection("contributions"),
        fetchCollection("committees"),
        fetchConstant<Record<string, CommitteeConstant>>("committees"),
      ]);
    if (isError(contributionsData)) {
      return contributionsData as ErrorType;
    }
    if (isError(committeesData)) {
      return committeesData as ErrorType;
    }
    if (!committeeConstants) {
      return {
        error: true,
        message: "Committee constants not found",
      } as ErrorType;
    }

    // Every committee we track (used to decide Schedule A vs Schedule B per edge).
    const allTrackedIds = new Set(Object.keys(committeeConstants));
    // Committees in the requested sector (used to scope which senders to return).
    const sectorTrackedIds = new Set(
      Object.entries(committeeConstants)
        .filter(
          ([, c]) =>
            sector === "all" || c.sector === sector || c.sector === "tech",
        )
        .map(([id]) => id),
    );

    // Schedule A: recipient-reported transfers, keyed "fromId→toId" (toId tracked).
    const scheduleA = new Map<string, number>();
    for (const docSnap of contributionsData as DocumentData[]) {
      const toId = docSnap.id as string;
      if (!allTrackedIds.has(toId)) {
        continue;
      }
      const data = docSnap.data() as Contributions;
      if (!data.groups) {
        continue;
      }
      for (const group of data.groups) {
        const match = (group.link ?? "").match(/^\/committees\/([^/]+)$/);
        if (!match) {
          continue;
        }
        const fromId = match[1];
        if (fromId === toId) {
          continue;
        }
        const key = `${fromId}→${toId}`;
        scheduleA.set(key, (scheduleA.get(key) ?? 0) + (group.total ?? 0));
      }
    }

    // Schedule B: sender-reported disbursements, keyed "fromId→toId" (any toId).
    const scheduleB = new Map<string, number>();
    const recipientNames = new Map<string, string>();
    for (const docSnap of committeesData as DocumentData[]) {
      const fromId = docSnap.id as string;
      const disbursements = (docSnap.data() as CommitteeDetails)
        .disbursements_by_committee;
      if (!disbursements) {
        continue;
      }
      for (const [toId, group] of Object.entries(disbursements)) {
        if (fromId === toId) {
          continue;
        }
        const key = `${fromId}→${toId}`;
        scheduleB.set(key, (scheduleB.get(key) ?? 0) + (group.total ?? 0));
        recipientNames.set(toId, group.recipient_name);
      }
    }

    const edges: TransferEdge[] = [];
    for (const key of new Set([...scheduleA.keys(), ...scheduleB.keys()])) {
      const [fromId, toId] = key.split("→");
      // Only return transfers sent by committees in the requested sector.
      if (!sectorTrackedIds.has(fromId)) {
        continue;
      }
      const toTracked = allTrackedIds.has(toId);
      // For a tracked recipient, mirror the prior behavior of keeping the graph
      // within the sector (untracked recipients are always included).
      if (toTracked && !sectorTrackedIds.has(toId)) {
        continue;
      }
      const a = scheduleA.get(key) ?? 0;
      const b = scheduleB.get(key) ?? 0;
      const amount = toTracked ? (a > 0 ? a : b) : b;
      if (amount <= 0) {
        continue;
      }
      edges.push({
        fromId,
        fromName: committeeConstants[fromId]?.name ?? fromId,
        toId,
        toName:
          committeeConstants[toId]?.name ?? recipientNames.get(toId) ?? toId,
        amount,
      });
    }
    return edges;
  },
);

// Fetch donors for a specific committee
export const fetchCommitteeDonors = cache(
  async (committeeId: string): Promise<Contributions | ErrorType> =>
    fetchSnapshot("contributions", committeeId),
);

export const uncachedFetchCommittees = async (): Promise<
  Record<string, CommitteeConstant> | ErrorType
> => fetchSnapshot("constants", "committees");

export const fetchNonCandidateCommittees = cache(
  async (): Promise<Set<string>> => {
    const data = await fetchConstant<Record<string, string[]>>(
      "nonCandidateCommittees",
    );
    if (data && "ids" in data) {
      const nonCandidateCommittees = new Set(data.ids);
      return nonCandidateCommittees;
    }
    return new Set();
  },
);

export const fetchTrumpCommittees = cache(
  async (): Promise<{ ids: string[]; names: Record<string, string> } | null> =>
    fetchConstant("trumpCommittees"),
);

// EXPENDITURES ----------------------------------------------------------
export const fetchAllExpenditures = cache(
  async (): Promise<Record<ExpenditureId, Expenditure> | ErrorType> =>
    fetchSnapshot("expenditures", "all"),
);

export const fetchAllRaceIds = cache(
  async (): Promise<Record<string, string[]> | ErrorType> => {
    const data = await fetchCollection("raceDetails");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      const electionsData = data as DocumentData[];
      const raceIds: Record<string, string[]> = {};
      electionsData.forEach((stateDoc) => {
        const lastUnderscore = stateDoc.id.lastIndexOf("_");
        const state =
          lastUnderscore !== -1 &&
          /^\d$/.test(stateDoc.id.slice(lastUnderscore + 1))
            ? stateDoc.id.slice(0, lastUnderscore)
            : stateDoc.id;
        const electionsByState = stateDoc.data() as ElectionsByState;
        if (!(state in raceIds)) {
          raceIds[state] = [];
        }
        for (const raceId of Object.keys(electionsByState)) {
          raceIds[state].push(raceId);
        }
      });
      for (const state of Object.keys(raceIds)) {
        raceIds[state].sort((a, b) => {
          const senateRacePattern = /^S(-special)?$/;
          const aIsSenate = senateRacePattern.test(a);
          const bIsSenate = senateRacePattern.test(b);
          if (aIsSenate && !bIsSenate) return -1;
          if (!aIsSenate && bIsSenate) return 1;
          return a.localeCompare(b);
        });
      }
      return raceIds;
    }
  },
);

export const fetchMapData = cache(
  async (sector: Sector = "all"): Promise<MapData | ErrorType> => {
    const [data, committeeConstants, companyConstants] = await Promise.all([
      fetchSnapshot("expenditures", "states"),
      sector !== "all"
        ? fetchConstant<Record<string, CommitteeConstant>>("committees")
        : Promise.resolve(null),
      sector !== "all"
        ? fetchConstant<Record<string, CompanyConstant>>("companies")
        : Promise.resolve(null),
    ]);
    if (isError(data)) {
      return data as ErrorType;
    }
    const stateData = data as Record<string, StateExpenditures>;
    const sectorCommitteeIds = getCommitteeIdsForSector(
      sector,
      committeeConstants ?? {},
    );
    const sectorCompanyIds = getCompanyIdsForSector(
      sector,
      companyConstants ?? {},
    );
    const mapData: MapData = {};
    for (const state of Object.keys(stateData)) {
      if (state === "US") {
        continue;
      }
      let total: number;
      if (sectorCommitteeIds) {
        total = Object.entries(stateData[state].by_committee ?? {}).reduce(
          (sum, [id, group]) =>
            sectorCommitteeIds.has(id) ? sum + group.total : sum,
          0,
        );
      } else {
        total = stateData[state].total || 0;
      }
      let by_companies: Record<string, number> | undefined;
      let companies_total: number | undefined;
      if (sectorCompanyIds) {
        by_companies = Object.fromEntries(
          Object.entries(stateData[state].by_companies ?? {}).filter(([id]) =>
            sectorCompanyIds.has(id),
          ),
        );
        companies_total = Object.values(by_companies).reduce(
          (s, v) => s + v,
          0,
        );
      } else {
        by_companies = stateData[state].by_companies;
        companies_total = stateData[state].companies_total;
      }
      let by_race_companies: Record<string, number> | undefined;
      const rawByRaceCompanies = stateData[state].by_race_companies ?? {};
      if (sectorCompanyIds) {
        by_race_companies = {};
        for (const [raceId, companiesMap] of Object.entries(
          rawByRaceCompanies,
        )) {
          const raceTotal = Object.entries(companiesMap)
            .filter(([id]) => sectorCompanyIds.has(id))
            .reduce((sum, [, amt]) => sum + amt, 0);
          if (raceTotal > 0) {
            by_race_companies[raceId] = raceTotal;
          }
        }
      } else {
        by_race_companies = Object.fromEntries(
          Object.entries(rawByRaceCompanies).map(([raceId, companiesMap]) => [
            raceId,
            Object.values(companiesMap).reduce((sum, amt) => sum + amt, 0),
          ]),
        );
      }

      mapData[state] = {
        total,
        by_race: {},
        by_companies,
        companies_total,
        by_race_companies,
      };
      for (const raceId of Object.keys(stateData[state].by_race)) {
        mapData[state].by_race[raceId] = stateData[state].by_race[raceId].total;
      }
    }
    return mapData;
  },
);

// Fetch expenditures for a specific state
export const fetchStateExpenditures = cache(
  async (
    stateAbbr: string,
    sector: Sector = "all",
  ): Promise<PopulatedStateExpenditures | ErrorType> => {
    const [data, committeeConstants, companyConstants] = await Promise.all([
      fetchSnapshot("expenditures", "states"),
      sector !== "all"
        ? fetchConstant<Record<string, CommitteeConstant>>("committees")
        : Promise.resolve(null),
      sector !== "all"
        ? fetchConstant<Record<string, CompanyConstant>>("companies")
        : Promise.resolve(null),
    ]);
    if (isError(data)) {
      return data as ErrorType;
    } else if (!(stateAbbr in data)) {
      return { error: true, statusCode: 404 };
    } else {
      const statesExpenditures = data as Record<string, StateExpenditures>;
      const stateExpenditures = statesExpenditures[stateAbbr];
      const allExpendituresData = await fetchAllExpenditures();
      if (isError(allExpendituresData)) {
        return allExpendituresData as ErrorType;
      }
      const allExpenditures = allExpendituresData as Record<
        ExpenditureId,
        Expenditure
      >;
      if (sector === "all") {
        return hydrateStateExpenditures(stateExpenditures, allExpenditures);
      }

      const sectorCommitteeIds = getCommitteeIdsForSector(
        sector,
        committeeConstants ?? {},
      );
      const sectorCompanyIds = getCompanyIdsForSector(
        sector,
        companyConstants ?? {},
      );

      const filteredByCommittee: StateExpenditures["by_committee"] = {};
      const sectorExpIds = new Set<string>();
      let total = 0;
      for (const [cid, group] of Object.entries(
        stateExpenditures.by_committee,
      )) {
        if (sectorCommitteeIds?.has(cid)) {
          filteredByCommittee[cid] = group;
          total += group.total;
          for (const expId of group.expenditures) {
            sectorExpIds.add(expId);
          }
        }
      }

      const filteredByRace: StateExpenditures["by_race"] = {};
      for (const [raceId, raceGroup] of Object.entries(
        stateExpenditures.by_race,
      )) {
        if (raceGroup.expenditures.some((id) => sectorExpIds.has(id))) {
          filteredByRace[raceId] = raceGroup;
        }
      }

      let filteredByCompanies: Record<string, number> | undefined;
      let companiesTotal: number | undefined;
      if (sectorCompanyIds && stateExpenditures.by_companies) {
        filteredByCompanies = Object.fromEntries(
          Object.entries(stateExpenditures.by_companies).filter(([id]) =>
            sectorCompanyIds.has(id),
          ),
        );
        companiesTotal = Object.values(filteredByCompanies).reduce(
          (s, v) => s + v,
          0,
        );
      }

      let filteredByRaceCompanies: StateExpenditures["by_race_companies"];
      if (stateExpenditures.by_race_companies) {
        filteredByRaceCompanies = {};
        for (const [raceId, companiesMap] of Object.entries(
          stateExpenditures.by_race_companies,
        )) {
          const filtered = sectorCompanyIds
            ? Object.fromEntries(
                Object.entries(companiesMap).filter(([id]) =>
                  sectorCompanyIds.has(id),
                ),
              )
            : companiesMap;
          const raceTotal = Object.values(filtered).reduce((s, v) => s + v, 0);
          if (raceTotal > 0) {
            filteredByRaceCompanies[raceId] = filtered;
          }
        }
      }

      let filteredPriorCycleDetails: PriorCycleDetail[] | undefined;
      let priorCycleCompaniesTotal: number | undefined;
      if (sectorCompanyIds && stateExpenditures.prior_cycle_details) {
        filteredPriorCycleDetails =
          stateExpenditures.prior_cycle_details.filter((d) =>
            sectorCompanyIds.has(d.company_id),
          );
        priorCycleCompaniesTotal = filteredPriorCycleDetails.reduce(
          (s, d) => s + d.amount,
          0,
        );
      }

      return hydrateStateExpenditures(
        {
          by_committee: filteredByCommittee,
          by_race: filteredByRace,
          by_companies: filteredByCompanies,
          companies_total: companiesTotal,
          by_race_companies: filteredByRaceCompanies,
          prior_cycle_details: filteredPriorCycleDetails,
          prior_cycle_companies_total: priorCycleCompaniesTotal,
          total,
        },
        allExpenditures,
      );
    }
  },
);

// Fetch recent expenditures by any committee
export const fetchAllRecentExpenditures = cache(
  async (sector: Sector = "all"): Promise<Expenditure[] | ErrorType> => {
    const [data, allRecentExpendituresData] = await Promise.all([
      fetchSnapshot("expenditures", "recent"),
      fetchAllExpenditures(),
    ]);
    if (isError(data)) {
      return data as ErrorType;
    }
    if (isError(allRecentExpendituresData)) {
      return allRecentExpendituresData as ErrorType;
    }
    const recentIds = (data as RecentExpenditures)[sector].all;
    const allRecentExpenditures = allRecentExpendituresData as Record<
      ExpenditureId,
      Expenditure
    >;
    return recentIds.map(
      (expenditureId) => allRecentExpenditures[expenditureId],
    );
  },
);

// Fetch recent expenditures for a specific committee
export const fetchRecentCommitteeExpenditures = cache(
  async (committeeId: string): Promise<Expenditure[] | ErrorType> => {
    const data = await fetchSnapshot("expenditures", "recent");
    const allRecentExpendituresData = await fetchAllExpenditures();
    if (isError(data)) {
      return data as ErrorType;
    } else if (isError(allRecentExpendituresData)) {
      return allRecentExpendituresData as ErrorType;
    } else {
      const committeeData =
        (data as RecentExpenditures)["all"]["by_committee"] ?? {};
      const allRecentExpenditures = allRecentExpendituresData as Record<
        string,
        Expenditure
      >;
      if (committeeId in committeeData) {
        return committeeData[committeeId].map(
          (expenditureId) => allRecentExpenditures[expenditureId],
        );
      } else {
        return [];
      }
    }
  },
);

export const fetchAllExpenditureTotalsByParty = cache(
  async (
    sector: Sector = "all",
  ): Promise<ExpendituresByPartySnapshot | ErrorType> => {
    const data = await fetchSnapshot("expenditures", "by_party");
    if (isError(data)) {
      return data as ErrorType;
    }
    return (data as ExpendituresByParty)[sector];
  },
);

// Fetch recent contributions from all tracked individuals and companies
export const fetchAllRecentContributions = cache(
  async (sector: Sector = "all"): Promise<RecentContribution[] | ErrorType> => {
    const data = await fetchSnapshot("contributions", "recent");
    if (isError(data)) {
      return data as ErrorType;
    }
    const sectorData = (data as Record<string, { all: RecentContribution[] }>)[
      sector
    ];
    return sectorData?.all ?? [];
  },
);

// ELECTIONS -------------------------------------------------------------
// Note: Python backend merges races and manualRaces into races field
export const fetchAllStateElections = cache(
  async (): Promise<Record<string, ElectionsByState> | ErrorType> => {
    const data = await fetchCollection("raceDetails");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      const electionsData = data as DocumentData[];
      const electionsByState: Record<string, ElectionsByState> = {};
      electionsData.forEach((stateDoc) => {
        const lastUnderscore = stateDoc.id.lastIndexOf("_");
        const state =
          lastUnderscore !== -1 &&
          /^\d$/.test(stateDoc.id.slice(lastUnderscore + 1))
            ? stateDoc.id.slice(0, lastUnderscore)
            : stateDoc.id;
        if (!(state in electionsByState)) {
          electionsByState[state] = {};
        }
        Object.assign(
          electionsByState[state],
          stateDoc.data() as ElectionsByState,
        );
      });
      return electionsByState;
    }
  },
);

export const fetchStateElections = cache(
  async (stateAbbr: string): Promise<ElectionsByState | ErrorType> => {
    try {
      const merged: ElectionsByState = {};
      for (let i = 0; i < 10; i++) {
        const docRef = doc(db, "raceDetails", `${stateAbbr}_${i}`);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          Object.assign(merged, snapshot.data() as ElectionsByState);
        }
      }
      if (Object.keys(merged).length > 0) {
        return merged;
      }
      return { error: true, statusCode: 404 };
    } catch (e) {
      return { error: true };
    }
  },
);

export const fetchElection = cache(
  async (raceId: string): Promise<ElectionGroup | ErrorType> => {
    let state, raceParts;
    if (raceId.toUpperCase() === "PRESIDENT") {
      state = "US";
      raceParts = ["P"];
    } else {
      [state, ...raceParts] = raceId.split("-");
    }
    const shortRaceId = raceParts.join("-");
    const stateElectionsData = await fetchStateElections(state);
    if (isError(stateElectionsData)) {
      return stateElectionsData as ErrorType;
    }
    const stateElections = stateElectionsData as ElectionsByState;
    if (!(shortRaceId in stateElections)) {
      return { error: true, statusCode: 404 };
    } else {
      return stateElections[shortRaceId];
    }
  },
);

// RACE INSIGHTS --------------------------------------------------------
// Races with notable tracked-PAC activity: cross-sector (both crypto and AI
// spending) and/or multi-PAC (>=2 tracked PACs). Filter by is_cross_sector /
// is_multi_pac for either view.
export const fetchRaceInsights = cache(
  async (): Promise<RaceInsight[] | ErrorType> => {
    const data = await fetchSnapshot("raceInsights", "races");
    if (isError(data)) {
      return data as ErrorType;
    }
    return (data as { races: RaceInsight[] }).races;
  },
);

// CANDIDATES -----------------------------------------------------------
export const fetchCandidateExpenditures = cache(
  async (
    limit: number | undefined,
  ): Promise<ExpendituresByCandidate | ErrorType> => {
    const order = await fetchSnapshot("candidatesOrder", "order");
    if (isError(order)) {
      return order as ErrorType;
    }
    const candidateOrder = order.order as string[];
    if (limit) {
      const limitedCandidates = candidateOrder.slice(0, limit);
      try {
        const q = query(
          collection(db, "candidates"),
          where("common_name", "in", limitedCandidates),
        );
        const snapshot = await getDocs(q);
        const results = {
          candidates: {},
          order: limitedCandidates,
        } as ExpendituresByCandidate;
        snapshot.forEach((doc) => {
          const candidateData = doc.data() as ExpenditureCandidateSummary;
          results.candidates[candidateData.common_name] = candidateData;
        });
        return results;
      } catch (e) {
        return { error: true };
      }
    } else {
      const results = await fetchCollection("candidates");
      if (isError(results)) {
        return results as ErrorType;
      }
      const resultsData = results as DocumentData[];
      return resultsData.reduce(
        (acc, result) => {
          const candidateData = result.data();
          acc.candidates[candidateData.common_name] = candidateData;
          return acc;
        },
        { candidates: {}, order: candidateOrder } as ExpendituresByCandidate,
      ) as ExpendituresByCandidate;
    }
  },
);

export const fetchCandidatesWithOpposeSpending = cache(
  async (
    sector: Sector = "all",
  ): Promise<ExpenditureCandidateSummary[] | ErrorType> => {
    const [data, oppositionData] = await Promise.all([
      fetchCollection("candidates"),
      fetchConstant("oppositionSpending"),
    ]);
    if (isError(data)) {
      return data as ErrorType;
    }
    const candidates = (data as DocumentData[]).reduce(
      (acc, result) => {
        const candidateData = result.data();
        acc.candidates[candidateData.common_name] = candidateData;
        return acc;
      },
      { candidates: {} } as ExpendituresByCandidate,
    ) as ExpendituresByCandidate;

    const oppositionConstant = (oppositionData || {}) as Record<
      string,
      OppositionConstant
    >;
    const opposeKey =
      sector === "crypto"
        ? "crypto_oppose_total"
        : sector === "ai"
          ? "ai_oppose_total"
          : "oppose_total";
    return Object.values(candidates.candidates)
      .filter((candidate) => (candidate[opposeKey] ?? 0) > 0)
      .sort((a, b) => (b[opposeKey] ?? 0) - (a[opposeKey] ?? 0))
      .map((candidate) => {
        if (
          candidate.candidate_id &&
          candidate.candidate_id in oppositionConstant
        ) {
          candidate.opposition_details =
            oppositionConstant[candidate.candidate_id];
        }
        return candidate;
      });
  },
);

// ADS ------------------------------------------------------------------
export const fetchGoogleAds = cache(
  async (): Promise<Record<string, AdGroup> | ErrorType> =>
    fetchSnapshot("ads", "by_committee"),
);

export const fetchAdsByRace = cache(
  async (raceId: string): Promise<Ad[] | ErrorType> => {
    const data = await fetchSnapshot("ads", "by_committee");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      let flattenedAds = Object.values(data as Record<string, AdGroup>).reduce(
        (acc, adGroup) => [...acc, ...Object.values(adGroup.ads)],
        [] as Ad[],
      );

      // Return only ads pertaining to the specified race, sorted by start date
      return flattenedAds
        .filter((ad) => ad.race === raceId)
        .sort((a, b) => getAdDate(b).localeCompare(getAdDate(a)));
    }
  },
);

// COMPANIES ------------------------------------------------------------
export const fetchCompany = cache(
  async (company: string): Promise<Company | ErrorType> =>
    fetchSnapshot("companies", company),
);

export const fetchIndividualTotalSpending = cache(
  async (): Promise<IndividualTotals | ErrorType> => {
    const snapshot = await fetchSnapshot("totals", "individuals");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    } else {
      return snapshot as IndividualTotals;
    }
  },
);

// INDIVIDUALS ------------------------------------------------------------
export const fetchIndividual = cache(
  async (individual: string): Promise<IndividualContributions | ErrorType> =>
    fetchSnapshot("individuals", individual),
);

export const fetchAllRecipients = cache(
  async (): Promise<Record<string, RecipientDetails> | ErrorType> =>
    fetchSnapshot("allRecipients", "recipients"),
);

// BENEFICIARIIES ------------------------------------------------------------
export const fetchBeneficiaries = cache(
  async (
    sector: Sector = "all",
  ): Promise<Record<string, Beneficiary> | ErrorType> => {
    const [data, companyConstants] = await Promise.all([
      fetchCollectionAsRecord<Beneficiary>("recipientDetails"),
      sector !== "all"
        ? fetchConstant<Record<string, CompanyConstant>>("companies")
        : Promise.resolve(null),
    ]);
    if (isError(data)) {
      return data as ErrorType;
    }
    if (sector === "all") {
      return data as Record<string, Beneficiary>;
    }
    const sectorIds = getCompanyIdsForSector(sector, companyConstants ?? {});
    const filtered: Record<string, Beneficiary> = {};
    for (const [id, beneficiary] of Object.entries(
      data as Record<string, Beneficiary>,
    )) {
      const filteredContribs = beneficiary.contributions.filter((g) =>
        sectorIds?.has(g.company_id),
      );
      const total = filteredContribs.reduce((sum, g) => sum + g.total, 0);
      if (total > 0) {
        filtered[id] = {
          ...beneficiary,
          contributions: filteredContribs,
          total,
        };
      }
    }
    return filtered;
  },
);

export const fetchBeneficiariesOrder = cache(
  async (sector: Sector = "all"): Promise<string[] | ErrorType> => {
    if (sector !== "all") {
      // Recompute order from sector-filtered beneficiaries
      const beneficiariesData = await fetchBeneficiaries(sector);
      if (isError(beneficiariesData)) {
        return beneficiariesData as ErrorType;
      }
      const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
      return Object.keys(beneficiaries).sort(
        (a, b) => beneficiaries[b].total - beneficiaries[a].total,
      );
    }
    const beneficiariesOrderData = await fetchSnapshot(
      "allRecipients",
      "recipientsOrder",
    );
    if (isError(beneficiariesOrderData)) {
      return beneficiariesOrderData as ErrorType;
    }
    return beneficiariesOrderData.order;
  },
);

export const fetchBeneficiariesWithoutExpendituresOrder = cache(
  async (sector: Sector = "all"): Promise<string[] | ErrorType> => {
    if (sector !== "all") {
      // Recompute from sector-filtered beneficiaries, preserving the candidatesWithoutExpenditures logic
      const [beneficiariesData, beneficiariesOrderData] = await Promise.all([
        fetchBeneficiaries(sector),
        fetchSnapshot("allRecipients", "recipientsOrder"),
      ]);
      if (isError(beneficiariesData) || isError(beneficiariesOrderData)) {
        return isError(beneficiariesData)
          ? (beneficiariesData as ErrorType)
          : (beneficiariesOrderData as ErrorType);
      }
      const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
      const baseOrder: string[] =
        beneficiariesOrderData.candidatesWithoutExpendituresOrder ?? [];
      return baseOrder.filter((id) => id in beneficiaries);
    }
    const beneficiariesOrderData = await fetchSnapshot(
      "allRecipients",
      "recipientsOrder",
    );
    if (isError(beneficiariesOrderData)) {
      return beneficiariesOrderData as ErrorType;
    }
    return beneficiariesOrderData.candidatesWithoutExpendituresOrder;
  },
);

export const fetchTrumpBeneficiaries = cache(
  async (): Promise<
    | {
        beneficiaries: Record<string, Beneficiary>;
        grandTotal: number;
        committeeNames: Record<string, string>;
      }
    | ErrorType
  > => {
    const [beneficiariesData, trumpCommitteesData] = await Promise.all([
      fetchBeneficiaries(),
      fetchTrumpCommittees(),
    ]);
    if (isError(beneficiariesData)) {
      return beneficiariesData as ErrorType;
    }
    const allBeneficiaries = beneficiariesData as Record<string, Beneficiary>;
    const trumpCommitteeIds = new Set<string>([
      TRUMP_CANDIDATE_ID,
      ...(trumpCommitteesData?.ids ?? []),
    ]);
    const beneficiaries = Object.fromEntries(
      Object.entries(allBeneficiaries).filter(([id]) =>
        trumpCommitteeIds.has(id),
      ),
    );
    const grandTotal = Object.values(beneficiaries).reduce(
      (sum, b) => sum + b.total,
      0,
    );
    return {
      beneficiaries,
      grandTotal,
      committeeNames: trumpCommitteesData?.names ?? {},
    };
  },
);

export const fetchPipelineLastRun = cache(
  async (): Promise<string | null> => {
    const data = await fetchSnapshot("metadata", "pipeline");
    if (isError(data)) {
      return null;
    }
    return (data as { last_run?: string }).last_run ?? null;
  },
);

export const fetchTrumpGrandTotal = cache(
  async (): Promise<number | ErrorType> => {
    const data = await fetchTrumpBeneficiaries();
    if (isError(data)) {
      return data as ErrorType;
    }
    return (data as { grandTotal: number }).grandTotal;
  },
);

export const fetchBeneficiariesForRace = cache(
  async (raceId: string): Promise<Record<string, Beneficiary> | ErrorType> => {
    const [beneficiariesData, raceData] = await Promise.all([
      fetchBeneficiaries(),
      fetchElection(raceId),
    ]);
    if (isError(beneficiariesData)) {
      return beneficiariesData as ErrorType;
    } else if (isError(raceData)) {
      return raceData as ErrorType;
    } else {
      const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
      const election = raceData as ElectionGroup;
      const candidatesInRace = Object.values(election.candidates).map(
        (candidate) => candidate.candidate_id,
      );
      return candidatesInRace.reduce(
        (acc, candidateId) => {
          if (candidateId && candidateId in beneficiaries) {
            acc[candidateId] = beneficiaries[candidateId];
          }
          return acc;
        },
        {} as Record<string, Beneficiary>,
      );
    }
  },
);
