import { Suspense } from "react";

import { fetchAllRecentExpenditures, fetchConstant } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { Expenditure } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";

import ErrorText from "../ErrorText";
import RecentExpenditures from "../RecentExpenditures";
import RecentExpendituresContent, {
  RecentExpendituresContentSkeleton,
} from "../RecentExpendituresContent";

async function AllRecentExpendituresContent({
  fullPage,
  sector,
}: {
  fullPage?: boolean;
  sector?: Sector;
}) {
  const [expendituresData, committeeConstantData] = await Promise.all([
    fetchAllRecentExpenditures(sector),
    fetchConstant("committees"),
  ]);
  if (isError(expendituresData)) {
    return (
      <div
        className={
          fullPage
            ? sharedStyles.errorCardContentStandalone
            : sharedStyles.errorCardContent
        }
      >
        <ErrorText subject="recent expenditures" />
      </div>
    );
  }

  const allRecentExpenditures = expendituresData as Expenditure[];
  return (
    <RecentExpendituresContent
      expenditures={
        fullPage ? allRecentExpenditures : allRecentExpenditures.slice(0, 5)
      }
      committees={committeeConstantData as Record<string, CommitteeConstant>}
      sector={sector}
    />
  );
}

export default async function AllRecentExpenditures({
  fullPage,
  sector,
}: {
  fullPage?: boolean;
  sector?: Sector;
}) {
  return (
    <RecentExpenditures
      noHeader={fullPage}
      fullPage={fullPage}
      sector={sector}
    >
      <Suspense
        fallback={<RecentExpendituresContentSkeleton fullPage={fullPage} />}
      >
        <AllRecentExpendituresContent fullPage={fullPage} sector={sector} />
      </Suspense>
    </RecentExpenditures>
  );
}
