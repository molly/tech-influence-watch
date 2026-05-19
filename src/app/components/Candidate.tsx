import sharedStyles from "@/app/shared.module.css";
import { CandidateSummary, Party, RaceCandidate } from "@/app/types/Elections";
import { getFirstLastName } from "@/app/utils/names";

import { ExpenditureCandidateSummary } from "../types/Expenditures";
import styles from "./candidate.module.css";
import Skeleton from "./skeletons/Skeleton";

function getPartyClass(party?: string | null) {
  if (party && party.length && ["R", "D", "L", "G", "I"].includes(party[0])) {
    return `party-${party}`;
  }
  return "party-unknown";
}

export function CandidateSkeleton({ onCard }: { onCard?: boolean }) {
  return (
    <div className={styles.candidateInfoBlock}>
      <CandidateImage />
      <Skeleton width="10rem" className={sharedStyles.noMargin} onCard={onCard} />
    </div>
  );
}

export function CandidateImage({
  candidate,
  firstName,
  lastName,
  defeated,
  chart,
  className,
  noMargins = false,
}: {
  candidate?: CandidateSummary | ExpenditureCandidateSummary;
  firstName?: string;
  lastName?: string;
  defeated?: boolean;
  chart?: boolean;
  noMargins?: boolean;
  className?: string;
}) {
  let imageUrl;
  if (firstName && lastName) {
    imageUrl = `https://storage.googleapis.com/candidates/${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase()}.webp`;
  }
  let candidateImageWrapperClassNames = styles.candidateImageWrapper;
  if (chart) {
    candidateImageWrapperClassNames += ` ${styles.chartCandidateImageWrapper}`;
  }
  if (noMargins) {
    candidateImageWrapperClassNames += ` ${styles.noMargins}`;
  }
  if (candidate && candidate.party) {
    candidateImageWrapperClassNames += ` ${styles[getPartyClass(candidate.party)]}`;
  } else {
    candidateImageWrapperClassNames += ` ${styles["party-loading"]}`;
  }
  if (defeated) {
    candidateImageWrapperClassNames += ` ${styles.defeatedCandidateImage}`;
  }
  if (className) {
    candidateImageWrapperClassNames += ` ${className}`;
  }

  let imageEl = (
    <svg
      className={`${styles.placeholderImage} ${chart ? styles.chartPlaceholderImage : ""}`}
      viewBox="0 0 340 340"
    >
      <g>
        <path
          fill="currentColor"
          d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1 1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
        />
        <title>Placeholder for a missing image of person.</title>
      </g>
    </svg>
  );
  if (imageUrl) {
    imageEl = (
      <object
        type="image/webp"
        data={imageUrl}
        aria-label={(candidate && candidate.common_name) || "Candidate image"}
        className={`${styles.candidateImage} ${chart ? styles.chartCandidateImage : ""}`}
      >
        {imageEl}
      </object>
    );
  }

  return <div className={candidateImageWrapperClassNames}>{imageEl}</div>;
}

export function UnknownCandidate({
  party,
  name,
  noMargins,
}: {
  party?: Party;
  name?: string;
  noMargins?: boolean;
}) {
  let candidateImageWrapperClassNames = styles.candidateImageWrapper;
  if (party) {
    candidateImageWrapperClassNames += ` ${styles[getPartyClass(party)]}`;
  }
  if (noMargins) {
    candidateImageWrapperClassNames += ` ${styles.noMargins}`;
  }
  return (
    <>
      <div className={styles.candidateInfoBlock}>
        <div className={candidateImageWrapperClassNames}>
          <svg className={styles.placeholderImage} viewBox="0 0 340 340">
            <g>
              <path
                fill="#ddd"
                d="M169 .5C75.86 1.051.725 76.866 1.006 169.957 1.286 263.043 76.873 338.268 170 338.268s168.713-75.225 168.994-168.311C339.275 76.866 264.14 1.05 171 .5Z"
              />
              <foreignObject x="0" y="0" width="340" height="340">
                <div className={styles.unknownCandidateQuestionMark}>?</div>
              </foreignObject>
              <title>
                Placeholder showing a question mark to represent an unknown
                candidate.
              </title>
            </g>
          </svg>
        </div>
        <span>
          <span className={styles.unknownCandidateText}>
            {name || "Winner to be determined"}
          </span>
        </span>
      </div>
    </>
  );
}

export default function Candidate({
  candidate,
  candidateSummary,
  candidateClassName,
  candidateNameClassName,
  candidateImageClassName,
  defeated,
  writeIn,
  presumptive,
  chart,
  imageOnly,
  noMargins,
}: {
  candidate?: RaceCandidate;
  candidateSummary?: CandidateSummary | ExpenditureCandidateSummary;
  candidateClassName?: string;
  candidateNameClassName?: string;
  candidateImageClassName?: string;
  defeated?: boolean;
  writeIn?: boolean;
  presumptive?: boolean;
  chart?: boolean;
  imageOnly?: boolean;
  noMargins?: boolean;
}) {
  const name =
    candidateSummary && candidateSummary.common_name
      ? candidateSummary.common_name
      : candidate
        ? candidate.name
        : null;
  if (!name) {
    return null;
  }
  const [firstName, lastName] = getFirstLastName(name);
  const candidateImage = (
    <CandidateImage
      candidate={candidateSummary}
      firstName={firstName}
      lastName={lastName}
      defeated={defeated}
      chart={chart}
      noMargins={noMargins}
      className={candidateImageClassName}
    />
  );
  if (imageOnly) {
    return candidateImage;
  }

  return (
    <>
      <div
        className={`${styles.candidateInfoBlock} ${candidateClassName || ""}`}
      >
        {candidateImage}
        {!chart && (
          <span>
            <span className={candidateNameClassName}>{name}</span>
            {(() => {
              const parts: string[] = [];
              if (candidateSummary?.party) {
                parts.push(candidateSummary.party);
              }
              if (candidateSummary?.incumbent_challenge === "I") {
                parts.push("incumbent");
              }
              if (writeIn) {
                parts.push("write-in");
              }
              if (presumptive) {
                parts.push("presumptive");
              }
              if (parts.length === 0) {
                return null;
              }
              return (
                <span className="secondary"> ({parts.join(", ")})</span>
              );
            })()}
          </span>
        )}
      </div>
    </>
  );
}
