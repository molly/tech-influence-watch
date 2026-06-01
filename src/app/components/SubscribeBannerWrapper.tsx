import { fetchCompanyTotalSpending } from "@/app/actions/fetch";
import { CompanyTotals } from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";

import SubscribeBanner from "./SubscribeBanner";

export default async function SubscribeBannerWrapper() {
  const data = await fetchCompanyTotalSpending("all");
  const amount = isError(data)
    ? null
    : humanizeRoundedCurrency((data as CompanyTotals).total, true, 1);
  return <SubscribeBanner amount={amount} />;
}
