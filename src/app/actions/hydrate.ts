import {
  Expenditure,
  ExpenditureId,
  PopulatedStateExpenditures,
  StateExpenditures,
} from "../types/Expenditures";

export function hydrateStateExpenditures(
  stateExpenditures: StateExpenditures,
  allExpenditures: Record<ExpenditureId, Expenditure>,
): PopulatedStateExpenditures {
  let by_race_companies_total: Record<string, number> | undefined;
  if (stateExpenditures.by_race_companies) {
    by_race_companies_total = {};
    for (const [raceId, companiesMap] of Object.entries(
      stateExpenditures.by_race_companies,
    )) {
      const raceTotal = Object.values(companiesMap).reduce(
        (sum, amt) => sum + amt,
        0,
      );
      if (raceTotal > 0) {
        by_race_companies_total[raceId] = raceTotal;
      }
    }
  }
  const populatedStateExpenditures: PopulatedStateExpenditures = {
    by_committee: {},
    by_race: {},
    by_companies: stateExpenditures.by_companies,
    companies_total: stateExpenditures.companies_total,
    by_race_companies_total,
    prior_cycle_details: stateExpenditures.prior_cycle_details,
    prior_cycle_companies_total: stateExpenditures.prior_cycle_companies_total,
    total: stateExpenditures.total,
  };

  // Populate expenditures by committee
  const committeeIds = Object.keys(stateExpenditures.by_committee);
  for (const committeeId of committeeIds) {
    populatedStateExpenditures.by_committee[committeeId] = {
      expenditures: [],
      total: stateExpenditures.by_committee[committeeId]["total"],
    };
    populatedStateExpenditures.by_committee[committeeId]["expenditures"] =
      stateExpenditures.by_committee[committeeId]["expenditures"].map(
        (expenditureId) => allExpenditures[expenditureId],
      );
  }

  // Populate expenditures by race
  const raceIds = Object.keys(stateExpenditures.by_race);
  for (const raceId of raceIds) {
    populatedStateExpenditures.by_race[raceId] = {
      expenditures: [],
      details: stateExpenditures.by_race[raceId]["details"],
      total: stateExpenditures.by_race[raceId]["total"],
    };
    populatedStateExpenditures.by_race[raceId]["expenditures"] =
      stateExpenditures.by_race[raceId]["expenditures"].map(
        (expenditureId) => allExpenditures[expenditureId],
      );
  }
  return populatedStateExpenditures;
}
