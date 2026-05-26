import { ReactElement } from "react";

import MaybeLink from "@/app/components/MaybeLink";
import { STATES_BY_ABBR } from "@/app/data/states";
import {
  RecipientCandidateDetails,
  RecipientDetails,
} from "@/app/types/Contributions";
import {
  getDesignation,
  getUniqueCandidateIds,
  isMultiCandidateCommittee,
  isSingleCandidateCommittee,
  isSingleSponsorCandidateCommittee,
} from "@/app/utils/committees";
import { humanizeList } from "@/app/utils/humanize";
import { getFullPartyName } from "@/app/utils/party";
import { getRaceName } from "@/app/utils/races";
import { titlecaseLastFirst } from "@/app/utils/titlecase";

import styles from "./individualOrCompany.module.css";

function CandidateStateAndOffice({
  details,
}: {
  details: RecipientCandidateDetails;
}) {
  if (
    (!details.state || !(details.state in STATES_BY_ABBR)) &&
    details.office
  ) {
    return (
      <span className={styles.committeeDetail}>
        <MaybeLink href={details.race_link}>
          {STATES_BY_ABBR[details.state]}{" "}
          {getRaceName(
            `${details.state}-${details.office}-${details.district}`,
          )}
        </MaybeLink>
      </span>
    );
  } else if (
    details.state &&
    details.state in STATES_BY_ABBR &&
    !details.office
  ) {
    return (
      <span className={styles.committeeDetail}>
        {details.state && details.state in STATES_BY_ABBR && (
          <span className={styles.committeeDetail}>
            {STATES_BY_ABBR[details.state]}
          </span>
        )}
      </span>
    );
  }
  return (
    <span className={styles.committeeDetail}>
      <MaybeLink href={details.race_link}>
        {STATES_BY_ABBR[details.state]}{" "}
        {getRaceName(`${details.state}-${details.office}-${details.district}`)}
      </MaybeLink>
    </span>
  );
}

function CandidateCommitteeDetails({
  recipient,
  details,
}: {
  recipient: RecipientDetails;
  details: RecipientCandidateDetails;
}) {
  return (
    <div className={styles.committeeDetails}>
      <span className={styles.committeeDetail}>
        {details.name ? titlecaseLastFirst(details.name) : null}
        {getDesignation(recipient.designation_full)}
      </span>
      {(recipient.party || details.party) && (
        <span className={styles.committeeDetail}>
          {getFullPartyName((recipient.party || details.party)[0], true)}
        </span>
      )}
      <CandidateStateAndOffice details={details} />
    </div>
  );
}

function MultiCandidateCommitteeDetails({
  recipient,
}: {
  recipient: RecipientDetails;
}) {
  const uniqueCandidateIds = getUniqueCandidateIds(recipient);
  const uniqueCandidates = uniqueCandidateIds.map(
    (id) => recipient.candidate_details[id],
  );

  const parties = new Set<string>();
  const names: string[] = [];
  const races: ReactElement[] = [];
  for (const c of uniqueCandidates) {
    if (c.party) {
      parties.add(c.party);
    }
    if (c.name) {
      names.push(titlecaseLastFirst(c.name));
    }
    if (c.state && c.office) {
      races.push(
        <MaybeLink href={c.race_link} key={c.name}>
          {`${STATES_BY_ABBR[c.state]} ${getRaceName(`${c.state}-${c.office}-${c.district}`)}`}
        </MaybeLink>,
      );
    }
  }
  const party = parties.size === 1 ? parties.values().next().value : undefined;

  return (
    <div className={styles.committeeDetails}>
      <span className={styles.committeeDetail}>
        {humanizeList(names as string[])}
        {getDesignation(recipient.designation_full)}
      </span>
      {party && (
        <span className={styles.committeeDetail}>
          {getFullPartyName(party[0], true)}
        </span>
      )}
      {races && (
        <span className={styles.committeeDetail}>{humanizeList(races)}</span>
      )}
    </div>
  );
}

export default function CommitteeDetails({
  recipient,
  nonCandidateCommittees = new Set(),
}: {
  recipient?: RecipientDetails;
  nonCandidateCommittees?: Set<string>;
}) {
  if (!recipient) {
    return null;
  }
  if (isSingleCandidateCommittee(recipient, nonCandidateCommittees)) {
    const candidateId = (recipient.candidate_ids as string[])[0];
    const details = recipient.candidate_details?.[candidateId];
    return (
      <CandidateCommitteeDetails recipient={recipient} details={details} />
    );
  } else if (isMultiCandidateCommittee(recipient, nonCandidateCommittees)) {
    return <MultiCandidateCommitteeDetails recipient={recipient} />;
  } else if (isSingleSponsorCandidateCommittee(recipient)) {
    const candidateId = (recipient.sponsor_candidate_ids as string[])[0];
    const details = recipient.candidate_details?.[candidateId];
    return (
      <CandidateCommitteeDetails recipient={recipient} details={details} />
    );
  } else if (recipient.description) {
    return (
      <div className={styles.committeeDetails}>
        <span className={styles.committeeDetail}>{recipient.description}</span>
        {recipient.party && (
          <span className={styles.committeeDetail}>
            {getFullPartyName(recipient.party[0], true)}
          </span>
        )}
        {recipient.designation_full &&
          recipient.designation_full !== "Unauthorized" && (
            <span className={styles.committeeDetail}>
              {recipient.designation_full}
            </span>
          )}
      </div>
    );
  }
}
