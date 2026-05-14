import sharedStyles from "../shared.module.css";
import Skeleton from "./skeletons/Skeleton";

export function MoneyCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`${sharedStyles.smallCard} ${className || ""}`}>
      <Skeleton width="80%" onCard={true} />
      <Skeleton width="60%" height="3rem" onCard={true} />
      <Skeleton width="90%" onCard={true} />
      <Skeleton width="80%" onCard={true} />
    </div>
  );
}

export default function MoneyCard({
  amount,
  topText,
  bottomText,
  tooltip,
  className,
}: {
  amount: string | React.ReactElement;
  topText: string | React.ReactElement;
  bottomText?: string | React.ReactElement;
  tooltip?: React.ReactElement;
  className?: string;
}) {
  return (
    <div className={`${sharedStyles.smallCard} ${className || ""}`}>
      <div className={sharedStyles.moneyCardHeader}>{topText}</div>
      <div className={sharedStyles.highlight}>{amount}</div>{" "}
      <div>
        {bottomText}
        {tooltip}
      </div>
    </div>
  );
}
