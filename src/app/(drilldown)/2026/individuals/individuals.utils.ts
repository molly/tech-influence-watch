import { CompanyConstant } from "@/app/types/Companies";
import {
  IndividualConstant,
  IndividualListData,
} from "@/app/types/Individuals";
import { getSectorsForIndividual } from "@/app/utils/sector";

export function hydrateIndividualConstant(
  individual: IndividualConstant,
  individualTotalsArray: Record<string, { total: number }>,
  companyConstants: Record<string, CompanyConstant>,
): IndividualListData {
  return {
    ...individual,
    companyDetails: individual.company
      ? (individual.company
          .map(
            (companyString) =>
              Object.values(companyConstants).find(
                (cc) => cc.name === companyString,
              ) ?? {},
          )
          .filter((cc) => cc !== undefined) as CompanyConstant[])
      : [],
    allSectors: getSectorsForIndividual(individual, companyConstants),
    total: individualTotalsArray[individual.id]?.total || 0,
  };
}
