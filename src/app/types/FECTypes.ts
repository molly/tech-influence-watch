 
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuditCandidateSearch {
  id?: string;
  name?: string;
}

export interface AuditCandidateSearchList {
  results?: AuditCandidateSearch[];
}

export interface AuditCase {
  audit_case_id?: string;
  audit_id?: number;
  candidate_id?: string;
  candidate_name?: string;
  committee_description?: string;
  committee_designation?: string;
  committee_id?: string;
  committee_name?: string;
  committee_type?: string;
  cycle?: number;
  /** @format date */
  far_release_date?: string;
  link_to_report?: string;
  primary_category_list?: AuditCaseCategoryRelation[];
}

export interface AuditCaseCategoryRelation {
  primary_category_id?: string;
  primary_category_name?: string;
  sub_category_list?: AuditCaseSubCategory[];
}

export interface AuditCaseCategoryRelationPage {
  pagination?: OffsetInfo;
  results?: AuditCaseCategoryRelation[];
}

export interface AuditCasePage {
  pagination?: OffsetInfo;
  results?: AuditCase[];
}

export interface AuditCaseSubCategory {
  sub_category_id?: string;
  sub_category_name?: string;
}

export interface AuditCaseSubCategoryPage {
  pagination?: OffsetInfo;
  results?: AuditCaseSubCategory[];
}

export interface AuditCategory {
  primary_category_id?: string;
  primary_category_name?: string;
  sub_category_list?: AuditCategoryRelation[];
}

export interface AuditCategoryPage {
  pagination?: OffsetInfo;
  results?: AuditCategory[];
}

export interface AuditCategoryRelation {
  sub_category_id?: string;
  sub_category_name?: string;
}

export interface AuditCategoryRelationPage {
  pagination?: OffsetInfo;
  results?: AuditCategoryRelation[];
}

export interface AuditCommitteeSearch {
  id?: string;
  name?: string;
}

export interface AuditCommitteeSearchList {
  results?: AuditCommitteeSearch[];
}

export interface AuditPrimaryCategory {
  primary_category_id?: string;
  primary_category_name?: string;
}

export interface AuditPrimaryCategoryPage {
  pagination?: OffsetInfo;
  results?: AuditPrimaryCategory[];
}

export interface BaseF3Filing {
  amended_address?: string | null;
  amended_by?: number;
  amendment?: any;
  amendment_chain?: number[];
  beginning_image_number?: string;
  candidate_first_name?: string | null;
  candidate_id?: string | null;
  candidate_last_name?: string | null;
  candidate_middle_name?: string | null;
  candidate_name?: string;
  candidate_prefix?: string | null;
  candidate_suffix?: string | null;
  cash_on_hand_beginning_period?: number | null;
  city?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /** @format date */
  coverage_end_date?: string | null;
  /** @format date */
  coverage_start_date?: string | null;
  csv_url?: string;
  district?: number | null;
  document_description?: string;
  /** @format date */
  election_date?: string | null;
  election_state?: string | null;
  f3z1?: number | null;
  fec_file_id?: string;
  fec_url?: string;
  file_number?: number;
  general_election?: string | null;
  is_amended?: boolean;
  most_recent?: boolean;
  most_recent_filing?: number;
  pdf_url?: string;
  prefix?: string | null;
  primary_election?: string | null;
  /** @format date */
  receipt_date?: string | null;
  report?: any;
  report_type?: string | null;
  report_year?: number;
  /**
   * Election type
   * Convention, Primary,
   * General, Special,
   * Runoff etc.
   */
  rpt_pgi?: string | null;
  runoff_election?: string | null;
  /** @format date */
  sign_date?: string | null;
  special_election?: string | null;
  state?: string | null;
  street_1?: string | null;
  street_2?: string | null;
  suffix?: string | null;
  summary_lines?: any;
  treasurer_first_name?: string | null;
  treasurer_last_name?: string | null;
  treasurer_middle_name?: string | null;
  treasurer_name?: string;
  zip?: string | null;
}

export interface BaseF3FilingPage {
  pagination?: OffsetInfo;
  results?: BaseF3Filing[];
}

export interface BaseF3PFiling {
  amended_by?: number;
  amendment?: any;
  amendment_chain?: number[];
  beginning_image_number?: string;
  cash_on_hand_beginning_period?: number | null;
  cash_on_hand_end_period?: number | null;
  city?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /** @format date */
  coverage_end_date?: string | null;
  /** @format date */
  coverage_start_date?: string | null;
  csv_url?: string;
  debts_owed_by_committee?: number | null;
  debts_owed_to_committee?: number | null;
  document_description?: string;
  /** @format date */
  election_date?: string | null;
  election_state?: string | null;
  expenditure_subject_to_limits?: number | null;
  fec_file_id?: string;
  fec_url?: string;
  file_number?: number;
  general_election?: string | null;
  is_amended?: boolean;
  most_recent?: boolean;
  most_recent_filing?: number;
  net_contributions_cycle_to_date?: number | null;
  net_operating_expenditures_cycle_to_date?: number | null;
  pdf_url?: string;
  prefix?: string | null;
  primary_election?: string | null;
  /** @format date */
  receipt_date?: string | null;
  report?: any;
  report_type?: string | null;
  report_year?: number;
  /**
   * Election type
   * Convention, Primary,
   * General, Special,
   * Runoff etc.
   */
  rpt_pgi?: string | null;
  /** @format date */
  sign_date?: string | null;
  state?: string | null;
  street_1?: string | null;
  street_2?: string | null;
  subtotal_summary_period?: string | null;
  suffix?: string | null;
  summary_lines?: any;
  treasurer_first_name?: string | null;
  treasurer_last_name?: string | null;
  treasurer_middle_name?: string | null;
  treasurer_name?: string;
  zip?: string | null;
}

export interface BaseF3PFilingPage {
  pagination?: OffsetInfo;
  results?: BaseF3PFiling[];
}

export interface BaseF3XFiling {
  amend_address?: string | null;
  amended_by?: number;
  amendment?: any;
  amendment_chain?: number[];
  beginning_image_number?: string;
  city?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /** @format date */
  coverage_end_date?: string | null;
  /** @format date */
  coverage_start_date?: string | null;
  csv_url?: string;
  document_description?: string;
  /** @format date */
  election_date?: string | null;
  election_state?: string | null;
  fec_file_id?: string;
  fec_url?: string;
  file_number?: number;
  is_amended?: boolean;
  most_recent?: boolean;
  most_recent_filing?: number;
  pdf_url?: string;
  qualified_multicandidate_committee?: string | null;
  /** @format date */
  receipt_date?: string | null;
  report?: any;
  report_type?: string | null;
  report_year?: number;
  /**
   * Election type
   * Convention, Primary,
   * General, Special,
   * Runoff etc.
   */
  rpt_pgi?: string | null;
  /** @format date */
  sign_date?: string | null;
  state?: string | null;
  street_1?: string | null;
  street_2?: string | null;
  summary_lines?: any;
  zip?: string | null;
}

export interface BaseF3XFilingPage {
  pagination?: OffsetInfo;
  results?: BaseF3XFiling[];
}

export interface CCAggregates {
  candidate?: any;
  candidate_id?: string;
  candidate_name?: string;
  committee?: any;
  committee_id?: string;
  committee_name?: string;
  count?: number;
  cycle?: number;
  /** Explains if the money was spent in order to support or oppose a candidate or candidates. (Coded S or O for support or oppose.) This indicator applies to independent expenditures and communication costs. */
  support_oppose_indicator: string;
  total?: number;
}

export interface CCAggregatesPage {
  pagination?: OffsetInfo;
  results?: CCAggregates[];
}

export interface CCTotalsByCandidate {
  candidate_id?: string;
  cycle?: number;
  support_oppose_indicator?: string;
  total?: number;
}

export interface CCTotalsByCandidatePage {
  pagination?: OffsetInfo;
  results?: CCTotalsByCandidate[];
}

export interface CalendarDate {
  all_day?: boolean | null;
  /**
   *
   * Each type of event has a calendar category with an integer id. Options are: Open Meetings: 32, Executive Sessions: 39, Public Hearings: 40,
   * Conferences: 33, Roundtables: 34, Election Dates: 36, Federal Holidays: 37, FEA Periods: 38, Commission Meetings: 20,
   * Reporting Deadlines: 21, Conferences and Outreach: 22, AOs and Rules: 23, Other: 24, Quarterly: 25, Monthly: 26,
   * Pre and Post-Elections: 27, EC Periods:28, and IE Periods: 29
   */
  calendar_category_id?: number | null;
  /**
   *
   * Each type of event has a calendar category with an integer id. Options are: Open Meetings: 32, Executive Sessions: 39, Public Hearings: 40,
   * Conferences: 33, Roundtables: 34, Election Dates: 36, Federal Holidays: 37, FEA Periods: 38, Commission Meetings: 20,
   * Reporting Deadlines: 21, Conferences and Outreach: 22, AOs and Rules: 23, Other: 24, Quarterly: 25, Monthly: 26,
   * Pre and Post-Elections: 27, EC Periods:28, and IE Periods: 29
   */
  category?: string | null;
  description?: string;
  end_date?: any;
  /** An unique ID for an event. Useful for downloading a single event to your calendar. This ID is not a permanent, persistent ID. */
  event_id?: number;
  /**
   *
   * Can be state address or room.
   */
  location?: string | null;
  start_date?: any;
  /** The state field only applies to election dates and reporting deadlines, reporting periods and all other dates do not have the array of states to filter on */
  state?: string[] | null;
  summary?: string;
  /**
   *
   * A url for that event
   */
  url?: string | null;
}

export interface CalendarDatePage {
  pagination?: OffsetInfo;
  results?: CalendarDate[];
}

export interface Candidate {
  /** Last year a candidate was active. This field is specific to the candidate_id so if the same person runs for another office, there may be a different record for them. */
  active_through?: number | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  /**
   *  Candidates who are actively seeking office. If no value is specified, all candidates
   * are returned. When True is specified, only active candidates are returned. When False is
   * specified, only inactive candidates are returned.
   */
  candidate_inactive?: boolean | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   * @maxLength 1
   */
  candidate_status?: string | null;
  /**
   *
   * Two-year election cycle in which a candidate runs for office.
   * Calculated from Form 2. The cycle begins with
   * an odd year and is named for its ending, even year. This cycle follows
   * the traditional house election cycle and subdivides the presidential
   * and Senate elections into comparable two-year blocks. To retrieve data for
   * the entire four years of a presidential term or six years of a senatorial term,
   * you will need the `election_full` flag.
   */
  cycles?: number[] | null;
  /**
   * Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00.
   * @maxLength 2
   */
  district?: string | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   */
  district_number?: number | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  election_districts?: string[] | null;
  /** Years in which a candidate ran for office. */
  election_years?: number[] | null;
  federal_funds_flag?: boolean;
  /**
   * The day the FEC received the candidate's first filing. This is a F2 candidate registration.
   * @format date
   */
  first_file_date?: string | null;
  has_raised_funds?: boolean;
  /** inactive years */
  inactive_election_years?: number[] | null;
  /**
   * One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 1
   */
  incumbent_challenge?: string | null;
  /**
   * Explains if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 10
   */
  incumbent_challenge_full?: string | null;
  /**
   * The day the FEC received the candidate's most recent Form 2
   * @format date
   */
  last_f2_date?: string | null;
  /**
   * The day the FEC received the candidate's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently.
   * @format date-time
   */
  load_date?: string | null;
  /**
   * Name of candidate running for office
   * @maxLength 100
   */
  name?: string | null;
  /**
   * Federal office candidate runs for: H, S or P
   * @maxLength 1
   */
  office?: string | null;
  /**
   * Federal office candidate runs for: House, Senate or presidential
   * @maxLength 9
   */
  office_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Party affiliated with a candidate or committee
   * @maxLength 255
   */
  party_full?: string | null;
  /**
   * US state or territory where a candidate runs for office
   * @maxLength 2
   */
  state?: string | null;
}

export interface CandidateDetail {
  /** Last year a candidate was active. This field is specific to the candidate_id so if the same person runs for another office, there may be a different record for them. */
  active_through?: number | null;
  /**
   * City of candidate's address, as reported on their Form 2.
   * @maxLength 100
   */
  address_city?: string | null;
  /**
   * State of candidate's address, as reported on their Form 2.
   * @maxLength 2
   */
  address_state?: string | null;
  /**
   * Street of candidate's address, as reported on their Form 2.
   * @maxLength 200
   */
  address_street_1?: string | null;
  /**
   * Additional street information of candidate's address, as reported on their Form 2.
   * @maxLength 200
   */
  address_street_2?: string | null;
  /**
   * Zip code of candidate's address, as reported on their Form 2.
   * @maxLength 10
   */
  address_zip?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  /** True indicates that a candidate is inactive. */
  candidate_inactive?: boolean | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   * @maxLength 1
   */
  candidate_status?: string | null;
  /**
   *
   * Two-year election cycle in which a candidate runs for office.
   * Calculated from Form 2. The cycle begins with
   * an odd year and is named for its ending, even year. This cycle follows
   * the traditional house election cycle and subdivides the presidential
   * and Senate elections into comparable two-year blocks. To retrieve data for
   * the entire four years of a presidential term or six years of a senatorial term,
   * you will need the `election_full` flag.
   */
  cycles?: number[] | null;
  /**
   * Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00.
   * @maxLength 2
   */
  district?: string | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   */
  district_number?: number | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  election_districts?: string[] | null;
  /** Years in which a candidate ran for office. */
  election_years?: number[] | null;
  federal_funds_flag?: boolean;
  /**
   * The day the FEC received the candidate's first filing. This is a F2 candidate registration.
   * @format date
   */
  first_file_date?: string | null;
  flags?: any;
  has_raised_funds?: boolean;
  /**
   * One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 1
   */
  incumbent_challenge?: string | null;
  /**
   * Explains if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 10
   */
  incumbent_challenge_full?: string | null;
  /**
   * The day the FEC received the candidate's most recent Form 2
   * @format date
   */
  last_f2_date?: string | null;
  /**
   * The day the FEC received the candidate's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently.
   * @format date-time
   */
  load_date?: string | null;
  /**
   * Name of candidate running for office
   * @maxLength 100
   */
  name?: string | null;
  /**
   * Federal office candidate runs for: H, S or P
   * @maxLength 1
   */
  office?: string | null;
  /**
   * Federal office candidate runs for: House, Senate or presidential
   * @maxLength 9
   */
  office_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Party affiliated with a candidate or committee
   * @maxLength 255
   */
  party_full?: string | null;
  /**
   * US state or territory where a candidate runs for office
   * @maxLength 2
   */
  state?: string | null;
}

export interface CandidateDetailPage {
  pagination?: OffsetInfo;
  results?: CandidateDetail[];
}

export interface CandidateFlags {
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id: string;
  /** A boolean the describes if a presidential candidate has accepted federal funds. The flag will be false for House and Senate candidates. */
  federal_funds_flag?: boolean | null;
  /** A boolean that describes if a candidate's committee has ever received any receipts for their campaign for this particular office. (Candidates have separate candidate IDs for each office.) */
  has_raised_funds?: boolean | null;
}

export interface CandidateFlagsPage {
  pagination?: OffsetInfo;
  results?: CandidateFlags[];
}

export interface CandidateHistory {
  /** Last year a candidate was active. This field is specific to the candidate_id so if the same person runs for another office, there may be a different record for them. */
  active_through?: number | null;
  /**
   * City of candidate's address, as reported on their Form 2.
   * @maxLength 100
   */
  address_city?: string | null;
  /**
   * State of candidate's address, as reported on their Form 2.
   * @maxLength 2
   */
  address_state?: string | null;
  /**
   * Street of candidate's address, as reported on their Form 2.
   * @maxLength 200
   */
  address_street_1?: string | null;
  /**
   * Additional street information of candidate's address, as reported on their Form 2.
   * @maxLength 200
   */
  address_street_2?: string | null;
  /**
   * Zip code of candidate's address, as reported on their Form 2.
   * @maxLength 10
   */
  address_zip?: string | null;
  /** The last year of the cycle for this election. */
  candidate_election_year?: number | null;
  /**
   * First name of candidate running for office
   * @maxLength 100
   */
  candidate_first_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id: string;
  /**
   *
   * True indicates that a candidate is inactive.
   */
  candidate_inactive?: boolean | null;
  /**
   *
   * Candidate last name
   * @maxLength 100
   */
  candidate_last_name?: string | null;
  /**
   * Middle name of candidate running for office
   * @maxLength 100
   */
  candidate_middle_name?: string | null;
  /**
   * Name prefix of candidate running for office
   * @maxLength 100
   */
  candidate_prefix?: string | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   * @maxLength 1
   */
  candidate_status?: string | null;
  /**
   * Name suffix of candidate running for office
   * @maxLength 100
   */
  candidate_suffix?: string | null;
  /**
   *
   * Two-year election cycle in which a candidate runs for office.
   * Calculated from Form 2. The cycle begins with
   * an odd year and is named for its ending, even year. This cycle follows
   * the traditional house election cycle and subdivides the presidential
   * and Senate elections into comparable two-year blocks. To retrieve data for
   * the entire four years of a presidential term or six years of a senatorial term,
   * you will need the `election_full` flag.
   */
  cycles?: number[] | null;
  /**
   * Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00.
   * @maxLength 2
   */
  district?: string | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   */
  district_number?: number | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  election_districts?: string[] | null;
  /** Years in which a candidate ran for office. */
  election_years?: number[] | null;
  /** FEC cycles are included in candidate election years. */
  fec_cycles_in_election?: number[] | null;
  /**
   * The day the FEC received the candidate's first filing. This is a F2 candidate registration.
   * @format date
   */
  first_file_date?: string | null;
  flags?: any;
  /**
   * One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 1
   */
  incumbent_challenge?: string | null;
  /**
   * Explains if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 10
   */
  incumbent_challenge_full?: string | null;
  /**
   * The day the FEC received the candidate's most recent Form 2
   * @format date
   */
  last_f2_date?: string | null;
  /**
   * The day the FEC received the candidate's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently.
   * @format date-time
   */
  load_date?: string | null;
  /**
   * Name of candidate running for office
   * @maxLength 100
   */
  name?: string | null;
  /**
   * Federal office candidate runs for: H, S or P
   * @maxLength 1
   */
  office?: string | null;
  /**
   * Federal office candidate runs for: House, Senate or presidential
   * @maxLength 9
   */
  office_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Party affiliated with a candidate or committee
   * @maxLength 255
   */
  party_full?: string | null;
  /** Rounded election years in which a candidate ran for office */
  rounded_election_years?: number[] | null;
  /**
   * US state or territory where a candidate runs for office
   * @maxLength 2
   */
  state?: string | null;
  /**
   *
   * Two-year election cycle in which a candidate runs for office.
   * Calculated from Form 2. The cycle begins with
   * an odd year and is named for its ending, even year. This cycle follows
   * the traditional house election cycle and subdivides the presidential
   * and Senate elections into comparable two-year blocks. To retrieve data for
   * the entire four years of a presidential term or six years of a senatorial term,
   * you will need the `election_full` flag.
   */
  two_year_period: number;
}

export interface CandidateHistoryPage {
  pagination?: OffsetInfo;
  results?: CandidateHistory[];
}

export interface CandidateHistoryTotal {
  /** Last year a candidate was active. This field is specific to the candidate_id so if the same person runs for another office, there may be a different record for them. */
  active_through?: number | null;
  /**
   * City of candidate's address, as reported on their Form 2.
   * @maxLength 100
   */
  address_city?: string | null;
  /**
   * State of candidate's address, as reported on their Form 2.
   * @maxLength 2
   */
  address_state?: string | null;
  /**
   * Street of candidate's address, as reported on their Form 2.
   * @maxLength 200
   */
  address_street_1?: string | null;
  /**
   * Additional street information of candidate's address, as reported on their Form 2.
   * @maxLength 200
   */
  address_street_2?: string | null;
  /**
   * Zip code of candidate's address, as reported on their Form 2.
   * @maxLength 10
   */
  address_zip?: string | null;
  /** The last year of the cycle for this election. */
  candidate_election_year?: number | null;
  /**
   * First name of candidate running for office
   * @maxLength 100
   */
  candidate_first_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id: string;
  /**
   *
   * True indicates that a candidate is inactive.
   */
  candidate_inactive?: boolean | null;
  /**
   *
   * Candidate last name
   * @maxLength 100
   */
  candidate_last_name?: string | null;
  /**
   * Middle name of candidate running for office
   * @maxLength 100
   */
  candidate_middle_name?: string | null;
  /**
   * Name prefix of candidate running for office
   * @maxLength 100
   */
  candidate_prefix?: string | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   * @maxLength 1
   */
  candidate_status?: string | null;
  /**
   * Name suffix of candidate running for office
   * @maxLength 100
   */
  candidate_suffix?: string | null;
  /** Ending cash balance on the most recent filing */
  cash_on_hand_end_period?: number | null;
  /**
   * Ending date of the reporting period
   * @format date
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date
   */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle: number;
  /**
   *
   * Two-year election cycle in which a candidate runs for office.
   * Calculated from Form 2. The cycle begins with
   * an odd year and is named for its ending, even year. This cycle follows
   * the traditional house election cycle and subdivides the presidential
   * and Senate elections into comparable two-year blocks. To retrieve data for
   * the entire four years of a presidential term or six years of a senatorial term,
   * you will need the `election_full` flag.
   */
  cycles?: number[] | null;
  /** Debts owed by the committee */
  debts_owed_by_committee?: number | null;
  disbursements?: number;
  /**
   * Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00.
   * @maxLength 2
   */
  district?: string | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   */
  district_number?: number | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  election_districts?: string[] | null;
  /** Year of election */
  election_year?: number;
  /** Years in which a candidate ran for office. */
  election_years?: number[] | null;
  /** FEC cycles are included in candidate election years. */
  fec_cycles_in_election?: number[] | null;
  /** A boolean the describes if a presidential candidate has accepted federal funds. The flag will be false for House and Senate candidates. */
  federal_funds_flag?: boolean | null;
  /**
   * The day the FEC received the candidate's first filing. This is a F2 candidate registration.
   * @format date
   */
  first_file_date?: string | null;
  flags?: any;
  /** A boolean that describes if a candidate's committee has ever received any receipts for their campaign for this particular office. (Candidates have separate candidate IDs for each office.) */
  has_raised_funds?: boolean | null;
  /**
   * One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 1
   */
  incumbent_challenge?: string | null;
  /**
   * Explains if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 10
   */
  incumbent_challenge_full?: string | null;
  individual_itemized_contributions?: number;
  is_election: boolean;
  /**
   * The day the FEC received the candidate's most recent Form 2
   * @format date
   */
  last_f2_date?: string | null;
  /**
   * The day the FEC received the candidate's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently.
   * @format date-time
   */
  load_date?: string | null;
  /**
   * Name of candidate running for office
   * @maxLength 100
   */
  name?: string | null;
  /**
   * Federal office candidate runs for: H, S or P
   * @maxLength 1
   */
  office?: string | null;
  /**
   * Federal office candidate runs for: House, Senate or presidential
   * @maxLength 9
   */
  office_full?: string | null;
  other_political_committee_contributions?: number;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Party affiliated with a candidate or committee
   * @maxLength 255
   */
  party_full?: string | null;
  receipts?: number;
  /** Rounded election years in which a candidate ran for office */
  rounded_election_years?: number[] | null;
  /**
   * US state or territory where a candidate runs for office
   * @maxLength 2
   */
  state?: string | null;
  /**
   * US state or territory where a candidate runs for office
   * @maxLength 50
   */
  state_full?: string | null;
  transfers_from_other_authorized_committee?: number;
  /**
   *
   * Two-year election cycle in which a candidate runs for office.
   * Calculated from Form 2. The cycle begins with
   * an odd year and is named for its ending, even year. This cycle follows
   * the traditional house election cycle and subdivides the presidential
   * and Senate elections into comparable two-year blocks. To retrieve data for
   * the entire four years of a presidential term or six years of a senatorial term,
   * you will need the `election_full` flag.
   */
  two_year_period: number;
}

export interface CandidateHistoryTotalPage {
  pagination?: OffsetInfo;
  results?: CandidateHistoryTotal[];
}

export interface CandidatePage {
  pagination?: OffsetInfo;
  results?: Candidate[];
}

export interface CandidateSearch {
  /** Last year a candidate was active. This field is specific to the candidate_id so if the same person runs for another office, there may be a different record for them. */
  active_through?: number | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  /**
   *  Candidates who are actively seeking office. If no value is specified, all candidates
   * are returned. When True is specified, only active candidates are returned. When False is
   * specified, only inactive candidates are returned.
   */
  candidate_inactive?: boolean | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   * @maxLength 1
   */
  candidate_status?: string | null;
  /**
   *
   * Two-year election cycle in which a candidate runs for office.
   * Calculated from Form 2. The cycle begins with
   * an odd year and is named for its ending, even year. This cycle follows
   * the traditional house election cycle and subdivides the presidential
   * and Senate elections into comparable two-year blocks. To retrieve data for
   * the entire four years of a presidential term or six years of a senatorial term,
   * you will need the `election_full` flag.
   */
  cycles?: number[] | null;
  /**
   * Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00.
   * @maxLength 2
   */
  district?: string | null;
  /**
   * One-letter code explaining if the candidate is:
   *         - C present candidate
   *         - F future candidate
   *         - N not yet a candidate
   *         - P prior candidate
   */
  district_number?: number | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  election_districts?: string[] | null;
  /** Years in which a candidate ran for office. */
  election_years?: number[] | null;
  federal_funds_flag?: boolean;
  /**
   * The day the FEC received the candidate's first filing. This is a F2 candidate registration.
   * @format date
   */
  first_file_date?: string | null;
  has_raised_funds?: boolean;
  /** inactive years */
  inactive_election_years?: number[] | null;
  /**
   * One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 1
   */
  incumbent_challenge?: string | null;
  /**
   * Explains if the candidate is an incumbent, a challenger, or if the seat is open.
   * @maxLength 10
   */
  incumbent_challenge_full?: string | null;
  /**
   * The day the FEC received the candidate's most recent Form 2
   * @format date
   */
  last_f2_date?: string | null;
  /**
   * The day the FEC received the candidate's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently.
   * @format date-time
   */
  load_date?: string | null;
  /**
   * Name of candidate running for office
   * @maxLength 100
   */
  name?: string | null;
  /**
   * Federal office candidate runs for: H, S or P
   * @maxLength 1
   */
  office?: string | null;
  /**
   * Federal office candidate runs for: House, Senate or presidential
   * @maxLength 9
   */
  office_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Party affiliated with a candidate or committee
   * @maxLength 255
   */
  party_full?: string | null;
  principal_committees?: PrincipalCommittee[];
  /**
   * US state or territory where a candidate runs for office
   * @maxLength 2
   */
  state?: string | null;
}

export interface CandidateSearchBaseSchema {
  id?: string;
  name?: string;
  office_sought?: string;
}

export interface CandidateSearchListSchema {
  results?: CandidateSearchBaseSchema[];
}

export interface CandidateSearchPage {
  pagination?: OffsetInfo;
  results?: CandidateSearch[];
}

export interface CandidateTotal {
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id: string;
  /**
   *
   * True indicates that a candidate is inactive.
   */
  candidate_inactive?: boolean | null;
  /** Ending cash balance on the most recent filing */
  cash_on_hand_end_period?: number | null;
  /**
   * Ending date of the reporting period
   * @format date
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date
   */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle: number;
  /** Debts owed by the committee */
  debts_owed_by_committee?: number | null;
  disbursements?: number;
  /**
   * Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00.
   * @maxLength 2
   */
  district?: string | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  district_number?: number | null;
  /** Year of election */
  election_year?: number;
  /** A boolean the describes if a presidential candidate has accepted federal funds. The flag will be false for House and Senate candidates. */
  federal_funds_flag?: boolean | null;
  /** A boolean that describes if a candidate's committee has ever received any receipts for their campaign for this particular office. (Candidates have separate candidate IDs for each office.) */
  has_raised_funds?: boolean | null;
  individual_itemized_contributions?: number;
  is_election: boolean;
  /**
   * Federal office candidate runs for: H, S or P
   * @maxLength 1
   */
  office?: string | null;
  other_political_committee_contributions?: number;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  receipts?: number;
  /**
   * US state or territory where a candidate runs for office
   * @maxLength 2
   */
  state?: string | null;
  /**
   * US state or territory where a candidate runs for office
   * @maxLength 50
   */
  state_full?: string | null;
  transfers_from_other_authorized_committee?: number;
}

export interface CandidateTotalAggregate {
  district?: string;
  district_number?: number;
  election_year?: number;
  office?: string;
  party?: string;
  state?: string;
  state_full?: string;
  total_cash_on_hand_end_period?: number;
  total_debts_owed_by_committee?: number;
  total_disbursements?: number;
  total_individual_itemized_contributions?: number;
  total_other_political_committee_contributions?: number;
  total_receipts?: number;
  total_transfers_from_other_authorized_committee?: number;
}

export interface CandidateTotalAggregatePage {
  pagination?: OffsetInfo;
  results?: CandidateTotalAggregate[];
}

export interface CandidateTotalPage {
  pagination?: OffsetInfo;
  results?: CandidateTotal[];
}

export interface CandidateTotalsDetailHouseSenate {
  all_other_loans?: number;
  candidate_contribution?: number;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  candidate_election_year: number;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id: string;
  contribution_refunds?: number;
  contributions?: number;
  /** @format date-time */
  coverage_end_date?: string | null;
  /** @format date-time */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle: number;
  disbursements?: number;
  election_full: boolean;
  exempt_legal_accounting_disbursement?: number;
  federal_funds?: number;
  fundraising_disbursements?: number;
  individual_contributions?: number;
  individual_itemized_contributions?: number;
  individual_unitemized_contributions?: number;
  last_beginning_image_number?: string;
  last_cash_on_hand_end_period?: number;
  last_debts_owed_by_committee?: number;
  last_debts_owed_to_committee?: number;
  last_net_contributions?: number;
  last_net_operating_expenditures?: number;
  last_report_type_full?: string | null;
  last_report_year?: number | null;
  loan_repayments?: number;
  loan_repayments_candidate_loans?: number;
  loan_repayments_other_loans?: number;
  loans?: number;
  loans_made_by_candidate?: number;
  net_contributions?: number;
  net_operating_expenditures?: number;
  offsets_to_fundraising_expenditures?: number;
  offsets_to_legal_accounting?: number;
  offsets_to_operating_expenditures?: number;
  operating_expenditures?: number;
  other_disbursements?: number;
  other_political_committee_contributions?: number;
  other_receipts?: number;
  political_party_committee_contributions?: number;
  receipts?: number;
  refunded_individual_contributions?: number;
  refunded_other_political_committee_contributions?: number;
  refunded_political_party_committee_contributions?: number;
  total_offsets_to_operating_expenditures?: number;
  /** @format date-time */
  transaction_coverage_date?: string | null;
  transfers_from_other_authorized_committee?: number;
  transfers_to_other_authorized_committee?: number;
}

export interface CandidateTotalsDetailHouseSenatePage {
  pagination?: OffsetInfo;
  results?: CandidateTotalsDetailHouseSenate[];
}

export interface CandidateTotalsDetailPresidential {
  candidate_contribution?: number;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  candidate_election_year: number;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id: string;
  contribution_refunds?: number;
  contributions?: number;
  /** @format date-time */
  coverage_end_date?: string | null;
  /** @format date-time */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle: number;
  disbursements?: number;
  election_full: boolean;
  exempt_legal_accounting_disbursement?: number;
  federal_funds?: number;
  fundraising_disbursements?: number;
  individual_contributions?: number;
  individual_itemized_contributions?: number;
  individual_unitemized_contributions?: number;
  last_beginning_image_number?: string;
  last_cash_on_hand_end_period?: number;
  last_debts_owed_by_committee?: number;
  last_debts_owed_to_committee?: number;
  last_report_type_full?: string | null;
  last_report_year?: number | null;
  loan_repayments_made?: number;
  loans_received?: number;
  loans_received_from_candidate?: number;
  net_contributions?: number;
  net_operating_expenditures?: number;
  offsets_to_fundraising_expenditures?: number;
  offsets_to_legal_accounting?: number;
  offsets_to_operating_expenditures?: number;
  operating_expenditures?: number;
  other_disbursements?: number;
  other_loans_received?: number;
  other_political_committee_contributions?: number;
  other_receipts?: number;
  political_party_committee_contributions?: number;
  receipts?: number;
  refunded_individual_contributions?: number;
  refunded_other_political_committee_contributions?: number;
  refunded_political_party_committee_contributions?: number;
  repayments_loans_made_by_candidate?: number;
  repayments_other_loans?: number;
  total_offsets_to_operating_expenditures?: number;
  /** @format date-time */
  transaction_coverage_date?: string | null;
  transfers_from_affiliated_committee?: number;
  transfers_to_other_authorized_committee?: number;
}

export interface CandidateTotalsDetailPresidentialPage {
  pagination?: OffsetInfo;
  results?: CandidateTotalsDetailPresidential[];
}

export interface Committee {
  /**
   *
   * Affiliated committee or connected organization
   * @maxLength 100
   */
  affiliated_committee_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_ids?: string[] | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 1
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 50
   */
  committee_type_full?: string | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycles?: number[] | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 1
   */
  designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 25
   */
  designation_full?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /** @format date */
  first_f1_date?: string;
  /** @format date */
  first_file_date?: string;
  /** @format date */
  last_f1_date?: string;
  /** @format date */
  last_file_date?: string;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 100
   */
  name?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 50
   */
  party_full?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC. If a person runs for several offices, that person will have separate candidate IDs for each office. This is a filter for Leadership PAC sponsor.
   */
  sponsor_candidate_ids?: string[] | null;
  sponsor_candidate_list?: PacSponsorCandidate[];
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  state?: string | null;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
}

export interface CommitteeDetail {
  /**
   *
   * Affiliated committee or connected organization
   * @maxLength 100
   */
  affiliated_committee_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_ids?: string[] | null;
  /**
   *
   * City of committee as reported on the Form 1
   * @maxLength 50
   */
  city?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 1
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 50
   */
  committee_type_full?: string | null;
  /**
   *
   * City of committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_city?: string | null;
  /**
   *
   * Name 1 of committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_name_1?: string | null;
  /**
   *
   * Name 2 of committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_name_2?: string | null;
  /**
   *
   * Full name of committee custodian as reported on the Form 1
   * @maxLength 100
   */
  custodian_name_full?: string | null;
  /**
   *
   * Middle name of committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_name_middle?: string | null;
  /**
   *
   * Name prefix of committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_name_prefix?: string | null;
  /**
   *
   * Suffix name of the committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_name_suffix?: string | null;
  /**
   *
   * Name title of the committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_name_title?: string | null;
  /**
   *
   * Phone number of committee custodian as reported on the Form 1
   * @maxLength 15
   */
  custodian_phone?: string | null;
  /**
   *
   * State of committee custodian as reported on the Form 1
   * @maxLength 2
   */
  custodian_state?: string | null;
  /**
   *
   * Street address of the committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_street_1?: string | null;
  /**
   *
   * Second line of the street address of the committee custodian as reported on the Form 1
   * @maxLength 50
   */
  custodian_street_2?: string | null;
  /**
   *
   * Zip code of the committee custodian as reported on the Form 1
   * @maxLength 9
   */
  custodian_zip?: string | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycles?: number[] | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 1
   */
  designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 25
   */
  designation_full?: string | null;
  /**
   *
   * Email as reported on the Form 1
   * @maxLength 50
   */
  email?: string | null;
  /**
   *
   * Fax as reported on the Form 1
   * @maxLength 10
   */
  fax?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  /**
   * The form where the underlying data comes from, for example, Form 1 would appear as F1:
   *     - F1   Statement of Organization
   *     - F1M  Notification of Multicandidate Status
   *     - F2   Statement of Candidacy
   *     - F3   Report of Receipts and Disbursements for an Authorized Committee
   *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
   *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
   *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
   *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
   *     - F5   Report of Independent Expenditures Made and Contributions Received
   *     - F6   48 Hour Notice of Contributions/Loans Received
   *     - F7   Report of Communication Costs by Corporations and Membership Organizations
   *     - F8   Debt Settlement Plan
   *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
   *     - F13  Report of Donations Accepted for Inaugural Committee
   *     - F99  Miscellaneous Text
   *     - FRQ  Request for Additional Information
   * @maxLength 3
   */
  form_type?: string | null;
  jfc_committee?: JFCCommittee[];
  /**
   * The day the FEC received the committee's most recent Form 1
   * @format date
   */
  last_f1_date?: string | null;
  /**
   * The day the FEC received the committee's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   *
   * Indicates if the committee is a leadership PAC
   * @maxLength 50
   */
  leadership_pac?: string | null;
  /**
   *
   * Indicates if the committee is a lobbyist registrant PAC
   * @maxLength 1
   */
  lobbyist_registrant_pac?: string | null;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 100
   */
  name?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 50
   */
  party_full?: string | null;
  /**
   *
   * Code for the type of party the committee is, only if applicable
   * @maxLength 3
   */
  party_type?: string | null;
  /**
   *
   * Description of the type of party the committee is, only if applicable
   * @maxLength 15
   */
  party_type_full?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC. If a person runs for several offices, that person will have separate candidate IDs for each office. This is a filter for Leadership PAC sponsor.
   */
  sponsor_candidate_ids?: string[] | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  state?: string | null;
  /**
   *
   * State of committee as reported on the Form 1
   * @maxLength 50
   */
  state_full?: string | null;
  /**
   *
   * Street address of committee as reported on the Form 1
   * @maxLength 50
   */
  street_1?: string | null;
  /**
   *
   * Second line of street address of committee as reported on the Form 1
   * @maxLength 50
   */
  street_2?: string | null;
  /**
   *
   * City of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_city?: string | null;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
  /**
   *
   * Name 1 of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_name_1?: string | null;
  /**
   *
   * Name 2 of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_name_2?: string | null;
  /**
   *
   * Middle name of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_name_middle?: string | null;
  /**
   *
   * Name Prefix of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_name_prefix?: string | null;
  /**
   *
   * Name suffix of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_name_suffix?: string | null;
  /**
   *
   * Name title of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_name_title?: string | null;
  /**
   *
   * Phone of committee treasurer as reported on the Form 1
   * @maxLength 15
   */
  treasurer_phone?: string | null;
  /**
   *
   * State of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_state?: string | null;
  /**
   *
   * Street of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_street_1?: string | null;
  /**
   *
   * Second line of the street of committee treasurer as reported on the Form 1
   * @maxLength 50
   */
  treasurer_street_2?: string | null;
  /**
   *
   * Zip code of committee treasurer as reported on the Form 1
   * @maxLength 9
   */
  treasurer_zip?: string | null;
  /**
   *
   * Website url as reported on the Form 1
   * @maxLength 50
   */
  website?: string | null;
  /**
   *
   * Zip code of committee as reported on the Form 1
   * @maxLength 9
   */
  zip?: string | null;
}

export interface CommitteeDetailPage {
  pagination?: OffsetInfo;
  results?: CommitteeDetail[];
}

export interface CommitteeHistory {
  /**
   *
   * Affiliated committee or connected organization
   * @maxLength 100
   */
  affiliated_committee_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_ids?: string[] | null;
  /**
   *
   * City of committee as reported on the Form 1
   * @maxLength 50
   */
  city?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 1
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 50
   */
  committee_type_full?: string | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycle: number;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycles?: number[] | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1), and the committee has filling activity during the cycle
   */
  cycles_has_activity?: number[] | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s), and the committee files the financial reports
   * ('F3', 'F3X', 'F3P', 'F3L', 'F4', 'F5', 'F7', 'F13') during this cycle.
   */
  cycles_has_financial?: number[] | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 1
   */
  designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 25
   */
  designation_full?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  /**
   *
   * True indicates that a committee is active.
   */
  is_active?: boolean | null;
  jfc_committee?: JFCCommittee[];
  /**
   *
   * The latest two year election cycle that the committee has filings
   */
  last_cycle_has_activity?: number | null;
  /**
   *
   * The latest two year election cycle that the committee files the financial reports
   * ('F3', 'F3X', 'F3P', 'F3L', 'F4', 'F5', 'F7', 'F13').
   */
  last_cycle_has_financial?: number | null;
  /**
   * The day the FEC received the committee's most recent Form 1
   * @format date
   */
  last_f1_date?: string | null;
  /**
   * The day the FEC received the committee's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 100
   */
  name?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 50
   */
  party_full?: string | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  state?: string | null;
  /**
   *
   * State of committee as reported on the Form 1
   * @maxLength 50
   */
  state_full?: string | null;
  /**
   *
   * Street address of committee as reported on the Form 1
   * @maxLength 50
   */
  street_1?: string | null;
  /**
   *
   * Second line of street address of committee as reported on the Form 1
   * @maxLength 50
   */
  street_2?: string | null;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
  /**
   *
   * Zip code of committee as reported on the Form 1
   * @maxLength 9
   */
  zip?: string | null;
}

export interface CommitteeHistoryPage {
  pagination?: OffsetInfo;
  results?: CommitteeHistory[];
}

export interface CommitteeHistoryProfile {
  /**
   *
   * Affiliated committee or connected organization
   * @maxLength 100
   */
  affiliated_committee_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_ids?: string[] | null;
  /**
   *
   * City of committee as reported on the Form 1
   * @maxLength 50
   */
  city?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   *
   * Display the label of committee based on committee type, designation and organization type
   */
  committee_label?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 1
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 50
   */
  committee_type_full?: string | null;
  /** True indicates that a candidate committee had been converted to a PAC */
  convert_to_pac_flag?: boolean | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycle: number;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycles?: number[] | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1), and the committee has filling activity during the cycle
   */
  cycles_has_activity?: number[] | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s), and the committee files the financial reports
   * ('F3', 'F3X', 'F3P', 'F3L', 'F4', 'F5', 'F7', 'F13') during this cycle.
   */
  cycles_has_financial?: number[] | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 1
   */
  designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 25
   */
  designation_full?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  /** Year a candidate runs for federal office. */
  former_candidate_election_year?: number | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   * @maxLength 9
   */
  former_candidate_id?: string | null;
  /**
   * Name of candidate running for office
   * @maxLength 90
   */
  former_candidate_name?: string | null;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 200
   */
  former_committee_name?: string | null;
  /**
   *
   * True indicates that a committee is active.
   */
  is_active?: boolean | null;
  jfc_committee?: JFCCommittee[];
  /**
   *
   * The latest two year election cycle that the committee has filings
   */
  last_cycle_has_activity?: number | null;
  /**
   *
   * The latest two year election cycle that the committee files the financial reports
   * ('F3', 'F3X', 'F3P', 'F3L', 'F4', 'F5', 'F7', 'F13').
   */
  last_cycle_has_financial?: number | null;
  /**
   * The day the FEC received the committee's most recent Form 1
   * @format date
   */
  last_f1_date?: string | null;
  /**
   * The day the FEC received the committee's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 100
   */
  name?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 50
   */
  party_full?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC. If a person runs for several offices, that person will have separate candidate IDs for each office. This is a filter for Leadership PAC sponsor.
   */
  sponsor_candidate_ids?: string[] | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  state?: string | null;
  /**
   *
   * State of committee as reported on the Form 1
   * @maxLength 50
   */
  state_full?: string | null;
  /**
   *
   * Street address of committee as reported on the Form 1
   * @maxLength 50
   */
  street_1?: string | null;
  /**
   *
   * Second line of street address of committee as reported on the Form 1
   * @maxLength 50
   */
  street_2?: string | null;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
  /**
   *
   * Zip code of committee as reported on the Form 1
   * @maxLength 9
   */
  zip?: string | null;
}

export interface CommitteeHistoryProfilePage {
  pagination?: OffsetInfo;
  results?: CommitteeHistoryProfile[];
}

export interface CommitteePage {
  pagination?: OffsetInfo;
  results?: Committee[];
}

export interface CommitteeReports {
  aggregate_amount_personal_contributions_general?: number;
  aggregate_contributions_personal_funds_primary?: number;
  all_loans_received_period?: number;
  all_loans_received_ytd?: number;
  all_other_loans_period?: number;
  all_other_loans_ytd?: number;
  allocated_federal_election_levin_share_period?: number;
  /**
   *
   * The first value in the chain is the original filing.  The ordering in the chain reflects the order the
   * amendments were filed up to the amendment being inspected.
   */
  amendment_chain?: number[] | null;
  amendment_indicator?: string | null;
  amendment_indicator_full?: string | null;
  beginning_image_number?: string;
  calendar_ytd?: number | null;
  candidate_contribution_period?: number;
  candidate_contribution_ytd?: number;
  cash_on_hand_beginning_calendar_ytd?: number;
  cash_on_hand_beginning_period?: number;
  cash_on_hand_close_ytd?: number;
  cash_on_hand_end_period?: number;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  committee_type?: string;
  coordinated_expenditures_by_party_committee_period?: number;
  coordinated_expenditures_by_party_committee_ytd?: number;
  /**
   * Ending date of the reporting period
   * @format date-time
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date-time
   */
  coverage_start_date?: string | null;
  csv_url?: string;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle?: number | null;
  debts_owed_by_committee?: number;
  debts_owed_to_committee?: number;
  document_description?: string;
  end_image_number?: string;
  exempt_legal_accounting_disbursement_period?: number;
  exempt_legal_accounting_disbursement_ytd?: number;
  expenditure_subject_to_limits?: number;
  fec_file_id?: string;
  fec_url?: string;
  fed_candidate_committee_contribution_refunds_ytd?: number;
  fed_candidate_committee_contributions_period?: number;
  fed_candidate_committee_contributions_ytd?: number;
  fed_candidate_contribution_refunds_period?: number;
  federal_funds_period?: number;
  federal_funds_ytd?: number;
  file_number?: number | null;
  fundraising_disbursements_period?: number;
  fundraising_disbursements_ytd?: number;
  gross_receipt_authorized_committee_general?: number;
  gross_receipt_authorized_committee_primary?: number;
  gross_receipt_minus_personal_contribution_general?: number;
  gross_receipt_minus_personal_contributions_primary?: number;
  /**
   *
   * HTML link to the filing.
   */
  html_url?: string | null;
  independent_contributions_period?: number;
  independent_expenditures_period?: number;
  independent_expenditures_ytd?: number;
  /** Individual itemized contributions are from individuals whose aggregate contributions total over $200 per individual per year. Be aware, some filers choose to itemize donations $200 or less. total for the reporting period */
  individual_itemized_contributions_period?: number | null;
  /** Individual itemized contributions are from individuals whose aggregate contributions total over $200 per individual per year. Be aware, some filers choose to itemize donations $200 or less. total for the year to date */
  individual_itemized_contributions_ytd?: number | null;
  /** Unitemized contributions are made individuals whose aggregate contributions total $200 or less per individual per year. Be aware, some filers choose to itemize donations $200 or less and in that case those donations will appear in the itemized total. total for the reporting period */
  individual_unitemized_contributions_period?: number | null;
  /** Unitemized contributions are made individuals whose aggregate contributions total $200 or less per individual per year. Be aware, some filers choose to itemize donations $200 or less and in that case those donations will appear in the itemized total. total for the year to date */
  individual_unitemized_contributions_ytd?: number | null;
  /**
   *
   * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
   */
  is_amended?: boolean | null;
  items_on_hand_liquidated?: number;
  loan_repayments_candidate_loans_period?: number;
  loan_repayments_candidate_loans_ytd?: number;
  loan_repayments_made_period?: number;
  loan_repayments_made_ytd?: number;
  loan_repayments_other_loans_period?: number;
  loan_repayments_other_loans_ytd?: number;
  loan_repayments_received_period?: number;
  loan_repayments_received_ytd?: number;
  loans_made_by_candidate_period?: number;
  loans_made_by_candidate_ytd?: number;
  loans_made_period?: number;
  loans_made_ytd?: number;
  loans_received_from_candidate_period?: number;
  loans_received_from_candidate_ytd?: number;
  /** The method used to file with the FEC, either electronic or on paper. */
  means_filed?: string | null;
  /**
   *
   * Report is either new or is the most-recently filed amendment
   */
  most_recent?: boolean | null;
  most_recent_file_number?: number;
  net_contributions_cycle_to_date?: number;
  net_contributions_period?: number;
  net_contributions_ytd?: number;
  net_operating_expenditures_cycle_to_date?: number;
  net_operating_expenditures_period?: number;
  net_operating_expenditures_ytd?: number;
  non_allocated_fed_election_activity_period?: number;
  non_allocated_fed_election_activity_ytd?: number;
  nonfed_share_allocated_disbursements_period?: number;
  offsets_to_fundraising_expenditures_period?: number;
  offsets_to_fundraising_expenditures_ytd?: number;
  offsets_to_legal_accounting_period?: number;
  offsets_to_legal_accounting_ytd?: number;
  /** Offsets to operating expenditures total for the reporting period */
  offsets_to_operating_expenditures_period?: number | null;
  /** Offsets to operating expenditures total for the year to date */
  offsets_to_operating_expenditures_ytd?: number | null;
  operating_expenditures_period?: number;
  operating_expenditures_ytd?: number;
  other_disbursements_period?: number;
  other_disbursements_ytd?: number;
  other_fed_operating_expenditures_period?: number;
  other_fed_operating_expenditures_ytd?: number;
  other_fed_receipts_period?: number;
  other_fed_receipts_ytd?: number;
  other_loans_received_period?: number;
  other_loans_received_ytd?: number;
  other_political_committee_contributions_period?: number;
  other_political_committee_contributions_ytd?: number;
  other_receipts_period?: number;
  other_receipts_ytd?: number;
  pdf_url?: string;
  political_party_committee_contributions_period?: number;
  political_party_committee_contributions_ytd?: number;
  previous_file_number?: number;
  /**
   * Date the FEC received the electronic or paper record
   * @format date
   */
  receipt_date?: string | null;
  refunded_individual_contributions_period?: number;
  refunded_individual_contributions_ytd?: number;
  refunded_other_political_committee_contributions_period?: number;
  refunded_other_political_committee_contributions_ytd?: number;
  refunded_political_party_committee_contributions_period?: number;
  refunded_political_party_committee_contributions_ytd?: number;
  refunds_total_contributions_col_total_ytd?: number;
  repayments_loans_made_by_candidate_period?: number;
  repayments_loans_made_candidate_ytd?: number;
  repayments_other_loans_period?: number;
  repayments_other_loans_ytd?: number;
  report_form?: string;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type_full?: string | null;
  /**
   *
   * Forms with coverage date -
   *     year from the coverage ending date.
   * Forms without coverage date -
   *     year from the receipt date.
   */
  report_year?: number | null;
  shared_fed_activity_nonfed_ytd?: number;
  shared_fed_activity_period?: number;
  shared_fed_activity_ytd?: number;
  shared_fed_operating_expenditures_period?: number;
  shared_fed_operating_expenditures_ytd?: number;
  shared_nonfed_operating_expenditures_period?: number;
  shared_nonfed_operating_expenditures_ytd?: number;
  subtotal_period?: number;
  subtotal_summary_page_period?: number;
  subtotal_summary_period?: number;
  subtotal_summary_ytd?: number;
  total_contribution_refunds_col_total_period?: number;
  total_contribution_refunds_period?: number;
  total_contribution_refunds_ytd?: number;
  total_contributions_column_total_period?: number;
  total_contributions_period?: number;
  total_contributions_ytd?: number;
  total_disbursements_period?: number;
  total_disbursements_ytd?: number;
  total_fed_disbursements_period?: number;
  total_fed_disbursements_ytd?: number;
  total_fed_election_activity_period?: number;
  total_fed_election_activity_ytd?: number;
  total_fed_operating_expenditures_period?: number;
  total_fed_operating_expenditures_ytd?: number;
  total_fed_receipts_period?: number;
  total_fed_receipts_ytd?: number;
  /** Individual contributions total for the reporting period */
  total_individual_contributions_period?: number | null;
  /** Individual contributions total for the year to date */
  total_individual_contributions_ytd?: number | null;
  total_loan_repayments_made_period?: number;
  total_loan_repayments_made_ytd?: number;
  total_loans_received_period?: number;
  total_loans_received_ytd?: number;
  total_nonfed_transfers_period?: number;
  total_nonfed_transfers_ytd?: number;
  total_offsets_to_operating_expenditures_period?: number;
  total_offsets_to_operating_expenditures_ytd?: number;
  total_operating_expenditures_period?: number;
  total_operating_expenditures_ytd?: number;
  total_period?: number;
  total_receipts_period?: number;
  /** Anything of value (money, goods, services or property) received by a political committee total for the year to date */
  total_receipts_ytd?: number | null;
  total_ytd?: number;
  transfers_from_affiliated_committee_period?: number;
  transfers_from_affiliated_committee_ytd?: number;
  transfers_from_affiliated_party_period?: number;
  transfers_from_affiliated_party_ytd?: number;
  transfers_from_nonfed_account_period?: number;
  transfers_from_nonfed_account_ytd?: number;
  transfers_from_nonfed_levin_period?: number;
  transfers_from_nonfed_levin_ytd?: number;
  transfers_from_other_authorized_committee_period?: number;
  transfers_from_other_authorized_committee_ytd?: number;
  transfers_to_affiliated_committee_period?: number;
  transfers_to_affilitated_committees_ytd?: number;
  transfers_to_other_authorized_committee_period?: number;
  transfers_to_other_authorized_committee_ytd?: number;
}

export interface CommitteeReportsHouseSenate {
  aggregate_amount_personal_contributions_general?: number;
  aggregate_contributions_personal_funds_primary?: number;
  all_other_loans_period?: number;
  all_other_loans_ytd?: number;
  /**
   *
   * The first value in the chain is the original filing.  The ordering in the chain reflects the order the
   * amendments were filed up to the amendment being inspected.
   */
  amendment_chain?: number[] | null;
  amendment_indicator?: string | null;
  amendment_indicator_full?: string | null;
  beginning_image_number?: string;
  candidate_contribution_period?: number;
  candidate_contribution_ytd?: number;
  cash_on_hand_beginning_period?: number;
  cash_on_hand_end_period?: number;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  committee_type?: string;
  /**
   * Ending date of the reporting period
   * @format date-time
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date-time
   */
  coverage_start_date?: string | null;
  csv_url?: string;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle?: number | null;
  debts_owed_by_committee?: number;
  debts_owed_to_committee?: number;
  document_description?: string;
  end_image_number?: string;
  fec_file_id?: string;
  fec_url?: string;
  file_number?: number | null;
  gross_receipt_authorized_committee_general?: number;
  gross_receipt_authorized_committee_primary?: number;
  gross_receipt_minus_personal_contribution_general?: number;
  gross_receipt_minus_personal_contributions_primary?: number;
  /**
   *
   * HTML link to the filing.
   */
  html_url?: string | null;
  /** Individual itemized contributions are from individuals whose aggregate contributions total over $200 per individual per year. Be aware, some filers choose to itemize donations $200 or less. total for the reporting period */
  individual_itemized_contributions_period?: number | null;
  /** Individual itemized contributions are from individuals whose aggregate contributions total over $200 per individual per year. Be aware, some filers choose to itemize donations $200 or less. total for the year to date */
  individual_itemized_contributions_ytd?: number | null;
  /** Unitemized contributions are made individuals whose aggregate contributions total $200 or less per individual per year. Be aware, some filers choose to itemize donations $200 or less and in that case those donations will appear in the itemized total. total for the reporting period */
  individual_unitemized_contributions_period?: number | null;
  /** Unitemized contributions are made individuals whose aggregate contributions total $200 or less per individual per year. Be aware, some filers choose to itemize donations $200 or less and in that case those donations will appear in the itemized total. total for the year to date */
  individual_unitemized_contributions_ytd?: number | null;
  /**
   *
   * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
   */
  is_amended?: boolean | null;
  loan_repayments_candidate_loans_period?: number;
  loan_repayments_candidate_loans_ytd?: number;
  loan_repayments_other_loans_period?: number;
  loan_repayments_other_loans_ytd?: number;
  loans_made_by_candidate_period?: number;
  loans_made_by_candidate_ytd?: number;
  /** The method used to file with the FEC, either electronic or on paper. */
  means_filed?: string | null;
  /**
   *
   * Report is either new or is the most-recently filed amendment
   */
  most_recent?: boolean | null;
  most_recent_file_number?: number;
  net_contributions_period?: number;
  net_contributions_ytd?: number;
  net_operating_expenditures_period?: number;
  net_operating_expenditures_ytd?: number;
  /** Offsets to operating expenditures total for the reporting period */
  offsets_to_operating_expenditures_period?: number | null;
  /** Offsets to operating expenditures total for the year to date */
  offsets_to_operating_expenditures_ytd?: number | null;
  operating_expenditures_period?: number;
  operating_expenditures_ytd?: number;
  other_disbursements_period?: number;
  other_disbursements_ytd?: number;
  other_political_committee_contributions_period?: number;
  other_political_committee_contributions_ytd?: number;
  other_receipts_period?: number;
  other_receipts_ytd?: number;
  pdf_url?: string;
  political_party_committee_contributions_period?: number;
  political_party_committee_contributions_ytd?: number;
  previous_file_number?: number;
  /**
   * Date the FEC received the electronic or paper record
   * @format date
   */
  receipt_date?: string | null;
  refunded_individual_contributions_period?: number;
  refunded_individual_contributions_ytd?: number;
  refunded_other_political_committee_contributions_period?: number;
  refunded_other_political_committee_contributions_ytd?: number;
  refunded_political_party_committee_contributions_period?: number;
  refunded_political_party_committee_contributions_ytd?: number;
  refunds_total_contributions_col_total_ytd?: number;
  report_form?: string;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type_full?: string | null;
  /**
   *
   * Forms with coverage date -
   *     year from the coverage ending date.
   * Forms without coverage date -
   *     year from the receipt date.
   */
  report_year?: number | null;
  subtotal_period?: number;
  total_contribution_refunds_col_total_period?: number;
  total_contribution_refunds_period?: number;
  total_contribution_refunds_ytd?: number;
  total_contributions_column_total_period?: number;
  total_contributions_period?: number;
  total_contributions_ytd?: number;
  total_disbursements_period?: number;
  total_disbursements_ytd?: number;
  /** Individual contributions total for the reporting period */
  total_individual_contributions_period?: number | null;
  /** Individual contributions total for the year to date */
  total_individual_contributions_ytd?: number | null;
  total_loan_repayments_made_period?: number;
  total_loan_repayments_made_ytd?: number;
  total_loans_received_period?: number;
  total_loans_received_ytd?: number;
  total_offsets_to_operating_expenditures_period?: number;
  total_offsets_to_operating_expenditures_ytd?: number;
  total_operating_expenditures_period?: number;
  total_operating_expenditures_ytd?: number;
  total_receipts_period?: number;
  /** Anything of value (money, goods, services or property) received by a political committee total for the year to date */
  total_receipts_ytd?: number | null;
  transfers_from_other_authorized_committee_period?: number;
  transfers_from_other_authorized_committee_ytd?: number;
  transfers_to_other_authorized_committee_period?: number;
  transfers_to_other_authorized_committee_ytd?: number;
}

export interface CommitteeReportsHouseSenatePage {
  pagination?: OffsetInfo;
  results?: CommitteeReportsHouseSenate[];
}

export interface CommitteeReportsIEOnly {
  beginning_image_number?: string;
  committee_id?: string | null;
  committee_name?: string | null;
  committee_type?: string;
  /** @format date-time */
  coverage_end_date?: string | null;
  /** @format date-time */
  coverage_start_date?: string | null;
  csv_url?: string;
  cycle?: number | null;
  document_description?: string;
  end_image_number?: string;
  fec_file_id?: string;
  fec_url?: string;
  independent_contributions_period?: number;
  independent_expenditures_period?: number;
  /**
   *
   * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
   */
  is_amended?: boolean | null;
  /** The method used to file with the FEC, either electronic or on paper. */
  means_filed?: string | null;
  pdf_url?: string;
  /**
   * Date the FEC received the electronic or paper record
   * @format date
   */
  receipt_date?: string | null;
  report_form?: string;
  report_type?: string | null;
  report_type_full?: string | null;
  report_year?: number | null;
}

export interface CommitteeReportsIEOnlyPage {
  pagination?: OffsetInfo;
  results?: CommitteeReportsIEOnly[];
}

export interface CommitteeReportsPacParty {
  all_loans_received_period?: number;
  all_loans_received_ytd?: number;
  allocated_federal_election_levin_share_period?: number;
  /**
   *
   * The first value in the chain is the original filing.  The ordering in the chain reflects the order the
   * amendments were filed up to the amendment being inspected.
   */
  amendment_chain?: number[] | null;
  amendment_indicator?: string | null;
  amendment_indicator_full?: string | null;
  beginning_image_number?: string;
  calendar_ytd?: number | null;
  cash_on_hand_beginning_calendar_ytd?: number;
  cash_on_hand_beginning_period?: number;
  cash_on_hand_close_ytd?: number;
  cash_on_hand_end_period?: number;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  committee_type?: string;
  coordinated_expenditures_by_party_committee_period?: number;
  coordinated_expenditures_by_party_committee_ytd?: number;
  /**
   * Ending date of the reporting period
   * @format date-time
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date-time
   */
  coverage_start_date?: string | null;
  csv_url?: string;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle?: number | null;
  debts_owed_by_committee?: number;
  debts_owed_to_committee?: number;
  document_description?: string;
  end_image_number?: string;
  fec_file_id?: string;
  fec_url?: string;
  fed_candidate_committee_contribution_refunds_ytd?: number;
  fed_candidate_committee_contributions_period?: number;
  fed_candidate_committee_contributions_ytd?: number;
  fed_candidate_contribution_refunds_period?: number;
  file_number?: number | null;
  /**
   *
   * HTML link to the filing.
   */
  html_url?: string | null;
  independent_expenditures_period?: number;
  independent_expenditures_ytd?: number;
  /** Individual itemized contributions are from individuals whose aggregate contributions total over $200 per individual per year. Be aware, some filers choose to itemize donations $200 or less. total for the reporting period */
  individual_itemized_contributions_period?: number | null;
  /** Individual itemized contributions are from individuals whose aggregate contributions total over $200 per individual per year. Be aware, some filers choose to itemize donations $200 or less. total for the year to date */
  individual_itemized_contributions_ytd?: number | null;
  /** Unitemized contributions are made individuals whose aggregate contributions total $200 or less per individual per year. Be aware, some filers choose to itemize donations $200 or less and in that case those donations will appear in the itemized total. total for the reporting period */
  individual_unitemized_contributions_period?: number | null;
  /** Unitemized contributions are made individuals whose aggregate contributions total $200 or less per individual per year. Be aware, some filers choose to itemize donations $200 or less and in that case those donations will appear in the itemized total. total for the year to date */
  individual_unitemized_contributions_ytd?: number | null;
  /**
   *
   * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
   */
  is_amended?: boolean | null;
  loan_repayments_made_period?: number;
  loan_repayments_made_ytd?: number;
  loan_repayments_received_period?: number;
  loan_repayments_received_ytd?: number;
  loans_made_period?: number;
  loans_made_ytd?: number;
  /** The method used to file with the FEC, either electronic or on paper. */
  means_filed?: string | null;
  /**
   *
   * Report is either new or is the most-recently filed amendment
   */
  most_recent?: boolean | null;
  most_recent_file_number?: number;
  net_contributions_period?: number;
  net_contributions_ytd?: number;
  net_operating_expenditures_period?: number;
  net_operating_expenditures_ytd?: number;
  non_allocated_fed_election_activity_period?: number;
  non_allocated_fed_election_activity_ytd?: number;
  nonfed_share_allocated_disbursements_period?: number;
  /** Offsets to operating expenditures total for the reporting period */
  offsets_to_operating_expenditures_period?: number | null;
  /** Offsets to operating expenditures total for the year to date */
  offsets_to_operating_expenditures_ytd?: number | null;
  other_disbursements_period?: number;
  other_disbursements_ytd?: number;
  other_fed_operating_expenditures_period?: number;
  other_fed_operating_expenditures_ytd?: number;
  other_fed_receipts_period?: number;
  other_fed_receipts_ytd?: number;
  other_political_committee_contributions_period?: number;
  other_political_committee_contributions_ytd?: number;
  pdf_url?: string;
  political_party_committee_contributions_period?: number;
  political_party_committee_contributions_ytd?: number;
  previous_file_number?: number;
  /**
   * Date the FEC received the electronic or paper record
   * @format date
   */
  receipt_date?: string | null;
  refunded_individual_contributions_period?: number;
  refunded_individual_contributions_ytd?: number;
  refunded_other_political_committee_contributions_period?: number;
  refunded_other_political_committee_contributions_ytd?: number;
  refunded_political_party_committee_contributions_period?: number;
  refunded_political_party_committee_contributions_ytd?: number;
  report_form?: string;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type_full?: string | null;
  /**
   *
   * Forms with coverage date -
   *     year from the coverage ending date.
   * Forms without coverage date -
   *     year from the receipt date.
   */
  report_year?: number | null;
  shared_fed_activity_nonfed_ytd?: number;
  shared_fed_activity_period?: number;
  shared_fed_activity_ytd?: number;
  shared_fed_operating_expenditures_period?: number;
  shared_fed_operating_expenditures_ytd?: number;
  shared_nonfed_operating_expenditures_period?: number;
  shared_nonfed_operating_expenditures_ytd?: number;
  subtotal_summary_page_period?: number;
  subtotal_summary_ytd?: number;
  total_contribution_refunds_period?: number;
  total_contribution_refunds_ytd?: number;
  total_contributions_period?: number;
  total_contributions_ytd?: number;
  total_disbursements_period?: number;
  total_disbursements_ytd?: number;
  total_fed_disbursements_period?: number;
  total_fed_disbursements_ytd?: number;
  total_fed_election_activity_period?: number;
  total_fed_election_activity_ytd?: number;
  total_fed_operating_expenditures_period?: number;
  total_fed_operating_expenditures_ytd?: number;
  total_fed_receipts_period?: number;
  total_fed_receipts_ytd?: number;
  /** Individual contributions total for the reporting period */
  total_individual_contributions_period?: number | null;
  /** Individual contributions total for the year to date */
  total_individual_contributions_ytd?: number | null;
  total_nonfed_transfers_period?: number;
  total_nonfed_transfers_ytd?: number;
  total_operating_expenditures_period?: number;
  total_operating_expenditures_ytd?: number;
  total_receipts_period?: number;
  /** Anything of value (money, goods, services or property) received by a political committee total for the year to date */
  total_receipts_ytd?: number | null;
  transfers_from_affiliated_party_period?: number;
  transfers_from_affiliated_party_ytd?: number;
  transfers_from_nonfed_account_period?: number;
  transfers_from_nonfed_account_ytd?: number;
  transfers_from_nonfed_levin_period?: number;
  transfers_from_nonfed_levin_ytd?: number;
  transfers_to_affiliated_committee_period?: number;
  transfers_to_affilitated_committees_ytd?: number;
}

export interface CommitteeReportsPacPartyPage {
  pagination?: OffsetInfo;
  results?: CommitteeReportsPacParty[];
}

export interface CommitteeReportsPage {
  pagination?: OffsetInfo;
  results?: CommitteeReports[];
}

export interface CommitteeReportsPresidential {
  /**
   *
   * The first value in the chain is the original filing.  The ordering in the chain reflects the order the
   * amendments were filed up to the amendment being inspected.
   */
  amendment_chain?: number[] | null;
  amendment_indicator?: string | null;
  amendment_indicator_full?: string | null;
  beginning_image_number?: string;
  candidate_contribution_period?: number;
  candidate_contribution_ytd?: number;
  cash_on_hand_beginning_period?: number;
  cash_on_hand_end_period?: number;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  committee_type?: string;
  /**
   * Ending date of the reporting period
   * @format date-time
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date-time
   */
  coverage_start_date?: string | null;
  csv_url?: string;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle?: number | null;
  debts_owed_by_committee?: number;
  debts_owed_to_committee?: number;
  document_description?: string;
  end_image_number?: string;
  exempt_legal_accounting_disbursement_period?: number;
  exempt_legal_accounting_disbursement_ytd?: number;
  expenditure_subject_to_limits?: number;
  fec_file_id?: string;
  fec_url?: string;
  federal_funds_period?: number;
  federal_funds_ytd?: number;
  file_number?: number | null;
  fundraising_disbursements_period?: number;
  fundraising_disbursements_ytd?: number;
  /**
   *
   * HTML link to the filing.
   */
  html_url?: string | null;
  /** Individual itemized contributions are from individuals whose aggregate contributions total over $200 per individual per year. Be aware, some filers choose to itemize donations $200 or less. total for the reporting period */
  individual_itemized_contributions_period?: number | null;
  /** Individual itemized contributions are from individuals whose aggregate contributions total over $200 per individual per year. Be aware, some filers choose to itemize donations $200 or less. total for the year to date */
  individual_itemized_contributions_ytd?: number | null;
  /** Unitemized contributions are made individuals whose aggregate contributions total $200 or less per individual per year. Be aware, some filers choose to itemize donations $200 or less and in that case those donations will appear in the itemized total. total for the reporting period */
  individual_unitemized_contributions_period?: number | null;
  /** Unitemized contributions are made individuals whose aggregate contributions total $200 or less per individual per year. Be aware, some filers choose to itemize donations $200 or less and in that case those donations will appear in the itemized total. total for the year to date */
  individual_unitemized_contributions_ytd?: number | null;
  /**
   *
   * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
   */
  is_amended?: boolean | null;
  items_on_hand_liquidated?: number;
  loans_received_from_candidate_period?: number;
  loans_received_from_candidate_ytd?: number;
  /** The method used to file with the FEC, either electronic or on paper. */
  means_filed?: string | null;
  /**
   *
   * Report is either new or is the most-recently filed amendment
   */
  most_recent?: boolean | null;
  most_recent_file_number?: number;
  net_contributions_cycle_to_date?: number;
  net_operating_expenditures_cycle_to_date?: number;
  offsets_to_fundraising_expenditures_period?: number;
  offsets_to_fundraising_expenditures_ytd?: number;
  offsets_to_legal_accounting_period?: number;
  offsets_to_legal_accounting_ytd?: number;
  /** Offsets to operating expenditures total for the reporting period */
  offsets_to_operating_expenditures_period?: number | null;
  /** Offsets to operating expenditures total for the year to date */
  offsets_to_operating_expenditures_ytd?: number | null;
  operating_expenditures_period?: number;
  operating_expenditures_ytd?: number;
  other_disbursements_period?: number;
  other_disbursements_ytd?: number;
  other_loans_received_period?: number;
  other_loans_received_ytd?: number;
  other_political_committee_contributions_period?: number;
  other_political_committee_contributions_ytd?: number;
  other_receipts_period?: number;
  other_receipts_ytd?: number;
  pdf_url?: string;
  political_party_committee_contributions_period?: number;
  political_party_committee_contributions_ytd?: number;
  previous_file_number?: number;
  /**
   * Date the FEC received the electronic or paper record
   * @format date
   */
  receipt_date?: string | null;
  refunded_individual_contributions_period?: number;
  refunded_individual_contributions_ytd?: number;
  refunded_other_political_committee_contributions_period?: number;
  refunded_other_political_committee_contributions_ytd?: number;
  refunded_political_party_committee_contributions_period?: number;
  refunded_political_party_committee_contributions_ytd?: number;
  repayments_loans_made_by_candidate_period?: number;
  repayments_loans_made_candidate_ytd?: number;
  repayments_other_loans_period?: number;
  repayments_other_loans_ytd?: number;
  report_form?: string;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type_full?: string | null;
  /**
   *
   * Forms with coverage date -
   *     year from the coverage ending date.
   * Forms without coverage date -
   *     year from the receipt date.
   */
  report_year?: number | null;
  subtotal_summary_period?: number;
  total_contribution_refunds_period?: number;
  total_contribution_refunds_ytd?: number;
  total_contributions_period?: number;
  total_contributions_ytd?: number;
  total_disbursements_period?: number;
  total_disbursements_ytd?: number;
  /** Individual contributions total for the reporting period */
  total_individual_contributions_period?: number | null;
  /** Individual contributions total for the year to date */
  total_individual_contributions_ytd?: number | null;
  total_loan_repayments_made_period?: number;
  total_loan_repayments_made_ytd?: number;
  total_loans_received_period?: number;
  total_loans_received_ytd?: number;
  total_offsets_to_operating_expenditures_period?: number;
  total_offsets_to_operating_expenditures_ytd?: number;
  total_period?: number;
  total_receipts_period?: number;
  /** Anything of value (money, goods, services or property) received by a political committee total for the year to date */
  total_receipts_ytd?: number | null;
  total_ytd?: number;
  transfers_from_affiliated_committee_period?: number;
  transfers_from_affiliated_committee_ytd?: number;
  transfers_to_other_authorized_committee_period?: number;
  transfers_to_other_authorized_committee_ytd?: number;
}

export interface CommitteeReportsPresidentialPage {
  pagination?: OffsetInfo;
  results?: CommitteeReportsPresidential[];
}

export interface CommitteeSearch {
  id?: string;
  is_active?: boolean;
  name?: string;
}

export interface CommitteeSearchList {
  results?: CommitteeSearch[];
}

export interface CommitteeTotals {
  all_loans_received?: number;
  all_other_loans?: number;
  allocated_federal_election_levin_share?: number;
  candidate_contribution?: number;
  cash_on_hand_beginning_period?: number;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation_full?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  committee_state?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type_full?: string | null;
  contribution_refunds?: number;
  contributions?: number;
  contributions_ie_and_party_expenditures_made_percent?: number;
  convention_exp?: number;
  coordinated_expenditures_by_party_committee?: number;
  /** @format date-time */
  coverage_end_date?: string | null;
  /** @format date-time */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle: number;
  disbursements?: number;
  exempt_legal_accounting_disbursement?: number;
  exp_prior_years_subject_limits?: number;
  exp_subject_limits?: number;
  fed_candidate_committee_contributions?: number;
  fed_candidate_contribution_refunds?: number;
  fed_disbursements?: number;
  fed_election_activity?: number;
  fed_operating_expenditures?: number;
  fed_receipts?: number;
  federal_funds?: number;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   */
  filing_frequency_full?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  fundraising_disbursements?: number;
  independent_expenditures?: number;
  individual_contributions?: number;
  individual_contributions_percent?: number;
  individual_itemized_contributions?: number;
  individual_unitemized_contributions?: number;
  itemized_convention_exp?: number;
  itemized_other_disb?: number;
  itemized_other_income?: number;
  itemized_other_refunds?: number;
  itemized_refunds_relating_convention_exp?: number;
  last_beginning_image_number?: string;
  last_cash_on_hand_end_period?: number;
  last_debts_owed_by_committee?: number;
  last_debts_owed_to_committee?: number;
  last_report_type_full?: string | null;
  last_report_year?: number | null;
  loan_repayments?: number;
  loan_repayments_candidate_loans?: number;
  loan_repayments_made?: number;
  loan_repayments_other_loans?: number;
  loan_repayments_received?: number;
  loans?: number;
  loans_and_loan_repayments_made?: number;
  loans_and_loan_repayments_received?: number;
  loans_made?: number;
  loans_made_by_candidate?: number;
  loans_received?: number;
  loans_received_from_candidate?: number;
  net_contributions?: number;
  net_operating_expenditures?: number;
  non_allocated_fed_election_activity?: number;
  offsets_to_fundraising_expenditures?: number;
  offsets_to_legal_accounting?: number;
  offsets_to_operating_expenditures?: number;
  operating_expenditures?: number;
  operating_expenditures_percent?: number;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  other_disbursements?: number;
  other_fed_operating_expenditures?: number;
  other_fed_receipts?: number;
  other_loans_received?: number;
  other_political_committee_contributions?: number;
  other_receipts?: number;
  other_refunds?: number;
  party_and_other_committee_contributions_percent?: number;
  /** Party affiliated with a candidate or committee */
  party_full?: string | null;
  pdf_url?: string;
  political_party_committee_contributions?: number;
  receipts?: number;
  refunded_individual_contributions?: number;
  refunded_other_political_committee_contributions?: number;
  refunded_political_party_committee_contributions?: number;
  refunds_relating_convention_exp?: number;
  repayments_loans_made_by_candidate?: number;
  repayments_other_loans?: number;
  report_form?: string;
  shared_fed_activity?: number;
  shared_fed_activity_nonfed?: number;
  shared_fed_operating_expenditures?: number;
  shared_nonfed_operating_expenditures?: number;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC. If a person runs for several offices, that person will have separate candidate IDs for each office. This is a filter for Leadership PAC sponsor.
   */
  sponsor_candidate_ids?: string[] | null;
  sponsor_candidate_list?: PacSponsorCandidate[];
  total_exp_subject_limits?: number;
  total_independent_contributions?: number;
  total_independent_expenditures?: number;
  total_offsets_to_operating_expenditures?: number;
  total_transfers?: number;
  /** @format date */
  transaction_coverage_date?: string;
  transfers_from_affiliated_committee?: number;
  transfers_from_affiliated_party?: number;
  transfers_from_nonfed_account?: number;
  transfers_from_nonfed_levin?: number;
  transfers_from_other_authorized_committee?: number;
  transfers_to_affiliated_committee?: number;
  transfers_to_other_authorized_committee?: number;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
  unitemized_convention_exp?: number;
  unitemized_other_disb?: number;
  unitemized_other_income?: number;
  unitemized_other_refunds?: number;
  unitemized_refunds_relating_convention_exp?: number;
}

export interface CommitteeTotalsHouseSenate {
  all_other_loans?: number;
  candidate_contribution?: number;
  cash_on_hand_beginning_period?: number;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation_full?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  committee_state?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type_full?: string | null;
  contribution_refunds?: number;
  contributions?: number;
  contributions_ie_and_party_expenditures_made_percent?: number;
  /** @format date-time */
  coverage_end_date?: string | null;
  /** @format date-time */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle: number;
  disbursements?: number;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   */
  filing_frequency_full?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  individual_contributions?: number;
  individual_contributions_percent?: number;
  individual_itemized_contributions?: number;
  individual_unitemized_contributions?: number;
  last_beginning_image_number?: string;
  last_cash_on_hand_end_period?: number;
  last_debts_owed_by_committee?: number;
  last_debts_owed_to_committee?: number;
  last_report_type_full?: string | null;
  last_report_year?: number | null;
  loan_repayments?: number;
  loan_repayments_candidate_loans?: number;
  loan_repayments_other_loans?: number;
  loans?: number;
  loans_made_by_candidate?: number;
  net_contributions?: number;
  net_operating_expenditures?: number;
  offsets_to_operating_expenditures?: number;
  operating_expenditures?: number;
  operating_expenditures_percent?: number;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  other_disbursements?: number;
  other_political_committee_contributions?: number;
  other_receipts?: number;
  party_and_other_committee_contributions_percent?: number;
  /** Party affiliated with a candidate or committee */
  party_full?: string | null;
  pdf_url?: string;
  political_party_committee_contributions?: number;
  receipts?: number;
  refunded_individual_contributions?: number;
  refunded_other_political_committee_contributions?: number;
  refunded_political_party_committee_contributions?: number;
  report_form?: string;
  /** @format date */
  transaction_coverage_date?: string;
  transfers_from_other_authorized_committee?: number;
  transfers_to_other_authorized_committee?: number;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
}

export interface CommitteeTotalsHouseSenatePage {
  pagination?: OffsetInfo;
  results?: CommitteeTotalsHouseSenate[];
}

export interface CommitteeTotalsIEOnly {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  committee_state?: string | null;
  contributions_ie_and_party_expenditures_made_percent?: number;
  /**
   * Ending date of the reporting period
   * @format date-time
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date-time
   */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle?: number | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   */
  filing_frequency_full?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  individual_contributions_percent?: number;
  last_beginning_image_number?: string;
  last_cash_on_hand_end_period?: number;
  operating_expenditures_percent?: number;
  party_and_other_committee_contributions_percent?: number;
  pdf_url?: string;
  report_form?: string;
  total_independent_contributions?: number;
  total_independent_expenditures?: number;
  /** @format date */
  transaction_coverage_date?: string;
}

export interface CommitteeTotalsIEOnlyPage {
  pagination?: OffsetInfo;
  results?: CommitteeTotalsIEOnly[];
}

export interface CommitteeTotalsPacParty {
  all_loans_received?: number;
  allocated_federal_election_levin_share?: number;
  cash_on_hand_beginning_period?: number;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation_full?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  committee_state?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type_full?: string | null;
  contribution_refunds?: number;
  contributions?: number;
  contributions_ie_and_party_expenditures_made_percent?: number;
  convention_exp?: number;
  coordinated_expenditures_by_party_committee?: number;
  /** @format date-time */
  coverage_end_date?: string | null;
  /** @format date-time */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle: number;
  disbursements?: number;
  exp_prior_years_subject_limits?: number;
  exp_subject_limits?: number;
  fed_candidate_committee_contributions?: number;
  fed_candidate_contribution_refunds?: number;
  fed_disbursements?: number;
  fed_election_activity?: number;
  fed_operating_expenditures?: number;
  fed_receipts?: number;
  federal_funds?: number;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   */
  filing_frequency_full?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  independent_expenditures?: number;
  individual_contributions?: number;
  individual_contributions_percent?: number;
  individual_itemized_contributions?: number;
  individual_unitemized_contributions?: number;
  itemized_convention_exp?: number;
  itemized_other_disb?: number;
  itemized_other_income?: number;
  itemized_other_refunds?: number;
  itemized_refunds_relating_convention_exp?: number;
  last_beginning_image_number?: string;
  last_cash_on_hand_end_period?: number;
  last_debts_owed_by_committee?: number;
  last_debts_owed_to_committee?: number;
  last_report_type_full?: string | null;
  last_report_year?: number | null;
  loan_repayments_made?: number;
  loan_repayments_received?: number;
  loans_and_loan_repayments_made?: number;
  loans_and_loan_repayments_received?: number;
  loans_made?: number;
  net_contributions?: number;
  net_operating_expenditures?: number;
  non_allocated_fed_election_activity?: number;
  offsets_to_operating_expenditures?: number;
  operating_expenditures?: number;
  operating_expenditures_percent?: number;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  other_disbursements?: number;
  other_fed_operating_expenditures?: number;
  other_fed_receipts?: number;
  other_political_committee_contributions?: number;
  other_refunds?: number;
  party_and_other_committee_contributions_percent?: number;
  /** Party affiliated with a candidate or committee */
  party_full?: string | null;
  pdf_url?: string;
  political_party_committee_contributions?: number;
  receipts?: number;
  refunded_individual_contributions?: number;
  refunded_other_political_committee_contributions?: number;
  refunded_political_party_committee_contributions?: number;
  refunds_relating_convention_exp?: number;
  report_form?: string;
  shared_fed_activity?: number;
  shared_fed_activity_nonfed?: number;
  shared_fed_operating_expenditures?: number;
  shared_nonfed_operating_expenditures?: number;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC. If a person runs for several offices, that person will have separate candidate IDs for each office. This is a filter for Leadership PAC sponsor.
   */
  sponsor_candidate_ids?: string[] | null;
  sponsor_candidate_list?: PacSponsorCandidate[];
  total_exp_subject_limits?: number;
  total_transfers?: number;
  /** @format date */
  transaction_coverage_date?: string;
  transfers_from_affiliated_party?: number;
  transfers_from_nonfed_account?: number;
  transfers_from_nonfed_levin?: number;
  transfers_to_affiliated_committee?: number;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
  unitemized_convention_exp?: number;
  unitemized_other_disb?: number;
  unitemized_other_income?: number;
  unitemized_other_refunds?: number;
  unitemized_refunds_relating_convention_exp?: number;
}

export interface CommitteeTotalsPacPartyPage {
  pagination?: OffsetInfo;
  results?: CommitteeTotalsPacParty[];
}

export interface CommitteeTotalsPage {
  pagination?: OffsetInfo;
  results?: CommitteeTotals[];
}

export interface CommitteeTotalsPerCycle {
  all_other_loans?: number;
  candidate_contribution?: number;
  cash_on_hand_beginning_period?: number;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation_full?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  committee_state?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type_full?: string | null;
  contribution_refunds?: number;
  contributions?: number;
  contributions_ie_and_party_expenditures_made_percent?: number;
  /** @format date-time */
  coverage_end_date?: string | null;
  /** @format date-time */
  coverage_start_date?: string | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle: number;
  disbursements?: number;
  exempt_legal_accounting_disbursement?: number;
  federal_funds?: number;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   */
  filing_frequency_full?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  fundraising_disbursements?: number;
  individual_contributions?: number;
  individual_contributions_percent?: number;
  individual_itemized_contributions?: number;
  individual_unitemized_contributions?: number;
  last_beginning_image_number?: string;
  last_cash_on_hand_end_period?: number;
  last_debts_owed_by_committee?: number;
  last_debts_owed_to_committee?: number;
  last_report_type_full?: string | null;
  last_report_year?: number | null;
  loan_repayments?: number;
  loan_repayments_candidate_loans?: number;
  loan_repayments_made?: number;
  loan_repayments_other_loans?: number;
  loans?: number;
  loans_made_by_candidate?: number;
  loans_received?: number;
  loans_received_from_candidate?: number;
  net_contributions?: number;
  net_operating_expenditures?: number;
  offsets_to_fundraising_expenditures?: number;
  offsets_to_legal_accounting?: number;
  offsets_to_operating_expenditures?: number;
  operating_expenditures?: number;
  operating_expenditures_percent?: number;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  other_disbursements?: number;
  other_loans_received?: number;
  other_political_committee_contributions?: number;
  other_receipts?: number;
  party_and_other_committee_contributions_percent?: number;
  /** Party affiliated with a candidate or committee */
  party_full?: string | null;
  pdf_url?: string;
  political_party_committee_contributions?: number;
  receipts?: number;
  refunded_individual_contributions?: number;
  refunded_other_political_committee_contributions?: number;
  refunded_political_party_committee_contributions?: number;
  repayments_loans_made_by_candidate?: number;
  repayments_other_loans?: number;
  report_form?: string;
  total_offsets_to_operating_expenditures?: number;
  /** @format date */
  transaction_coverage_date?: string;
  transfers_from_affiliated_committee?: number;
  transfers_from_other_authorized_committee?: number;
  transfers_to_other_authorized_committee?: number;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
}

export interface CommitteeTotalsPerCyclePage {
  pagination?: OffsetInfo;
  results?: CommitteeTotalsPerCycle[];
}

export interface CommunicationCost {
  action_code?: string | null;
  action_code_full?: string | null;
  candidate_first_name?: string | null;
  candidate_id?: string | null;
  candidate_last_name?: string | null;
  candidate_middle_name?: string | null;
  candidate_name?: string | null;
  candidate_office?: string | null;
  candidate_office_district?: string | null;
  candidate_office_full?: string | null;
  candidate_office_state?: string | null;
  committee_id?: string | null;
  committee_name?: string | null;
  communication_class?: string | null;
  communication_type?: string | null;
  communication_type_full?: string | null;
  cycle?: number | null;
  file_number?: number | null;
  form_type_code?: string | null;
  image_number?: string | null;
  original_sub_id?: number | null;
  pdf_url?: string | null;
  primary_general_indicator?: string | null;
  primary_general_indicator_description?: string | null;
  purpose?: string | null;
  report_type?: string | null;
  report_year?: number | null;
  schedule_type?: string | null;
  schedule_type_full?: string | null;
  state_full?: string | null;
  sub_id?: number;
  support_oppose_indicator?: string | null;
  tran_id?: string | null;
  transaction_amount?: number;
  /** @format date */
  transaction_date?: string | null;
  transaction_type?: string | null;
}

export interface CommunicationCostByCandidate {
  candidate_id?: string;
  candidate_name?: string;
  committee_id?: string;
  committee_name?: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /** Explains if the money was spent in order to support or oppose a candidate or candidates. (Coded S or O for support or oppose.) This indicator applies to independent expenditures and communication costs. */
  support_oppose_indicator: string;
  total?: number;
}

export interface CommunicationCostByCandidatePage {
  pagination?: OffsetInfo;
  results?: CommunicationCostByCandidate[];
}

export interface CommunicationCostPage {
  pagination?: OffsetInfo;
  results?: CommunicationCost[];
}

export interface ECAggregates {
  candidate?: any;
  candidate_id?: string;
  candidate_name?: string;
  committee?: any;
  committee_id?: string;
  committee_name?: string;
  count?: number;
  cycle?: number;
  total?: number;
}

export interface ECAggregatesPage {
  pagination?: OffsetInfo;
  results?: ECAggregates[];
}

export interface ECTotalsByCandidate {
  candidate_id?: string;
  cycle?: number;
  total?: number;
}

export interface ECTotalsByCandidatePage {
  pagination?: OffsetInfo;
  results?: ECTotalsByCandidate[];
}

export interface EFilings {
  amended_by?: number;
  amendment_chain?: number[];
  /**
   *
   * Number of times the report has been amended.
   */
  amendment_number?: number | null;
  /**
   *
   * For amendments, this file_number is the file_number of the previous report that is being amended. Refer to the amended_by for the most recent version of the report.
   */
  amends_file?: number | null;
  beginning_image_number?: string;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   * Ending date of the reporting period
   * @format date
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date
   */
  coverage_start_date?: string | null;
  csv_url?: string;
  document_description?: string;
  ending_image_number?: string;
  fec_file_id?: string;
  fec_url?: string;
  /** Filing ID number */
  file_number?: number;
  /**
   * Timestamp of electronic or paper record that FEC received
   * @format date
   */
  filed_date?: string | null;
  /**
   * The form where the underlying data comes from, for example Form 1 would appear as F1:
   *     - F1   Statement of Organization
   *     - F1M  Notification of Multicandidate Status
   *     - F2   Statement of Candidacy
   *     - F3   Report of Receipts and Disbursements for an Authorized Committee
   *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
   *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
   *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
   *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
   *     - F5   Report of Independent Expenditures Made and Contributions Received
   *     - F6   48 Hour Notice of Contributions/Loans Received
   *     - F7   Report of Communication Costs by Corporations and Membership Organizations
   *     - F8   Debt Settlement Plan
   *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
   *     - F13  Report of Donations Accepted for Inaugural Committee
   *     - F99  Miscellaneous Text
   * NOTE: This filter also works if you specify new, amended, or termination,
   * for example F3XN, F3XA, or F3XT respectively
   */
  form_type?: string | null;
  html_url?: string;
  is_amended?: boolean;
  /**
   * Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently.
   * @format date-time
   */
  load_timestamp?: string | null;
  most_recent?: boolean;
  most_recent_filing?: number;
  pdf_url?: string;
  /**
   * Date the FEC received the electronic or paper record
   * @format date-time
   */
  receipt_date?: string | null;
}

export interface EFilingsPage {
  pagination?: OffsetInfo;
  results?: EFilings[];
}

export interface EfilingsAmendments {
  amendment_chain?: number[];
  depth?: number;
  /** Filing ID number */
  file_number?: number;
  last?: number;
  longest_chain?: number;
  most_recent_filing?: number;
  previous_file_number?: number;
}

export interface EfilingsAmendmentsPage {
  pagination?: OffsetInfo;
  results?: EfilingsAmendments[];
}

export interface Election {
  candidate_election_year?: number;
  candidate_id?: string;
  candidate_name?: string;
  candidate_pcc_id?: string;
  candidate_pcc_name?: string;
  cash_on_hand_end_period?: number;
  committee_ids?: string[];
  /** @format date */
  coverage_end_date?: string;
  incumbent_challenge_full?: string;
  party_full?: string;
  total_disbursements?: number;
  total_receipts?: number;
}

export interface ElectionDates {
  active_election?: boolean;
  /**
   * Date the record was created
   * @format date-time
   */
  create_date?: string | null;
  /**
   * Date of election
   * @format date
   */
  election_date?: string | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  election_district?: string | null;
  election_notes?: string | null;
  /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
  election_party?: string | null;
  /** US state or territory where a candidate runs for office */
  election_state?: string | null;
  election_type_full?: string;
  /**
   * Election type
   * Convention, Primary,
   * General, Special,
   * Runoff etc.
   */
  election_type_id?: string | null;
  /** Year of election */
  election_year?: number | null;
  /** Federal office candidate runs for: H, S or P */
  office_sought?: string | null;
  /** @format date */
  primary_general_date?: string | null;
  /**
   * Date the record was updated
   * @format date-time
   */
  update_date?: string | null;
}

export interface ElectionDatesPage {
  pagination?: OffsetInfo;
  results?: ElectionDates[];
}

export interface ElectionPage {
  pagination?: OffsetInfo;
  results?: Election[];
}

export interface ElectionSearch {
  candidate_status?: string;
  cycle?: number;
  district?: string;
  incumbent_id?: string;
  incumbent_name?: string;
  office?: string;
  state?: string;
}

export interface ElectionSearchPage {
  pagination?: OffsetInfo;
  results?: ElectionSearch[];
}

export interface ElectionSummary {
  count?: number;
  disbursements?: number;
  independent_expenditures?: number;
  receipts?: number;
}

export interface Electioneering {
  amendment_indicator?: string | null;
  beginning_image_number?: string | null;
  calculated_candidate_share?: number;
  candidate_district?: string | null;
  candidate_id?: string | null;
  candidate_name?: string | null;
  candidate_office?: string | null;
  candidate_state?: string | null;
  committee_id?: string | null;
  committee_name?: string | null;
  /**
   *
   * It is the airing, broadcast, cablecast or other dissemination of the communication.
   * @format date
   */
  communication_date?: string | null;
  disbursement_amount?: number;
  /**
   *
   * Disbursement date includes actual disbursements and execution of contracts creating
   * an obligation to make disbursements (SB date of disbursement).
   * @format date
   */
  disbursement_date?: string | null;
  election_type?: string;
  file_number?: number | null;
  link_id?: number | null;
  number_of_candidates?: number;
  /**
   *
   * Name of the entity that received the payment.
   */
  payee_name?: string | null;
  payee_state?: string | null;
  pdf_url?: string | null;
  /**
   *
   * The pubic distribution date is the date that triggers disclosure of the
   * electioneering communication (date reported on page 1 of Form 9).
   * @format date
   */
  public_distribution_date?: string | null;
  purpose_description?: string | null;
  /** @format date */
  receipt_date?: string | null;
  report_year?: number | null;
  sb_image_num?: string | null;
  sb_link_id?: string | null;
  /**
   *
   * The identifier for each electioneering record.
   */
  sub_id?: number | null;
}

export interface ElectioneeringByCandidate {
  candidate_id?: string;
  candidate_name?: string;
  committee_id?: string;
  committee_name?: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  total?: number;
}

export interface ElectioneeringByCandidatePage {
  pagination?: OffsetInfo;
  results?: ElectioneeringByCandidate[];
}

export interface ElectioneeringPage {
  pagination?: SeekInfo;
  results?: Electioneering[];
}

export interface ElectionsList {
  cycle?: number | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  district?: string | null;
  /** Federal office candidate runs for: H, S or P */
  office?: string | null;
  /** US state or territory */
  state?: string | null;
}

export interface ElectionsListPage {
  pagination?: OffsetInfo;
  results?: ElectionsList[];
}

export interface EntityReceiptDisbursementTotals {
  /** Cumulative candidate disbursements in a two year period, adjusted to avoid double counting. */
  cumulative_candidate_disbursements?: number | null;
  /** Cumulative candidate receipts in a two year period, adjusted to avoid double counting. */
  cumulative_candidate_receipts?: number | null;
  /** Cumulative PAC disbursements in a two year period, adjusted to avoid double counting. */
  cumulative_pac_disbursements?: number | null;
  /** Cumulative PAC recipts in a two year period, adjusted to avoid double counting. */
  cumulative_pac_receipts?: number | null;
  /** Cumulative party disbursements in a two year period, adjusted to avoid double counting. */
  cumulative_party_disbursements?: number | null;
  /** Cumulative party receipts in a two year period, adjusted to avoid double counting. */
  cumulative_party_receipts?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle?: number | null;
  /** @format date */
  end_date?: string;
}

export interface EntityReceiptDisbursementTotalsPage {
  pagination?: OffsetInfo;
  results?: EntityReceiptDisbursementTotals[];
}

export interface Filings {
  /**
   *
   * Additional banks or depositories in which the committee deposits funds, holds accounts, rents safety deposit boxes or maintains funds.
   */
  additional_bank_names?: string[] | null;
  amendment_chain?: number[];
  /**
   *
   * The first value in the chain is the original filing.  The ordering in the chain reflects the order the
   * amendments were filed up to the amendment being inspected.
   */
  amendment_indicator?: string | null;
  /**
   *
   * Amendment version
   */
  amendment_version?: number | null;
  /**
   *
   * City of bank or depository as reported on the Form 1
   */
  bank_depository_city?: string | null;
  /**
   *
   * Primary bank or depository in which the committee deposits funds,holds accounts, rents safety deposit boxes or maintains funds.
   */
  bank_depository_name?: string | null;
  /**
   *
   * State of bank or depository as reported on the Form 1
   */
  bank_depository_state?: string | null;
  /**
   *
   * Street of bank or depository as reported on their Form 1.
   */
  bank_depository_street_1?: string | null;
  /**
   *
   * Second line of the street of bank or depository as reported on the Form 1
   */
  bank_depository_street_2?: string | null;
  /**
   *
   * Zip code of bank or depository as reported on the Form 1
   */
  bank_depository_zip?: string | null;
  beginning_image_number?: string;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  /** Name of candidate running for office */
  candidate_name?: string | null;
  cash_on_hand_beginning_period?: number;
  cash_on_hand_end_period?: number;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  /**
   * Ending date of the reporting period
   * @format date
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date
   */
  coverage_start_date?: string | null;
  csv_url?: string;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle?: number | null;
  debts_owed_by_committee?: number;
  debts_owed_to_committee?: number;
  document_description?: string;
  /**
   *
   * The type of document for documents other than reports:
   *     - 2 24 Hour Contribution Notice
   *     - 4 48 Hour Contribution Notice
   *     - A Debt Settlement Statement
   *     - B Acknowledgment of Receipt of Debt Settlement Statement
   *     - C RFAI: Debt Settlement First Notice
   *     - D Commission Debt Settlement Review
   *     - E Commission Response TO Debt Settlement Request
   *     - F Administrative Termination
   *     - G Debt Settlement Plan Amendment
   *     - H Disavowal Notice
   *     - I Disavowal Response
   *     - J Conduit Report
   *     - K Termination Approval
   *     - L Repeat Non-Filer Notice
   *     - M Filing Frequency Change Notice
   *     - N Paper Amendment to Electronic Report
   *     - O Acknowledgment of Filing Frequency Change
   *     - S RFAI: Debt Settlement Second
   *     - T Miscellaneous Report TO FEC
   *     - V Repeat Violation Notice (441A OR 441B)
   *     - P Notice of Paper Filing
   *     - R F3L Filing Frequency Change Notice
   *     - Q Acknowledgment of F3L Filing Frequency Change
   *     - U Unregistered Committee Notice
   */
  document_type?: string | null;
  /**
   *
   * The type of document for documents other than reports:
   *     - 2 24 Hour Contribution Notice
   *     - 4 48 Hour Contribution Notice
   *     - A Debt Settlement Statement
   *     - B Acknowledgment of Receipt of Debt Settlement Statement
   *     - C RFAI: Debt Settlement First Notice
   *     - D Commission Debt Settlement Review
   *     - E Commission Response TO Debt Settlement Request
   *     - F Administrative Termination
   *     - G Debt Settlement Plan Amendment
   *     - H Disavowal Notice
   *     - I Disavowal Response
   *     - J Conduit Report
   *     - K Termination Approval
   *     - L Repeat Non-Filer Notice
   *     - M Filing Frequency Change Notice
   *     - N Paper Amendment to Electronic Report
   *     - O Acknowledgment of Filing Frequency Change
   *     - S RFAI: Debt Settlement Second
   *     - T Miscellaneous Report TO FEC
   *     - V Repeat Violation Notice (441A OR 441B)
   *     - P Notice of Paper Filing
   *     - R F3L Filing Frequency Change Notice
   *     - Q Acknowledgment of F3L Filing Frequency Change
   *     - U Unregistered Committee Notice
   */
  document_type_full?: string | null;
  /** Year of election */
  election_year?: number | null;
  ending_image_number?: string;
  fec_file_id?: string;
  fec_url?: string;
  /** Filing ID number */
  file_number?: number | null;
  /**
   *
   * The forms filed are categorized based on the nature of the filing:
   *     - REPORT F3, F3X, F3P, F3L, F4, F5, F7, F13
   *     - NOTICE F5, F24, F6, F9, F10, F11
   *     - STATEMENT F1, F2
   *     - OTHER F1M, F8, F99, F12, FRQ
   */
  form_category?: string | null;
  /**
   * The form where the underlying data comes from, for example, Form 1 would appear as F1:
   *     - F1   Statement of Organization
   *     - F1M  Notification of Multicandidate Status
   *     - F2   Statement of Candidacy
   *     - F3   Report of Receipts and Disbursements for an Authorized Committee
   *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
   *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
   *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
   *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
   *     - F5   Report of Independent Expenditures Made and Contributions Received
   *     - F6   48 Hour Notice of Contributions/Loans Received
   *     - F7   Report of Communication Costs by Corporations and Membership Organizations
   *     - F8   Debt Settlement Plan
   *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
   *     - F13  Report of Donations Accepted for Inaugural Committee
   *     - F99  Miscellaneous Text
   *     - FRQ  Request for Additional Information
   */
  form_type?: string | null;
  house_personal_funds?: number;
  /**
   *
   * HTML link to the filing.
   */
  html_url?: string | null;
  /**
   *
   * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
   */
  is_amended?: boolean | null;
  /** The method used to file with the FEC, either electronic or on paper. */
  means_filed?: string | null;
  /**
   *
   * Report is either new or is the most-recently filed amendment
   */
  most_recent?: boolean | null;
  most_recent_file_number?: number | null;
  net_donations?: number;
  /** Federal office candidate runs for: H, S or P */
  office?: string | null;
  opposition_personal_funds?: number;
  /**
   *
   * Number of pages in the document
   */
  pages?: number | null;
  /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
  party?: string | null;
  /**
   *
   * pdf link to the filing
   */
  pdf_url?: string | null;
  /**
   *
   * Previous filing ID number
   */
  previous_file_number?: number | null;
  /**
   *
   * Primary general indicator
   */
  primary_general_indicator?: string | null;
  /**
   * Date the FEC received the electronic or paper record
   * @format date-time
   */
  receipt_date?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  report_type_full?: string;
  /**
   *
   * Forms with coverage date -
   *     year from the coverage ending date.
   * Forms without coverage date -
   *     year from the receipt date.
   */
  report_year?: number | null;
  /**
   *
   * Requests for additional information (RFAIs) sent to filers. The request type is based on the type of document filed:
   *     - 1 Statement of Organization
   *     - 2 Report of Receipts and Expenditures (Form 3 and 3X)
   *     - 3 Second Notice - Reports
   *     - 4 Request for Additional Information
   *     - 5 Informational - Reports
   *     - 6 Second Notice - Statement of Organization
   *     - 7 Failure to File
   *     - 8 From Public Disclosure
   *     - 9 From Multi Candidate Status
   */
  request_type?: string | null;
  senate_personal_funds?: number;
  /** US state or territory where a candidate runs for office */
  state?: string | null;
  sub_id?: string;
  total_communication_cost?: number;
  total_disbursements?: number;
  total_independent_expenditures?: number;
  total_individual_contributions?: number;
  total_receipts?: number;
  /** Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown. */
  treasurer_name?: string | null;
  /**
   * Date the record was updated
   * @format date
   */
  update_date?: string | null;
}

export interface FilingsPage {
  pagination?: OffsetInfo;
  results?: Filings[];
}

export interface Form1 {
  affiliated_candidate_id?: string | null;
  affiliated_committee_city?: string | null;
  affiliated_committee_id?: string | null;
  /**
   *
   * Affiliated committee or connected organization
   */
  affiliated_committee_name?: string | null;
  affiliated_committee_state?: string | null;
  affiliated_committee_str1?: string | null;
  affiliated_committee_str2?: string | null;
  affiliated_committee_zip?: string | null;
  affiliated_relationship_code?: string | null;
  /**
   *
   * House district of the office sought, if applicable.
   */
  candidate_district?: string | null;
  /** First name of candidate running for office */
  candidate_first_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  /**
   *
   * Candidate last name
   */
  candidate_last_name?: string | null;
  /** Middle name of candidate running for office */
  candidate_middle_name?: string | null;
  candidate_name?: string;
  /** Federal office candidate runs for: H, S or P */
  candidate_office?: string | null;
  /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
  candidate_party?: string | null;
  city?: string | null;
  /**
   *
   * City of committee as reported on the Form 1
   */
  committee_city?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   */
  committee_state?: string | null;
  /**
   *
   * Street address of committee as reported on the Form 1
   */
  committee_str1?: string | null;
  /**
   *
   * Second line of street address of committee as reported on the Form 1
   */
  committee_str2?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  /**
   *
   * Zip code of committee as reported on the Form 1
   */
  committee_zip?: string | null;
  /**
   *
   * State or territory of the office sought.
   */
  election_state?: string | null;
  /**
   *
   * Email as reported on the Form 1
   */
  email?: string | null;
  /** Filing ID number */
  file_number?: number;
  image_number?: string;
  load_timestamp?: string;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   */
  organization_type?: string | null;
  pdf_url?: string;
  /** US state or territory where a candidate runs for office */
  state?: string | null;
  street_1?: string | null;
  street_2?: string | null;
  /**
   *
   * City of committee treasurer as reported on the Form 1
   */
  treasurer_city?: string | null;
  /**
   *
   * Name 1 of committee treasurer as reported on the Form 1
   */
  treasurer_first_name?: string | null;
  treasurer_last_name?: string | null;
  /**
   *
   * Middle name of committee treasurer as reported on the Form 1
   */
  treasurer_middle_name?: string | null;
  /**
   *
   * State of committee treasurer as reported on the Form 1
   */
  treasurer_state?: string | null;
  /**
   *
   * Street of committee treasurer as reported on the Form 1
   */
  treasurer_str1?: string | null;
  /**
   *
   * Second line of the street of committee treasurer as reported on the Form 1
   */
  treasurer_str2?: string | null;
  /**
   *
   * Zip code of committee treasurer as reported on the Form 1
   */
  treasurer_zip?: string | null;
  /** Zip code */
  zip?: string | null;
}

export interface Form1Page {
  pagination?: OffsetInfo;
  results?: Form1[];
}

export interface Form2 {
  address_city?: string | null;
  address_state?: string | null;
  address_str1?: string | null;
  address_str2?: string | null;
  address_zip?: string | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  candidate_district?: string | null;
  candidate_first_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  candidate_last_name?: string | null;
  candidate_middle_name?: string | null;
  candidate_name?: string;
  /** Federal office candidate runs for: H, S or P */
  candidate_office?: string | null;
  /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
  candidate_party?: string | null;
  committee_address_city?: string | null;
  committee_address_str1?: string | null;
  committee_address_str2?: string | null;
  committee_address_zip?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  committee_name?: string | null;
  /**
   *
   * State or territory of the office sought.
   */
  election_state?: string | null;
  election_year?: string | null;
  /** Filing ID number */
  file_number?: number;
  image_number?: string;
  load_timestamp?: string;
  pdf_url?: string;
}

export interface Form2Page {
  pagination?: OffsetInfo;
  results?: Form2[];
}

export interface IETotalsByCandidate {
  candidate_id?: string;
  cycle?: number;
  support_oppose_indicator?: string;
  total?: number;
}

export interface IETotalsByCandidatePage {
  pagination?: OffsetInfo;
  results?: IETotalsByCandidate[];
}

export interface InauguralDonations {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   * Name of contributor
   * @maxLength 100
   */
  contributor_name: string;
  cycle?: number;
  total_donation?: number;
}

export interface InauguralDonationsPage {
  pagination?: OffsetInfo;
  results?: InauguralDonations[];
}

export interface JFCCommittee {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  joint_committee_id?: string | null;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 100
   */
  joint_committee_name?: string | null;
}

export interface OffsetInfo {
  count?: number;
  is_count_exact?: boolean;
  page?: number;
  pages?: number;
  per_page?: number;
}

export interface OperationsLog {
  /**
   * Amendent types:
   *     -N   new
   *     -A   amendment
   *     -T   terminated
   *     -C   consolidated
   *     -M   multi-candidate
   *     -S   secondary
   *
   * NULL might be new or amendment. If amendment indicator is null and the filings is the first or first in a chain treat it as if it was a new. If it is not the first or first in a chain then treat the filing as an amendment.
   */
  amendment_indicator?: string | null;
  /**
   *
   * Unique identifier for the electronic or paper report. This number is used to construct
   * PDF URLs to the original document.
   */
  beginning_image_number?: string | null;
  /**
   *
   * A unique identifier of the registered filer.
   */
  candidate_committee_id?: string | null;
  /**
   * Ending date of the reporting period
   * @format date-time
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date-time
   */
  coverage_start_date?: string | null;
  /** Image number is an unique identifier for each page the electronic or paper report. The last image number corresponds to the image number for the last page of the document. */
  ending_image_number?: string | null;
  /**
   * The form where the underlying data comes from, for example, Form 1 would appear as F1:
   *     - F1   Statement of Organization
   *     - F1M  Notification of Multicandidate Status
   *     - F2   Statement of Candidacy
   *     - F3   Report of Receipts and Disbursements for an Authorized Committee
   *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
   *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
   *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
   *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
   *     - F5   Report of Independent Expenditures Made and Contributions Received
   *     - F6   48 Hour Notice of Contributions/Loans Received
   *     - F7   Report of Communication Costs by Corporations and Membership Organizations
   *     - F8   Debt Settlement Plan
   *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
   *     - F13  Report of Donations Accepted for Inaugural Committee
   *     - F99  Miscellaneous Text
   *     - FRQ  Request for Additional Information
   */
  form_type?: string | null;
  /**
   * Date the FEC received the electronic or paper record
   * @format date-time
   */
  receipt_date?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  /**
   *
   * Forms with coverage date -
   *     year from the coverage ending date.
   * Forms without coverage date -
   *     year from the receipt date.
   */
  report_year?: number | null;
  /**
   *
   * Status of the transactional report.
   *     -0- Transaction is entered
   *           into the system.
   *           But not verified.
   *     -1- Transaction is verified.
   */
  status_num?: number | null;
  /**
   *
   * A unique identifier of the transactional report.
   */
  sub_id?: number;
  /**
   *
   * Date when the report is entered into the database
   * @format date-time
   */
  summary_data_complete_date?: string | null;
  /**
   *
   * Same day or a day after the report is loaded in the database
   * @format date-time
   */
  summary_data_verification_date?: string | null;
  /**
   *
   * Date when the report is processed completely
   * @format date
   */
  transaction_data_complete_date?: string | null;
}

export interface OperationsLogPage {
  pagination?: OffsetInfo;
  results?: OperationsLog[];
}

export interface PacSponsorCandidate {
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  sponsor_candidate_id?: string | null;
  /**
   * Name of candidate running for office
   * @maxLength 100
   */
  sponsor_candidate_name?: string | null;
}

export interface PresidentialByCandidate {
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   *   -P00000001    All candidates
   *   -P00000002    Democrasts
   *   -P00000003    Republicans
   */
  candidate_id?: string | null;
  /**
   *
   * Candidate last name
   */
  candidate_last_name?: string | null;
  /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
  candidate_party_affiliation?: string | null;
  /**
   * State of contributor
   * @maxLength 2
   */
  contributor_state?: string | null;
  /** Year of election */
  election_year?: number | null;
  net_receipts?: number;
  rounded_net_receipts?: number;
}

export interface PresidentialByCandidatePage {
  pagination?: OffsetInfo;
  results?: PresidentialByCandidate[];
}

export interface PresidentialBySize {
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   *   -P00000001    All candidates
   *   -P00000002    Democrasts
   *   -P00000003    Republicans
   * @maxLength 0
   */
  candidate_id?: string | null;
  contribution_receipt_amount?: number;
  /** Year of election */
  election_year?: number | null;
  /**
   *
   * The total all contributions in the following ranges:
   * ```
   *   -0    $200 and under
   *   -200  $200.01 - $499.99
   *   -500  $500 - $999.99
   *   -1000 $1000 - $1999.99
   *   -2000 $2000 +
   * ```
   * Unitemized contributions are included in the `0` category.
   */
  size?: number | null;
  /**
   *
   * The total all contributions range id.
   */
  size_range_id?: number | null;
}

export interface PresidentialBySizePage {
  pagination?: OffsetInfo;
  results?: PresidentialBySize[];
}

export interface PresidentialByState {
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   *   -P00000001    All candidates
   *   -P00000002    Democrasts
   *   -P00000003    Republicans
   * @maxLength 0
   */
  candidate_id?: string | null;
  contribution_receipt_amount?: number;
  /**
   * State of contributor
   * @maxLength 2
   */
  contribution_state?: string | null;
  /** Year of election */
  election_year?: number | null;
}

export interface PresidentialByStatePage {
  pagination?: OffsetInfo;
  results?: PresidentialByState[];
}

export interface PresidentialCoverage {
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   *   -P00000001    All candidates
   *   -P00000002    Democrasts
   *   -P00000003    Republicans
   */
  candidate_id?: string | null;
  /**
   * Ending date of the reporting period
   * @format date-time
   */
  coverage_end_date?: string | null;
  /** Year of election */
  election_year?: number | null;
}

export interface PresidentialCoveragePage {
  pagination?: OffsetInfo;
  results?: PresidentialCoverage[];
}

export interface PresidentialSummary {
  candidate_contributions_less_repayments?: number;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   *   -P00000001    All candidates
   *   -P00000002    Democrasts
   *   -P00000003    Republicans
   */
  candidate_id?: string | null;
  /**
   *
   * Candidate last name
   */
  candidate_last_name?: string | null;
  /** Name of candidate running for office */
  candidate_name?: string | null;
  /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
  candidate_party_affiliation?: string | null;
  cash_on_hand_end?: number;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   */
  committee_designation?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  debts_owed_by_committee?: number;
  disbursements_less_offsets?: number;
  /** Year of election */
  election_year?: number | null;
  exempt_legal_accounting_disbursement?: number;
  federal_funds?: number;
  fundraising_disbursements?: number;
  individual_contributions_less_refunds?: number;
  net_receipts?: number;
  offsets_to_operating_expenditures?: number;
  operating_expenditures?: number;
  other_disbursements?: number;
  pac_contributions_less_refunds?: number;
  party_contributions_less_refunds?: number;
  repayments_loans_made_by_candidate?: number;
  repayments_other_loans?: number;
  rounded_net_receipts?: number;
  total_contribution_refunds?: number;
  total_loan_repayments_made?: number;
  transfers_from_affiliated_committees?: number;
  transfers_to_other_authorized_committees?: number;
}

export interface PresidentialSummaryPage {
  pagination?: OffsetInfo;
  results?: PresidentialSummary[];
}

export interface PrincipalCommittee {
  /**
   *
   * Affiliated committee or connected organization
   * @maxLength 100
   */
  affiliated_committee_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_ids?: string[] | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 1
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 50
   */
  committee_type_full?: string | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycles?: number[] | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 1
   */
  designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 25
   */
  designation_full?: string | null;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  /**
   * The day the FEC received the committee's most recent Form 1
   * @format date
   */
  last_f1_date?: string | null;
  /**
   * The day the FEC received the committee's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 100
   */
  name?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 50
   */
  party_full?: string | null;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  state?: string | null;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
}

export interface RadAnalyst {
  analyst_id?: number;
  analyst_short_id?: number;
  /**
   * Date of most recent RAD analyst assignment change
   * @format date
   */
  assignment_update_date?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 100
   */
  committee_name?: string | null;
  /**
   * Email of RAD analyst
   * @maxLength 100
   */
  email?: string | null;
  /**
   * Fist name of RAD analyst
   * @maxLength 255
   */
  first_name?: string | null;
  /**
   * Last name of RAD analyst
   * @maxLength 100
   */
  last_name?: string | null;
  /**
   * Branch of RAD analyst
   * @maxLength 100
   */
  rad_branch?: string | null;
  telephone_ext?: number;
  /**
   * Title of RAD analyst
   * @maxLength 100
   */
  title?: string | null;
}

export interface RadAnalystPage {
  pagination?: OffsetInfo;
  results?: RadAnalyst[];
}

export interface ReportType {
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type: string;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type_full?: string | null;
}

export interface ReportingDates {
  /**
   * Date the record was created
   * @format date
   */
  create_date?: string | null;
  /**
   * Date the report is due
   * @format date
   */
  due_date?: string | null;
  report_type?: string;
  report_type_full?: string;
  /**
   *
   * Forms with coverage date -
   *     year from the coverage ending date.
   * Forms without coverage date -
   *     year from the receipt date.
   */
  report_year?: number | null;
  /**
   * Date the record was updated
   * @format date
   */
  update_date?: string | null;
}

export interface ReportingDatesPage {
  pagination?: OffsetInfo;
  results?: ReportingDates[];
}

export interface ScheduleA {
  amendment_indicator?: string | null;
  amendment_indicator_desc?: string | null;
  back_reference_schedule_name?: string | null;
  back_reference_transaction_id?: string | null;
  candidate_first_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  candidate_last_name?: string | null;
  candidate_middle_name?: string | null;
  /** Name of candidate running for office */
  candidate_name?: string | null;
  candidate_office?: string | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  candidate_office_district?: string | null;
  candidate_office_full?: string | null;
  candidate_office_state?: string | null;
  candidate_office_state_full?: string | null;
  candidate_prefix?: string | null;
  candidate_suffix?: string | null;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  conduit_committee_city?: string | null;
  conduit_committee_id?: string | null;
  conduit_committee_name?: string | null;
  conduit_committee_state?: string | null;
  conduit_committee_street1?: string | null;
  conduit_committee_street2?: string | null;
  conduit_committee_zip?: string | null;
  contribution_receipt_amount?: number;
  /** @format date */
  contribution_receipt_date?: string | null;
  contributor?: CommitteeHistory;
  contributor_aggregate_ytd?: number;
  /** City of contributor */
  contributor_city?: string | null;
  /** Employer of contributor, filers need to make an effort to gather this information */
  contributor_employer?: string | null;
  contributor_first_name?: string | null;
  /** The FEC identifier should be represented here if the contributor is registered with the FEC. */
  contributor_id?: string | null;
  contributor_last_name?: string | null;
  contributor_middle_name?: string | null;
  /** Name of contributor */
  contributor_name?: string | null;
  /** Occupation of contributor, filers need to make an effort to gather this information */
  contributor_occupation?: string | null;
  contributor_prefix?: string | null;
  /** State of contributor */
  contributor_state?: string | null;
  contributor_street_1?: string | null;
  contributor_street_2?: string | null;
  contributor_suffix?: string | null;
  /** Zip code of contributor */
  contributor_zip?: string | null;
  donor_committee_name?: string | null;
  election_type?: string | null;
  election_type_full?: string | null;
  entity_type?: string | null;
  entity_type_desc?: string | null;
  fec_election_type_desc?: string | null;
  fec_election_year?: string | null;
  file_number?: number | null;
  filing_form?: string | null;
  image_number?: string;
  increased_limit?: string | null;
  is_individual?: boolean | null;
  line_number?: string | null;
  line_number_label?: string | null;
  link_id?: number | null;
  /** @format date-time */
  load_date?: string | null;
  memo_code?: string | null;
  memo_code_full?: string | null;
  memo_text?: string | null;
  memoed_subtotal?: boolean;
  national_committee_nonfederal_account?: string | null;
  original_sub_id?: string;
  pdf_url?: string | null;
  receipt_type?: string | null;
  receipt_type_desc?: string | null;
  receipt_type_full?: string | null;
  /** @maxLength 1 */
  recipient_committee_designation?: string | null;
  /** @maxLength 1 */
  recipient_committee_org_type?: string | null;
  /** @maxLength 1 */
  recipient_committee_type?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  report_year?: number;
  schedule_type?: string | null;
  schedule_type_full?: string | null;
  sub_id?: string;
  transaction_id?: string | null;
  /**
   *
   * This is a two-year period that is derived from the year a transaction took place in the
   * Itemized Schedule A and Schedule B tables. In cases where we have the date of the transaction
   * (contribution_receipt_date in schedules/schedule_a, disbursement_date in schedules/schedule_b)
   * the two_year_transaction_period is named after the ending, even-numbered year. If we do not
   * have the date  of the transaction, we fall back to using the report year (report_year in both
   * tables) instead,  making the same cycle adjustment as necessary. If no transaction year is
   * specified, the results default to the most current cycle.
   */
  two_year_transaction_period?: number | null;
  unused_contbr_id?: string | null;
}

export interface ScheduleAByEmployer {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /** Employer of contributor as reported on the committee's filing */
  employer: string;
  /** Sum of transactions */
  total?: number | null;
}

export interface ScheduleAByEmployerPage {
  pagination?: OffsetInfo;
  results?: ScheduleAByEmployer[];
}

export interface ScheduleAByOccupation {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /** Occupation of contributor as reported on the committee's filing */
  occupation: string;
  /** Sum of transactions */
  total?: number | null;
}

export interface ScheduleAByOccupationPage {
  pagination?: OffsetInfo;
  results?: ScheduleAByOccupation[];
}

export interface ScheduleABySize {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  size: number;
  /** Sum of transactions */
  total?: number | null;
}

export interface ScheduleABySizeCandidate {
  candidate_id?: string;
  count?: number;
  cycle?: number;
  size?: number;
  total?: number;
}

export interface ScheduleABySizeCandidatePage {
  pagination?: OffsetInfo;
  results?: ScheduleABySizeCandidate[];
}

export interface ScheduleABySizePage {
  pagination?: OffsetInfo;
  results?: ScheduleABySize[];
}

export interface ScheduleAByState {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /** US state or territory */
  state: string;
  /** US state or territory */
  state_full: string;
  /** Sum of transactions */
  total?: number | null;
}

export interface ScheduleAByStateCandidate {
  candidate_id?: string;
  count?: number;
  cycle?: number;
  state?: string;
  state_full?: string;
  total?: number;
}

export interface ScheduleAByStateCandidatePage {
  pagination?: OffsetInfo;
  results?: ScheduleAByStateCandidate[];
}

export interface ScheduleAByStatePage {
  pagination?: OffsetInfo;
  results?: ScheduleAByState[];
}

export interface ScheduleAByStateRecipientTotals {
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type_full?: string | null;
  /** Number of records making up the total. */
  count?: number | null;
  /**
   *
   * Filter records to only those that are applicable to a given two-year
   * period. This cycle follows the traditional House election cycle and
   * subdivides the presidential and Senate elections into comparable
   * two-year blocks. The cycle begins with an odd year and is named for its
   * ending, even year.
   */
  cycle?: number | null;
  /** US state or territory */
  state?: string | null;
  /** US state or territory */
  state_full?: string | null;
  total?: number;
}

export interface ScheduleAByStateRecipientTotalsPage {
  pagination?: OffsetInfo;
  results?: ScheduleAByStateRecipientTotals[];
}

export interface ScheduleAByZip {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /** US state or territory */
  state?: string | null;
  /** US state or territory */
  state_full?: string | null;
  /** Sum of transactions */
  total?: number | null;
  zip: string;
}

export interface ScheduleAByZipPage {
  pagination?: OffsetInfo;
  results?: ScheduleAByZip[];
}

export interface ScheduleAEfile {
  amendment_indicator?: string | null;
  back_reference_schedule_name?: string | null;
  back_reference_transaction_id?: string | null;
  beginning_image_number?: string;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  conduit_committee_city?: string | null;
  conduit_committee_id?: string | null;
  conduit_committee_name?: string | null;
  conduit_committee_state?: string | null;
  conduit_committee_street1?: string | null;
  conduit_committee_street2?: string | null;
  conduit_committee_zip?: string | null;
  contribution_receipt_amount?: number;
  /** @format date */
  contribution_receipt_date?: string | null;
  contributor_aggregate_ytd?: number;
  /** City of contributor */
  contributor_city?: string | null;
  /** Employer of contributor, filers need to make an effort to gather this information */
  contributor_employer?: string | null;
  contributor_first_name?: string | null;
  contributor_last_name?: string | null;
  contributor_middle_name?: string | null;
  contributor_name?: string;
  /** Occupation of contributor, filers need to make an effort to gather this information */
  contributor_occupation?: string | null;
  contributor_prefix?: string | null;
  /** State of contributor */
  contributor_state?: string | null;
  contributor_suffix?: string | null;
  /** Zip code of contributor */
  contributor_zip?: string | null;
  csv_url?: string;
  cycle?: number;
  entity_type?: string | null;
  fec_election_type_desc?: string;
  fec_url?: string;
  file_number: number;
  filing?: EFilings;
  /**
   *
   * An unique identifier for each page where the electronic or paper filing is reported.
   */
  image_number?: string | null;
  line_number?: string | null;
  /** @format date-time */
  load_timestamp?: string | null;
  memo_code?: string | null;
  memo_text?: string | null;
  pdf_url?: string;
  pgo?: string | null;
  related_line_number: number;
  report_type?: string;
  transaction_id?: string | null;
}

export interface ScheduleAEfilePage {
  pagination?: OffsetInfo;
  results?: ScheduleAEfile[];
}

export interface ScheduleAPage {
  pagination?: SeekInfo;
  results?: ScheduleA[];
}

export interface ScheduleB {
  amendment_indicator?: string | null;
  amendment_indicator_desc?: string | null;
  back_reference_schedule_id?: string | null;
  back_reference_transaction_id?: string | null;
  beneficiary_committee_name?: string | null;
  candidate_first_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  candidate_last_name?: string | null;
  candidate_middle_name?: string | null;
  /** Name of candidate running for office */
  candidate_name?: string | null;
  candidate_office?: string | null;
  candidate_office_description?: string | null;
  candidate_office_district?: string | null;
  candidate_office_state?: string | null;
  candidate_office_state_full?: string | null;
  candidate_prefix?: string | null;
  candidate_suffix?: string | null;
  category_code?: string | null;
  category_code_full?: string | null;
  /** @format date */
  comm_dt?: string | null;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  conduit_committee_city?: string | null;
  conduit_committee_name?: string | null;
  conduit_committee_state?: string | null;
  conduit_committee_street1?: string | null;
  conduit_committee_street2?: string | null;
  conduit_committee_zip?: string | null;
  disbursement_amount?: number;
  /** @format date */
  disbursement_date?: string | null;
  disbursement_description?: string | null;
  disbursement_purpose_category?: string | null;
  disbursement_type?: string | null;
  disbursement_type_description?: string | null;
  election_type?: string | null;
  election_type_full?: string | null;
  entity_type?: string | null;
  entity_type_desc?: string | null;
  fec_election_type_desc?: string | null;
  fec_election_year?: string | null;
  file_number?: number | null;
  filing_form?: string | null;
  image_number?: string;
  line_number?: string | null;
  line_number_label?: string | null;
  link_id?: number | null;
  /** @format date-time */
  load_date?: string | null;
  memo_code?: string | null;
  memo_code_full?: string | null;
  memo_text?: string | null;
  memoed_subtotal?: boolean;
  national_committee_nonfederal_account?: string | null;
  original_sub_id?: string;
  payee_employer?: string | null;
  payee_first_name?: string | null;
  payee_last_name?: string | null;
  payee_middle_name?: string | null;
  payee_occupation?: string | null;
  payee_prefix?: string | null;
  payee_suffix?: string | null;
  pdf_url?: string | null;
  recipient_city?: string | null;
  recipient_committee?: CommitteeHistory;
  recipient_committee_id?: string | null;
  recipient_name?: string | null;
  recipient_state?: string | null;
  recipient_zip?: string | null;
  ref_disp_excess_flg?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  report_year?: number | null;
  schedule_type?: string | null;
  schedule_type_full?: string | null;
  semi_annual_bundled_refund?: number | null;
  /** @maxLength 1 */
  spender_committee_designation?: string | null;
  /** @maxLength 1 */
  spender_committee_org_type?: string | null;
  /** @maxLength 1 */
  spender_committee_type?: string | null;
  sub_id?: string;
  transaction_id?: string | null;
  /**
   *
   * This is a two-year period that is derived from the year a transaction took place in the
   * Itemized Schedule A and Schedule B tables. In cases where we have the date of the transaction
   * (contribution_receipt_date in schedules/schedule_a, disbursement_date in schedules/schedule_b)
   * the two_year_transaction_period is named after the ending, even-numbered year. If we do not
   * have the date  of the transaction, we fall back to using the report year (report_year in both
   * tables) instead,  making the same cycle adjustment as necessary. If no transaction year is
   * specified, the results default to the most current cycle.
   */
  two_year_transaction_period?: number | null;
  unused_recipient_committee_id?: string | null;
}

export interface ScheduleBByPurpose {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /**
   *
   * Number of records making up the total.
   */
  memo_count?: number | null;
  /**
   *
   * Schedule B disbursements aggregated by memoed items only
   */
  memo_total?: number | null;
  /** Purpose of the expenditure */
  purpose: string;
  /**
   *
   * Schedule B disbursements aggregated by non-memoed items only
   */
  total?: number | null;
}

export interface ScheduleBByPurposePage {
  pagination?: OffsetInfo;
  results?: ScheduleBByPurpose[];
}

export interface ScheduleBByRecipient {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  committee_total_disbursements?: number;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /**
   *
   * Number of records making up the total.
   */
  memo_count?: number | null;
  memo_total?: number;
  recipient_disbursement_percent?: number;
  /** Name of the entity receiving the disbursement */
  recipient_name: string;
  total?: number;
}

export interface ScheduleBByRecipientID {
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  committee_name?: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /**
   *
   * Number of records making up the total.
   */
  memo_count?: number | null;
  memo_total?: number;
  /** The FEC identifier should be represented here if the entity receiving the disbursement is registered with the FEC. */
  recipient_id: string;
  recipient_name?: string;
  total?: number;
}

export interface ScheduleBByRecipientIDPage {
  pagination?: OffsetInfo;
  results?: ScheduleBByRecipientID[];
}

export interface ScheduleBByRecipientPage {
  pagination?: SeekInfo;
  results?: ScheduleBByRecipient[];
}

export interface ScheduleBEfile {
  amendment_indicator?: string | null;
  back_reference_schedule_name?: string | null;
  back_reference_transaction_id?: string | null;
  beginning_image_number?: string;
  beneficiary_committee_name?: string | null;
  candidate_office?: string | null;
  candidate_office_district?: string | null;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  csv_url?: string;
  disbursement_amount?: number;
  /** @format date */
  disbursement_date?: string | null;
  disbursement_description?: string | null;
  disbursement_type?: string | null;
  entity_type?: string | null;
  fec_url?: string;
  file_number: number;
  filing?: EFilings;
  /**
   *
   * An unique identifier for each page where the electronic or paper filing is reported.
   */
  image_number?: string | null;
  is_notice?: boolean;
  line_number?: string | null;
  /** @format date-time */
  load_timestamp?: string | null;
  memo_code?: string | null;
  memo_text?: string | null;
  payee_name?: string;
  pdf_url?: string;
  recipient_city?: string | null;
  recipient_name?: string | null;
  recipient_prefix?: string | null;
  recipient_state?: string | null;
  recipient_suffix?: string | null;
  recipient_zip?: string | null;
  related_line_number: number;
  report_type?: string;
  semi_annual_bundled_refund?: number | null;
  transaction_id?: string | null;
}

export interface ScheduleBEfilePage {
  pagination?: OffsetInfo;
  results?: ScheduleBEfile[];
}

export interface ScheduleBPage {
  pagination?: SeekInfo;
  results?: ScheduleB[];
}

export interface ScheduleC {
  action_code?: string | null;
  action_code_full?: string | null;
  candidate_first_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  candidate_last_name?: string | null;
  candidate_middle_name?: string | null;
  /** Name of candidate running for office */
  candidate_name?: string | null;
  candidate_office?: string | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  candidate_office_district?: string | null;
  candidate_office_full?: string | null;
  candidate_office_state?: string | null;
  candidate_office_state_full?: string | null;
  candidate_prefix?: string | null;
  candidate_suffix?: string | null;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  cycle?: number | null;
  due_date_terms?: string | null;
  election_type?: string | null;
  election_type_full?: string | null;
  entity_type?: string | null;
  entity_type_full?: string | null;
  fec_committee_id?: string | null;
  fec_election_type_full?: string | null;
  fec_election_type_year?: string | null;
  file_number?: number | null;
  filing_form?: string | null;
  form_line_number?: string;
  /**
   *
   * An unique identifier for each page where the electronic or paper filing is reported.
   */
  image_number?: string | null;
  /** @format date */
  incurred_date?: string | null;
  interest_rate_terms?: string | null;
  line_number?: string | null;
  link_id?: number | null;
  /** @format date-time */
  load_date?: string | null;
  loan_balance?: number | null;
  loan_source_city?: string | null;
  loan_source_first_name?: string | null;
  loan_source_last_name?: string | null;
  loan_source_middle_name?: string | null;
  /** Source of the loan (i.e., bank loan, brokerage account, credit card, home equity line of credit,               other line of credit, or personal funds of the candidate */
  loan_source_name?: string | null;
  loan_source_prefix?: string | null;
  loan_source_state?: string | null;
  loan_source_street_1?: string | null;
  loan_source_street_2?: string | null;
  loan_source_suffix?: string | null;
  loan_source_zip?: string | null;
  memo_code?: string | null;
  memo_text?: string | null;
  original_loan_amount?: number | null;
  original_sub_id?: number | null;
  payment_to_date?: number | null;
  pdf_url?: string;
  personally_funded?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  report_year?: number | null;
  schedule_a_line_number?: string | null;
  schedule_type?: string | null;
  schedule_type_full?: string | null;
  secured_ind?: string | null;
  sub_id?: string;
  transaction_id?: string | null;
}

export interface ScheduleCPage {
  pagination?: OffsetInfo;
  results?: ScheduleC[];
}

export interface ScheduleD {
  action_code?: string | null;
  action_code_full?: string | null;
  amount_incurred_period?: number | null;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
  committee_name?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   */
  committee_type?: string | null;
  /**
   * Ending date of the reporting period
   * @format date
   */
  coverage_end_date?: string | null;
  /**
   * Beginning date of the reporting period
   * @format date
   */
  coverage_start_date?: string | null;
  creditor_debtor_city?: string | null;
  creditor_debtor_first_name?: string | null;
  creditor_debtor_last_name?: string | null;
  creditor_debtor_middle_name?: string | null;
  creditor_debtor_name?: string | null;
  creditor_debtor_prefix?: string | null;
  creditor_debtor_state?: string | null;
  creditor_debtor_street1?: string | null;
  creditor_debtor_street2?: string | null;
  creditor_debtor_suffix?: string | null;
  election_cycle?: number | null;
  entity_type?: string | null;
  file_number?: number | null;
  /**
   * The form where the underlying data comes from, for example, Form 1 would appear as F1:
   *     - F1   Statement of Organization
   *     - F1M  Notification of Multicandidate Status
   *     - F2   Statement of Candidacy
   *     - F3   Report of Receipts and Disbursements for an Authorized Committee
   *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
   *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
   *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
   *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
   *     - F5   Report of Independent Expenditures Made and Contributions Received
   *     - F6   48 Hour Notice of Contributions/Loans Received
   *     - F7   Report of Communication Costs by Corporations and Membership Organizations
   *     - F8   Debt Settlement Plan
   *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
   *     - F13  Report of Donations Accepted for Inaugural Committee
   *     - F99  Miscellaneous Text
   *     - FRQ  Request for Additional Information
   */
  filing_form?: string | null;
  form_line_number?: string;
  /**
   *
   * An unique identifier for each page where the electronic or paper filing is reported.
   */
  image_number?: string | null;
  line_number?: string | null;
  link_id?: number | null;
  nature_of_debt?: string | null;
  original_sub_id?: number | null;
  outstanding_balance_beginning_of_period?: number | null;
  outstanding_balance_close_of_period?: number | null;
  payment_period?: number | null;
  pdf_url?: string;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  /**
   *
   * Forms with coverage date -
   *     year from the coverage ending date.
   * Forms without coverage date -
   *     year from the receipt date.
   */
  report_year?: number | null;
  schedule_type?: string | null;
  schedule_type_full?: string | null;
  sub_id?: string;
  transaction_id?: string | null;
}

export interface ScheduleDPage {
  pagination?: OffsetInfo;
  results?: ScheduleD[];
}

export interface ScheduleE {
  action_code?: string | null;
  action_code_full?: string | null;
  /**
   * Amendent types:
   *     -N   new
   *     -A   amendment
   *     -T   terminated
   *     -C   consolidated
   *     -M   multi-candidate
   *     -S   secondary
   *
   * NULL might be new or amendment. If amendment indicator is null and the filings is the first or first in a chain treat it as if it was a new. If it is not the first or first in a chain then treat the filing as an amendment.
   */
  amendment_indicator?: string | null;
  /**
   *
   * Number of times the report has been amended.
   */
  amendment_number?: number | null;
  back_reference_schedule_name?: string | null;
  back_reference_transaction_id?: string | null;
  candidate?: any;
  candidate_first_name?: string | null;
  candidate_id?: string | null;
  candidate_last_name?: string | null;
  candidate_middle_name?: string | null;
  /** Name of candidate running for office */
  candidate_name?: string | null;
  /** Federal office candidate runs for: H, S or P */
  candidate_office?: string | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  candidate_office_district?: string | null;
  /** US state or territory */
  candidate_office_state?: string | null;
  /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
  candidate_party?: string | null;
  candidate_prefix?: string | null;
  candidate_suffix?: string | null;
  category_code?: string | null;
  category_code_full?: string | null;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  conduit_committee_city?: string | null;
  conduit_committee_id?: string | null;
  conduit_committee_name?: string | null;
  conduit_committee_state?: string | null;
  conduit_committee_street1?: string | null;
  conduit_committee_street2?: string | null;
  conduit_committee_zip?: string | null;
  /** @format date */
  dissemination_date?: string | null;
  /**
   * Election type
   * Convention, Primary,
   * General, Special,
   * Runoff etc.
   */
  election_type?: string | null;
  /**
   * Election type
   * Convention, Primary,
   * General, Special,
   * Runoff etc.
   */
  election_type_full?: string | null;
  expenditure_amount?: number;
  /** @format date */
  expenditure_date?: string | null;
  expenditure_description?: string | null;
  file_number?: number | null;
  filer_first_name?: string | null;
  filer_last_name?: string | null;
  filer_middle_name?: string | null;
  filer_prefix?: string | null;
  filer_suffix?: string | null;
  /** @format date */
  filing_date?: string | null;
  filing_form?: string | null;
  form_line_number?: string;
  image_number?: string;
  /** @format date */
  independent_sign_date?: string | null;
  independent_sign_name?: string | null;
  is_notice?: boolean | null;
  line_number?: string | null;
  link_id?: number | null;
  memo_code?: string | null;
  memo_code_full?: string | null;
  memo_text?: string | null;
  memoed_subtotal?: boolean;
  /**
   *
   * Report is either new or is the most-recently filed amendment
   */
  most_recent?: boolean | null;
  /** @format date */
  notary_commission_expiration_date?: string | null;
  /** @format date */
  notary_sign_date?: string | null;
  notary_sign_name?: string | null;
  office_total_ytd?: number;
  original_sub_id?: string;
  payee_city?: string | null;
  payee_first_name?: string | null;
  payee_last_name?: string | null;
  payee_middle_name?: string | null;
  payee_name?: string | null;
  payee_prefix?: string | null;
  payee_state?: string | null;
  payee_street_1?: string | null;
  payee_street_2?: string | null;
  payee_suffix?: string | null;
  payee_zip?: string | null;
  pdf_url?: string | null;
  previous_file_number?: number | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  report_year?: number | null;
  schedule_type?: string | null;
  schedule_type_full?: string | null;
  sub_id?: string;
  support_oppose_indicator?: string | null;
  transaction_id?: string | null;
}

export interface ScheduleEByCandidate {
  candidate_id?: string;
  candidate_name?: string;
  committee_id?: string;
  committee_name?: string;
  /**
   *
   * Number of records making up the total.
   */
  count?: number | null;
  /**
   *
   * Filter records to only those that were applicable to a given
   * two-year period.The cycle begins with an odd year and is named
   * for its ending, even year.
   */
  cycle: number;
  /** Explains if the money was spent in order to support or oppose a candidate or candidates. (Coded S or O for support or oppose.) This indicator applies to independent expenditures and communication costs. */
  support_oppose_indicator: string;
  total?: number;
}

export interface ScheduleEByCandidatePage {
  pagination?: OffsetInfo;
  results?: ScheduleEByCandidate[];
}

export interface ScheduleEEfile {
  amendment_indicator?: string | null;
  back_reference_schedule_name?: string | null;
  back_reference_transaction_id?: string | null;
  beginning_image_number?: string;
  candidate_first_name?: string | null;
  candidate_id?: string | null;
  candidate_middle_name?: string | null;
  /** Name of candidate running for office */
  candidate_name?: string | null;
  /** Federal office candidate runs for: H, S or P */
  candidate_office?: string | null;
  /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
  candidate_office_district?: string | null;
  /** US state or territory */
  candidate_office_state?: string | null;
  /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
  candidate_party?: string | null;
  candidate_prefix?: string | null;
  candidate_suffix?: string | null;
  category_code?: string | null;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  csv_url?: string;
  /**
   *
   * Date when a PAC distrubutes or disseminates an independent expenditure
   * and pays for it in the same reporting period
   * @format date
   */
  dissemination_date?: string | null;
  entity_type?: string | null;
  expenditure_amount?: number | null;
  /** @format date */
  expenditure_date?: string | null;
  expenditure_description?: string | null;
  fec_url?: string;
  file_number: number;
  filer_first_name?: string | null;
  filer_last_name?: string | null;
  filer_middle_name?: string | null;
  filer_prefix?: string | null;
  filer_suffix?: string | null;
  filing?: EFilings;
  filing_form?: string | null;
  /**
   *
   * An unique identifier for each page where the electronic or paper filing is reported.
   */
  image_number?: string | null;
  is_notice?: boolean;
  line_number?: string | null;
  /** @format date-time */
  load_timestamp?: string | null;
  memo_code?: string | null;
  memo_text?: string | null;
  /**
   *
   * Report is either new or is the most-recently filed amendment
   */
  most_recent?: boolean | null;
  /** @format date */
  notary_sign_date?: string | null;
  office_total_ytd?: number | null;
  payee_city?: string | null;
  payee_first_name?: string | null;
  payee_last_name?: string | null;
  payee_middle_name?: string | null;
  payee_name?: string;
  payee_prefix?: string | null;
  payee_state?: string | null;
  payee_street_1?: string | null;
  payee_street_2?: string | null;
  payee_suffix?: string | null;
  payee_zip?: string | null;
  pdf_url?: string;
  related_line_number: number;
  report_type?: string;
  /** Explains if the money was spent in order to support or oppose a candidate or candidates. (Coded S or O for support or oppose.) This indicator applies to independent expenditures and communication costs. */
  support_oppose_indicator?: string | null;
  transaction_id?: string | null;
}

export interface ScheduleEEfilePage {
  pagination?: OffsetInfo;
  results?: ScheduleEEfile[];
}

export interface ScheduleEPage {
  pagination?: SeekInfo;
  results?: ScheduleE[];
}

export interface ScheduleF {
  action_code?: string | null;
  action_code_full?: string | null;
  aggregate_general_election_expenditure?: string | null;
  back_reference_schedule_name?: string | null;
  back_reference_transaction_id?: string | null;
  candidate_first_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_id?: string | null;
  candidate_last_name?: string | null;
  candidate_middle_name?: string | null;
  /** Name of candidate running for office */
  candidate_name?: string | null;
  candidate_office?: string | null;
  candidate_office_district?: string | null;
  candidate_office_full?: string | null;
  candidate_office_state?: string | null;
  candidate_office_state_full?: string | null;
  candidate_prefix?: string | null;
  candidate_suffix?: string | null;
  catolog_code?: string | null;
  catolog_code_full?: string | null;
  committee?: CommitteeHistory;
  committee_designated_coordinated_expenditure_indicator?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  committee_name?: string | null;
  conduit_committee_city?: string | null;
  conduit_committee_id?: string | null;
  conduit_committee_name?: string | null;
  conduit_committee_state?: string | null;
  conduit_committee_street1?: string | null;
  conduit_committee_street2?: string | null;
  conduit_committee_zip?: string | null;
  designated_committee_id?: string | null;
  designated_committee_name?: string | null;
  election_cycle?: number | null;
  entity_type?: string | null;
  entity_type_desc?: string | null;
  expenditure_amount?: number | null;
  /** @format date-time */
  expenditure_date?: string | null;
  expenditure_purpose_full?: string | null;
  expenditure_type?: string | null;
  expenditure_type_full?: string | null;
  file_number?: number | null;
  filing_form?: string | null;
  form_line_number?: string;
  /**
   *
   * An unique identifier for each page where the electronic or paper filing is reported.
   */
  image_number?: string | null;
  line_number?: string | null;
  link_id?: number | null;
  /** @format date-time */
  load_date?: string | null;
  memo_code?: string | null;
  memo_code_full?: string | null;
  memo_text?: string | null;
  original_sub_id?: number | null;
  payee_first_name?: string | null;
  payee_last_name?: string | null;
  payee_middle_name?: string | null;
  payee_name?: string | null;
  pdf_url?: string;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  report_year?: number | null;
  schedule_type?: string | null;
  schedule_type_full?: string | null;
  sub_id?: string;
  subordinate_committee?: CommitteeHistory;
  subordinate_committee_id?: string | null;
  transaction_id?: string | null;
  unlimited_spending_flag?: string | null;
  unlimited_spending_flag_full?: string | null;
}

export interface ScheduleFPage {
  pagination?: OffsetInfo;
  results?: ScheduleF[];
}

export interface ScheduleH4 {
  activity_or_event?: string | null;
  administrative_activity_indicator?: string | null;
  administrative_voter_drive_activity_indicator?: string | null;
  committee?: CommitteeHistory;
  committee_id?: string | null;
  cycle?: number;
  direct_candidate_support_activity_indicator?: string | null;
  disbursement_amount?: number;
  disbursement_purpose?: string | null;
  event_amount_year_to_date?: number;
  /** @format date */
  event_purpose_date?: string | null;
  exempt_activity_indicator?: string | null;
  federal_share?: number;
  file_number?: number | null;
  filing_form?: string | null;
  form_line_number?: string;
  fundraising_activity_indicator?: string | null;
  general_voter_drive_activity_indicator?: string | null;
  image_number?: string;
  line_number?: string | null;
  link_id?: number | null;
  memo_code?: string | null;
  memo_text?: string | null;
  nonfederal_share?: number;
  original_sub_id?: string;
  payee_city?: string | null;
  payee_name?: string | null;
  payee_state?: string | null;
  payee_street_1?: string | null;
  payee_street_2?: string | null;
  payee_zip?: string | null;
  pdf_url?: string | null;
  public_comm_indicator?: string | null;
  /**
   * Name of report where the underlying data comes from:
   *     - 10D Pre-Election
   *     - 10G Pre-General
   *     - 10P Pre-Primary
   *     - 10R Pre-Run-Off
   *     - 10S Pre-Special
   *     - 12C Pre-Convention
   *     - 12G Pre-General
   *     - 12P Pre-Primary
   *     - 12R Pre-Run-Off
   *     - 12S Pre-Special
   *     - 30D Post-Election
   *     - 30G Post-General
   *     - 30P Post-Primary
   *     - 30R Post-Run-Off
   *     - 30S Post-Special
   *     - 60D Post-Convention
   *     - M1  January Monthly
   *     - M10 October Monthly
   *     - M11 November Monthly
   *     - M12 December Monthly
   *     - M2  February Monthly
   *     - M3  March Monthly
   *     - M4  April Monthly
   *     - M5  May Monthly
   *     - M6  June Monthly
   *     - M7  July Monthly
   *     - M8  August Monthly
   *     - M9  September Monthly
   *     - MY  Mid-Year Report
   *     - Q1  April Quarterly
   *     - Q2  July Quarterly
   *     - Q3  October Quarterly
   *     - TER Termination Report
   *     - YE  Year-End
   *     - ADJ COMP ADJUST AMEND
   *     - CA  COMPREHENSIVE AMEND
   *     - 90S Post Inaugural Supplement
   *     - 90D Post Inaugural
   *     - 48  48 Hour Notification
   *     - 24  24 Hour Notification
   *     - M7S July Monthly/Semi-Annual
   *     - MSA Monthly Semi-Annual (MY)
   *     - MYS Monthly Year End/Semi-Annual
   *     - Q2S July Quarterly/Semi-Annual
   *     - QSA Quarterly Semi-Annual (MY)
   *     - QYS Quarterly Year End/Semi-Annual
   *     - QYE Quarterly Semi-Annual (YE)
   *     - QMS Quarterly Mid-Year/ Semi-Annual
   *     - MSY Monthly Semi-Annual (YE)
   */
  report_type?: string | null;
  report_year?: number | null;
  schedule_type?: string | null;
  schedule_type_full?: string | null;
  /** @maxLength 1 */
  spender_committee_designation?: string | null;
  spender_committee_name?: string | null;
  /** @maxLength 1 */
  spender_committee_type?: string | null;
  sub_id?: string;
  transaction_id?: string | null;
}

export interface ScheduleH4Efile {
  activity_or_event?: string | null;
  administrative_voter_drive_activity_indicator?: string | null;
  amendment_indicator?: string | null;
  back_reference_schedule_name?: string | null;
  back_reference_transaction_id?: string | null;
  beginning_image_number?: string;
  committee?: CommitteeHistory;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id?: string | null;
  csv_url?: string;
  direct_candidate_support_activity_indicator?: string | null;
  disbursement_amount?: number;
  disbursement_purpose?: string | null;
  entity_type?: string | null;
  event_amount_year_to_date?: number;
  /** @format date */
  event_purpose_date?: string | null;
  exempt_activity_indicator?: string | null;
  fec_url?: string;
  fed_share?: number;
  file_number: number;
  filing?: EFilings;
  fundraising_activity_indicator?: string | null;
  general_voter_drive_activity_indicator?: string | null;
  /**
   *
   * An unique identifier for each page where the electronic or paper filing is reported.
   */
  image_number?: string | null;
  is_notice?: boolean;
  /** @format date-time */
  load_timestamp?: string | null;
  memo_code?: string | null;
  memo_text?: string | null;
  nonfed_share?: number | null;
  payee_city?: string | null;
  payee_name?: string;
  payee_state?: string | null;
  payee_zip?: string | null;
  pdf_url?: string;
  public_comm_indicator?: string | null;
  related_line_number: number;
  report_type?: string;
  transaction_id?: string | null;
}

export interface ScheduleH4EfilePage {
  pagination?: OffsetInfo;
  results?: ScheduleH4Efile[];
}

export interface ScheduleH4Page {
  pagination?: SeekInfo;
  results?: ScheduleH4[];
}

export interface SeekInfo {
  count?: number;
  is_count_exact?: boolean;
  last_indexes?: any;
  pages?: number;
  per_page?: number;
}

export interface StateElectionOfficeInfo {
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  email?: string | null;
  fax_number?: string | null;
  mailing_address1?: string | null;
  mailing_address2?: string | null;
  mailing_city?: string | null;
  mailing_state?: string | null;
  mailing_zipcode?: string | null;
  office_name?: string | null;
  office_type: string;
  primary_phone_number?: string | null;
  secondary_phone_number?: string | null;
  state: string;
  state_full_name?: string | null;
  website_url1?: string | null;
  website_url2?: string | null;
  zip_code?: string | null;
}

export interface StateElectionOfficeInfoPage {
  pagination?: OffsetInfo;
  results?: StateElectionOfficeInfo[];
}

export interface TotalByOffice {
  election_year?: number;
  office?: string;
  total_disbursements?: number;
  total_individual_itemized_contributions?: number;
  total_other_political_committee_contributions?: number;
  total_receipts?: number;
  total_transfers_from_other_authorized_committee?: number;
}

export interface TotalByOfficeByParty {
  election_year?: number;
  office?: string;
  party?: string;
  total_disbursements?: number;
  total_receipts?: number;
}

export interface TotalByOfficeByPartyPage {
  pagination?: OffsetInfo;
  results?: TotalByOfficeByParty[];
}

export interface TotalByOfficePage {
  pagination?: OffsetInfo;
  results?: TotalByOffice[];
}

export interface TotalsCommittee {
  /**
   *
   * Affiliated committee or connected organization
   * @maxLength 100
   */
  affiliated_committee_name?: string | null;
  /**
   *
   * A unique identifier assigned to each candidate registered with the FEC.
   * If a person runs for several offices, that person will have separate candidate IDs for each office.
   * First character indicates office - [P]residential, [H]ouse, [S]enate].
   * Second character is the last digit of the two-year period the ID was created.
   * Third and fourth is the candidate state. Presidential IDs don't have state.
   * Fifth and sixth is the district when the candidate first ran. This does not change if the
   * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
   * The rest is sequence.
   */
  candidate_ids?: string[] | null;
  cash_on_hand_end_period?: number;
  /**
   *
   * City of committee as reported on the Form 1
   * @maxLength 50
   */
  city?: string | null;
  /**
   *
   * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
   */
  committee_id: string;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 1
   */
  committee_type?: string | null;
  /**
   * The one-letter type code of the organization:
   *         - C communication cost
   *         - D delegate
   *         - E electioneering communication
   *         - H House
   *         - I independent expenditure filer (not a committee)
   *         - N PAC - nonqualified
   *         - O independent expenditure-only (super PACs)
   *         - P presidential
   *         - Q PAC - qualified
   *         - S Senate
   *         - U single candidate independent expenditure
   *         - V PAC with non-contribution account, nonqualified
   *         - W PAC with non-contribution account, qualified
   *         - X party, nonqualified
   *         - Y party, qualified
   *         - Z national party non-federal account
   * @maxLength 50
   */
  committee_type_full?: string | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycle: number;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s) The cycle begins with
   * an odd year and is named for its ending, even year.
   */
  cycles?: number[] | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1), and the committee has filling activity during the cycle
   */
  cycles_has_activity?: number[] | null;
  /**
   *
   * A two year election cycle that the committee was active- (after original registration
   * date but before expiration date in Form 1s), and the committee files the financial reports
   * ('F3', 'F3X', 'F3P', 'F3L', 'F4', 'F5', 'F7', 'F13') during this cycle.
   */
  cycles_has_financial?: number[] | null;
  debts_owed_by_committee?: number;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 1
   */
  designation?: string | null;
  /**
   * The one-letter designation code of the organization:
   *          - A authorized by a candidate
   *          - J joint fundraising committee
   *          - P principal campaign committee of a candidate
   *          - U unauthorized
   *          - B lobbyist/registrant PAC
   *          - D leadership PAC
   * @maxLength 25
   */
  designation_full?: string | null;
  disbursements?: number;
  /**
   * The one-letter
   *     code of the filing frequency:
   *          - A Administratively terminated
   *          - D Debt
   *          - M Monthly filer
   *          - Q Quarterly filer
   *          - T Terminated
   *          - W Waived
   * @maxLength 1
   */
  filing_frequency?: string | null;
  /**
   * The day the FEC received the committee's first Form 1
   * @format date
   */
  first_f1_date?: string | null;
  /**
   * The day the FEC received the committee's first filing. This is usually a Form 1 committee registration.
   * @format date
   */
  first_file_date?: string | null;
  independent_expenditures?: number;
  /**
   *
   * True indicates that a committee is active.
   */
  is_active?: boolean | null;
  jfc_committee?: JFCCommittee[];
  /**
   *
   * The latest two year election cycle that the committee has filings
   */
  last_cycle_has_activity?: number | null;
  /**
   *
   * The latest two year election cycle that the committee files the financial reports
   * ('F3', 'F3X', 'F3P', 'F3L', 'F4', 'F5', 'F7', 'F13').
   */
  last_cycle_has_financial?: number | null;
  /**
   * The day the FEC received the committee's most recent Form 1
   * @format date
   */
  last_f1_date?: string | null;
  /**
   * The day the FEC received the committee's most recent filing
   * @format date
   */
  last_file_date?: string | null;
  /**
   * The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records.
   * @maxLength 100
   */
  name?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 1
   */
  organization_type?: string | null;
  /**
   * The one-letter code for the kind for organization:
   *         - C corporation
   *         - L labor organization
   *         - M membership organization
   *         - T trade association
   *         - V cooperative
   *         - W corporation without capital stock
   * @maxLength 100
   */
  organization_type_full?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 3
   */
  party?: string | null;
  /**
   * Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party.
   * @maxLength 50
   */
  party_full?: string | null;
  receipts?: number;
  /**
   *
   * State of the committee's address as filed on the Form 1
   * @maxLength 2
   */
  state?: string | null;
  /**
   *
   * State of committee as reported on the Form 1
   * @maxLength 50
   */
  state_full?: string | null;
  /**
   *
   * Street address of committee as reported on the Form 1
   * @maxLength 50
   */
  street_1?: string | null;
  /**
   *
   * Second line of street address of committee as reported on the Form 1
   * @maxLength 50
   */
  street_2?: string | null;
  /**
   * Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown.
   * @maxLength 100
   */
  treasurer_name?: string | null;
  /**
   *
   * Zip code of committee as reported on the Form 1
   * @maxLength 9
   */
  zip?: string | null;
}

export interface TotalsCommitteePage {
  pagination?: OffsetInfo;
  results?: TotalsCommittee[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title OpenFEC
 * @version 1.0
 *
 * This application programming interface (API) allows you to explore the way candidates and committees fund their campaigns.
 *
 *  The Federal Election Commission (FEC) API is a RESTful web service supporting full-text and field-specific searches on FEC data. [Bulk downloads](https://www.fec.gov/data/advanced/?tab=bulk-data) are available on the current site. Information is tied to the underlying forms by file ID and image ID. Data are updated nightly.
 *
 *  There are a lot of data, and a good place to start is to use search to find interesting candidates and committees. Then, you can use their IDs to find report or line item details with the other endpoints. If you are interested in individual donors, check out contributor information in the `/schedule_a/` endpoints.
 *
 *  <b class="body" id="getting_started_head">Getting started with the openFEC API</b><br>
 *
 *  If you would like to use the FEC's API programmatically, you can sign up for your own API key using our form. Alternatively, you can still try out our API without an API key by using the web interface and using DEMO_KEY. Note that when you use the openFEC API you are subject to the [Terms of Service](https://github.com/fecgov/FEC/blob/master/TERMS-OF-SERVICE.md) and [Acceptable Use policy](https://github.com/fecgov/FEC/blob/master/ACCEPTABLE-USE-POLICY.md).
 *
 *  Signing up for an API key will enable you to place up to 1,000 calls an hour. Each call is limited to 100 results per page. You can email questions, comments or a request to get a key for 7,200 calls an hour (120 calls per minute) to <a href="mailto:APIinfo@fec.gov">APIinfo@fec.gov</a>. You can also ask questions and discuss the data in a community led [group](https://groups.google.com/forum/#!forum/fec-data).
 *
 *  The model definitions and schema are available at [/swagger](/swagger/). This is useful for making wrappers and exploring the data.
 *
 *  A few restrictions limit the way you can use FEC data. For example, you can’t use contributor lists for commercial purposes or to solicit donations. [Learn more here](https://www.fec.gov/updates/sale-or-use-contributor-information/).
 *
 *  [Inspect our source code](https://github.com/fecgov/openFEC). We welcome issues and pull requests!
 *
 *  <p><br></p> <h2 class="title" id="signup_head">Sign up for an API key</h2> <div id="apidatagov_signup">Loading signup form...</div>
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * @description This endpoint contains Final Audit Reports approved by the Commission since inception. The search can be based on information about the audited committee (Name, FEC ID Number, Type, Election Cycle) or the issues covered in the report.
     *
     * @tags audit
     * @name AuditCaseList
     * @request GET:/v1/audit-case/
     * @secure
     */
    auditCaseList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
        q?: string[];
        /** Name of candidate running for office */
        qq?: string[];
        /**
         *
         * Audit category ID (table PK)
         * @default "all"
         */
        primary_category_id?: string;
        /**
         *
         * The finding id of an audit. Finding are a category of broader issues. Each category has an unique ID.
         * @default "all"
         */
        sub_category_id?: string;
        /**
         *
         * Primary/foreign key for audit tables
         */
        audit_case_id?: string[];
        /**
         *
         * Filter records to only those that are applicable to a given two-year
         * period. This cycle follows the traditional House election cycle and
         * subdivides the presidential and Senate elections into comparable
         * two-year blocks. The cycle begins with an odd year and is named for its
         * ending, even year.
         */
        cycle?: number[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: string[];
        /**
         * Type of committee:
         *         - H or S - Congressional
         *         - P - Presidential
         *         - X or Y or Z - Party
         *         - N or Q - PAC
         *         - I - Independent expenditure
         *         - O - Super PAC
         */
        committee_designation?: string;
        /**
         *
         * The audit issue. Each subcategory has an unique ID
         */
        audit_id?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * Filter records to only those that are applicable to a given two-year
         * period. This cycle follows the traditional House election cycle and
         * subdivides the presidential and Senate elections into comparable
         * two-year blocks. The cycle begins with an odd year and is named for its
         * ending, even year.
         */
        min_election_cycle?: number;
        /**
         *
         * Filter records to only those that are applicable to a given two-year
         * period. This cycle follows the traditional House election cycle and
         * subdivides the presidential and Senate elections into comparable
         * two-year blocks. The cycle begins with an odd year and is named for its
         * ending, even year.
         */
        max_election_cycle?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-cycle","committee_name"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, AuditCasePage>({
        path: `/v1/audit-case/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This lists the options for the categories and subcategories available in the /audit-search/ endpoint.
     *
     * @tags audit
     * @name AuditCategoryList
     * @request GET:/v1/audit-category/
     * @secure
     */
    auditCategoryList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Audit category ID (table PK)
         */
        primary_category_id?: string[];
        /**
         * Primary Audit Category
         *     - No Findings or Issues/Not a Committee
         *     - Net Outstanding Campaign/Convention Expenditures/Obligations
         *     - Payments/Disgorgements
         *     - Allocation Issues
         *     - Prohibited Contributions
         *     - Disclosure
         *     - Recordkeeping
         *     - Repayment to US Treasury
         *     - Other
         *     - Misstatement of Financial Activity
         *     - Excessive Contributions
         *     - Failure to File Reports/Schedules/Notices
         *     - Loans
         *     - Referred Findings Not Listed
         */
        primary_category_name?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "primary_category_name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, AuditCategoryPage>({
        path: `/v1/audit-category/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This lists the options for the primary categories available in the /audit-search/ endpoint.
     *
     * @tags audit
     * @name AuditPrimaryCategoryList
     * @request GET:/v1/audit-primary-category/
     * @secure
     */
    auditPrimaryCategoryList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Audit category ID (table PK)
         */
        primary_category_id?: string[];
        /**
         * Primary Audit Category
         *     - No Findings or Issues/Not a Committee
         *     - Net Outstanding Campaign/Convention Expenditures/Obligations
         *     - Payments/Disgorgements
         *     - Allocation Issues
         *     - Prohibited Contributions
         *     - Disclosure
         *     - Recordkeeping
         *     - Repayment to US Treasury
         *     - Other
         *     - Misstatement of Financial Activity
         *     - Excessive Contributions
         *     - Failure to File Reports/Schedules/Notices
         *     - Loans
         *     - Referred Findings Not Listed
         */
        primary_category_name?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "primary_category_name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, AuditPrimaryCategoryPage>({
        path: `/v1/audit-primary-category/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Combines the election and reporting dates with Commission meetings, conferences, outreach, Advisory Opinions, rules, litigation dates and other events into one calendar. State and report type filtering is no longer available.
     *
     * @tags dates
     * @name CalendarDatesList
     * @request GET:/v1/calendar-dates/
     * @secure
     */
    calendarDatesList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Each type of event has a calendar category with an integer id. Options are: Open Meetings: 32, Executive Sessions: 39, Public Hearings: 40,
         * Conferences: 33, Roundtables: 34, Election Dates: 36, Federal Holidays: 37, FEA Periods: 38, Commission Meetings: 20,
         * Reporting Deadlines: 21, Conferences and Outreach: 22, AOs and Rules: 23, Other: 24, Quarterly: 25, Monthly: 26,
         * Pre and Post-Elections: 27, EC Periods:28, and IE Periods: 29
         */
        calendar_category_id?: number[];
        /** Brief description of event */
        description?: string[];
        /** Longer description of event */
        summary?: string[];
        /**
         *
         * The minimum start date.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_start_date?: string;
        /**
         *
         * The minimum end date.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_end_date?: string;
        /**
         *
         * The maximum start date.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_start_date?: string;
        /**
         *
         * The maximum end date.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_end_date?: string;
        /** An unique ID for an event. Useful for downloading a single event to your calendar. This ID is not a permanent, persistent ID. */
        event_id?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-start_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CalendarDatePage>({
        path: `/v1/calendar-dates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns CSV or ICS for downloading directly into calendar applications like Google, Outlook or other applications. Combines the election and reporting dates with Commission meetings, conferences, outreach, Advisory Opinions, rules, litigation dates and other events into one calendar. State filtering now applies to elections, reports and reporting periods. Presidential pre-primary report due dates are not shown on even years. Filers generally opt to file monthly rather than submit over 50 pre-primary election reports. All reporting deadlines are available at /reporting-dates/ for reference. This is [the sql function](https://github.com/fecgov/openFEC/blob/develop/data/migrations/V40__omnibus_dates.sql) that creates the calendar.
     *
     * @tags dates
     * @name CalendarDatesExportList
     * @request GET:/v1/calendar-dates/export/
     * @secure
     */
    calendarDatesExportList: (
      query?: {
        /** @default "ics" */
        renderer?: "ics" | "csv";
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Each type of event has a calendar category with an integer id. Options are: Open Meetings: 32, Executive Sessions: 39, Public Hearings: 40,
         * Conferences: 33, Roundtables: 34, Election Dates: 36, Federal Holidays: 37, FEA Periods: 38, Commission Meetings: 20,
         * Reporting Deadlines: 21, Conferences and Outreach: 22, AOs and Rules: 23, Other: 24, Quarterly: 25, Monthly: 26,
         * Pre and Post-Elections: 27, EC Periods:28, and IE Periods: 29
         */
        calendar_category_id?: number[];
        /** Brief description of event */
        description?: string[];
        /** Longer description of event */
        summary?: string[];
        /**
         *
         * The minimum start date.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_start_date?: string;
        /**
         *
         * The minimum end date.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_end_date?: string;
        /**
         *
         * The maximum start date.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_start_date?: string;
        /**
         *
         * The maximum end date.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_end_date?: string;
        /** An unique ID for an event. Useful for downloading a single event to your calendar. This ID is not a permanent, persistent ID. */
        event_id?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-start_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CalendarDatePage>({
        path: `/v1/calendar-dates/export/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint is useful for finding detailed information about a particular candidate. Use the `candidate_id` to find the most recent information about that candidate.
     *
     * @tags candidate
     * @name CandidateDetail
     * @request GET:/v1/candidate/{candidate_id}/
     * @secure
     */
    candidateDetail: (
      candidateId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Two-year election cycle in which a candidate runs for office.
         * Calculated from Form 2. The cycle begins with
         * an odd year and is named for its ending, even year. This cycle follows
         * the traditional house election cycle and subdivides the presidential
         * and Senate elections into comparable two-year blocks. To retrieve data for
         * the entire four years of a presidential term or six years of a senatorial term,
         * you will need the `election_full` flag.
         */
        cycle?: number[];
        /** Year of election */
        election_year?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: ("" | "H" | "S" | "P")[];
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: string[];
        /** Retrieve records pertaining to a particular election year. The list of election years is based on a candidate filing a statement of candidacy (F2) for that year. */
        year?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /**
         * One-letter code explaining if the candidate is:
         *         - C present candidate
         *         - F future candidate
         *         - N not yet a candidate
         *         - P prior candidate
         */
        candidate_status?: ("" | "C" | "F" | "N" | "P")[];
        /** One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open. */
        incumbent_challenge?: ("" | "I" | "C" | "O")[];
        /** A boolean the describes if a presidential candidate has accepted federal funds. The flag will be false for House and Senate candidates. */
        federal_funds_flag?: boolean;
        /** A boolean that describes if a candidate's committee has ever received any receipts for their campaign for this particular office. (Candidates have separate candidate IDs for each office.) */
        has_raised_funds?: boolean;
        /** Name (candidate or committee) to search for. Alias for 'q'. */
        name?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateDetailPage>({
        path: `/v1/candidate/${candidateId}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint is useful for finding detailed information about a particular committee or filer. Use the `committee_id` to find the most recent information about the committee.
     *
     * @tags committee
     * @name CandidateCommitteesDetail
     * @request GET:/v1/candidate/{candidate_id}/committees/
     * @secure
     */
    candidateCommitteesDetail: (
      candidateId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** A year that the committee was active— (after original registration date     or filing but before expiration date) */
        year?: number[];
        /**
         *
         * A two year election cycle that the committee was active- (after original registration
         * date but before expiration date in Form 1s) The cycle begins with
         * an odd year and is named for its ending, even year.
         */
        cycle?: number[];
        /**
         * The one-letter
         *     code of the filing frequency:
         *          - A Administratively terminated
         *          - D Debt
         *          - M Monthly filer
         *          - Q Quarterly filer
         *          - T Terminated
         *          - W Waived
         */
        filing_frequency?: (
          | ""
          | "A"
          | "M"
          | "N"
          | "Q"
          | "T"
          | "W"
          | "-A"
          | "-T"
        )[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        designation?: ("" | "A" | "J" | "P" | "U" | "B" | "D")[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        organization_type?: ("" | "C" | "L" | "M" | "T" | "V" | "W")[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: (
          | ""
          | "C"
          | "D"
          | "E"
          | "H"
          | "I"
          | "N"
          | "O"
          | "P"
          | "Q"
          | "S"
          | "U"
          | "V"
          | "W"
          | "X"
          | "Y"
          | "Z"
        )[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeDetailPage>({
        path: `/v1/candidate/${candidateId}/committees/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Explore a filer's characteristics over time. This can be particularly useful if the committees change treasurers, designation, or `committee_type`.
     *
     * @tags committee
     * @name CandidateCommitteesHistoryDetail
     * @request GET:/v1/candidate/{candidate_id}/committees/history/
     * @secure
     */
    candidateCommitteesHistoryDetail: (
      candidateId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        designation?: ("" | "A" | "J" | "P" | "U" | "B" | "D")[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-cycle"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeHistoryProfilePage>({
        path: `/v1/candidate/${candidateId}/committees/history/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Explore a filer's characteristics over time. This can be particularly useful if the committees change treasurers, designation, or `committee_type`.
     *
     * @tags committee
     * @name CandidateCommitteesHistoryDetail2
     * @request GET:/v1/candidate/{candidate_id}/committees/history/{cycle}/
     * @originalName candidateCommitteesHistoryDetail
     * @duplicate
     * @secure
     */
    candidateCommitteesHistoryDetail2: (
      cycle: number,
      candidateId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        designation?: ("" | "A" | "J" | "P" | "U" | "B" | "D")[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-cycle"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeHistoryProfilePage>({
        path: `/v1/candidate/${candidateId}/committees/history/${cycle}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description All official records and reports filed by or delivered to the FEC. Note: because the filings data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
     *
     * @tags filings
     * @name CandidateFilingsDetail
     * @request GET:/v1/candidate/{candidate_id}/filings/
     * @secure
     */
    candidateFilingsDetail: (
      candidateId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: string;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
         */
        is_amended?: boolean;
        /**
         *
         * Report is either new or is the most-recently filed amendment
         */
        most_recent?: boolean;
        /**
         * Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         *     - 90S Post Inaugural Supplement
         *     - 90D Post Inaugural
         *     - 48  48 Hour Notification
         *     - 24  24 Hour Notification
         *     - M7S July Monthly/Semi-Annual
         *     - MSA Monthly Semi-Annual (MY)
         *     - MYS Monthly Year End/Semi-Annual
         *     - Q2S July Quarterly/Semi-Annual
         *     - QSA Quarterly Semi-Annual (MY)
         *     - QYS Quarterly Year End/Semi-Annual
         *     - QYE Quarterly Semi-Annual (YE)
         *     - QMS Quarterly Mid-Year/ Semi-Annual
         *     - MSY Monthly Semi-Annual (YE)
         */
        report_type?: string[];
        /**
         *
         * Requests for additional information (RFAIs) sent to filers. The request type is based on the type of document filed:
         *     - 1 Statement of Organization
         *     - 2 Report of Receipts and Expenditures (Form 3 and 3X)
         *     - 3 Second Notice - Reports
         *     - 4 Request for Additional Information
         *     - 5 Informational - Reports
         *     - 6 Second Notice - Statement of Organization
         *     - 7 Failure to File
         *     - 8 From Public Disclosure
         *     - 9 From Multi Candidate Status
         */
        request_type?: string[];
        /**
         *
         * The type of document for documents other than reports:
         *     - 2 24 Hour Contribution Notice
         *     - 4 48 Hour Contribution Notice
         *     - A Debt Settlement Statement
         *     - B Acknowledgment of Receipt of Debt Settlement Statement
         *     - C RFAI: Debt Settlement First Notice
         *     - D Commission Debt Settlement Review
         *     - E Commission Response TO Debt Settlement Request
         *     - F Administrative Termination
         *     - G Debt Settlement Plan Amendment
         *     - H Disavowal Notice
         *     - I Disavowal Response
         *     - J Conduit Report
         *     - K Termination Approval
         *     - L Repeat Non-Filer Notice
         *     - M Filing Frequency Change Notice
         *     - N Paper Amendment to Electronic Report
         *     - O Acknowledgment of Filing Frequency Change
         *     - S RFAI: Debt Settlement Second
         *     - T Miscellaneous Report TO FEC
         *     - V Repeat Violation Notice (441A OR 441B)
         *     - P Notice of Paper Filing
         *     - R F3L Filing Frequency Change Notice
         *     - Q Acknowledgment of F3L Filing Frequency Change
         *     - U Unregistered Committee Notice
         */
        document_type?: string[];
        /**
         *
         * Unique identifier for the electronic or paper report. This number is used to construct
         * PDF URLs to the original document.
         */
        beginning_image_number?: string[];
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        report_year?: number[];
        /**
         *
         * Selects all filings received after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Selects all filings received before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         * The form where the underlying data comes from, for example, Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         *     - FRQ  Request for Additional Information
         */
        form_type?: string[];
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /** Federal office candidate runs for: H, S or P */
        office?: ("" | "H" | "S" | "P")[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: string[];
        /** The method used to file with the FEC, either electronic or on paper. */
        filer_type?: "e-file" | "paper";
        /** Filing ID number */
        file_number?: number[];
        /**
         *
         * Primary, general or special election indicator.
         */
        primary_general_indicator?: string[];
        /**
         * Amendent types:
         *     -N   new
         *     -A   amendment
         *     -T   terminated
         *     -C   consolidated
         *     -M   multi-candidate
         *     -S   secondary
         *
         * NULL might be new or amendment. If amendment indicator is null and the filings is the first or first in a chain treat it as if it was a new. If it is not the first or first in a chain then treat the filing as an amendment.
         */
        amendment_indicator?: ("" | "N" | "A" | "T" | "C" | "M" | "S")[];
        /**
         *
         * The forms filed are categorized based on the nature of the filing:
         *     - REPORT F3, F3X, F3P, F3L, F4, F5, F7, F13
         *     - NOTICE F5, F24, F6, F9, F10, F11
         *     - STATEMENT F1, F2
         *     - OTHER F1M, F8, F99, F12, FRQ
         */
        form_category?: string[];
        /**
         *
         * Keyword search for filer name or ID
         */
        q_filer?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-receipt_date"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, FilingsPage>({
        path: `/v1/candidate/${candidateId}/filings/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Find out a candidate's characteristics over time. This is particularly useful if the candidate runs for the same office in different districts or you want to know more about a candidate's previous races. This information is organized by `candidate_id`, so it won't help you find a candidate who ran for different offices over time; candidates get a new ID for each office.
     *
     * @tags candidate
     * @name CandidateHistoryDetail
     * @request GET:/v1/candidate/{candidate_id}/history/
     * @secure
     */
    candidateHistoryDetail: (
      candidateId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-two_year_period"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateHistoryPage>({
        path: `/v1/candidate/${candidateId}/history/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Find out a candidate's characteristics over time. This is particularly useful if the candidate runs for the same office in different districts or you want to know more about a candidate's previous races. This information is organized by `candidate_id`, so it won't help you find a candidate who ran for different offices over time; candidates get a new ID for each office.
     *
     * @tags candidate
     * @name CandidateHistoryDetail2
     * @request GET:/v1/candidate/{candidate_id}/history/{cycle}/
     * @originalName candidateHistoryDetail
     * @duplicate
     * @secure
     */
    candidateHistoryDetail2: (
      cycle: number,
      candidateId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-two_year_period"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateHistoryPage>({
        path: `/v1/candidate/${candidateId}/history/${cycle}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides information about a committee's Form 3, Form 3X, or Form 3P financial reports, which are aggregated by two-year period. We refer to two-year periods as a `cycle`. The cycle is named after the even-numbered year and includes the year before it. To obtain totals from 2013 and 2014, you would use 2014. In odd-numbered years, the current cycle is the next year — for example, in 2015, the current cycle is 2016. For presidential and Senate candidates, multiple two-year cycles exist between elections.
     *
     * @tags candidate
     * @name CandidateTotalsDetail
     * @request GET:/v1/candidate/{candidate_id}/totals/
     * @secure
     */
    candidateTotalsDetail: (
      candidateId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         */
        election_full?: boolean;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-cycle"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeTotalsPage>({
        path: `/v1/candidate/${candidateId}/totals/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch basic information about candidates, and use parameters to filter results to the candidates you're looking for. Each result reflects a unique FEC candidate ID. That ID is particular to the candidate for a particular office sought. If a candidate runs for the same office multiple times, the ID stays the same. If the same person runs for another office — for example, a House candidate runs for a Senate office — that candidate will get a unique ID for each office.
     *
     * @tags candidate
     * @name CandidatesList
     * @request GET:/v1/candidates/
     * @secure
     */
    candidatesList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Name of candidate running for office */
        q?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /** Selects all candidates whose first filing was received by the FEC after this date. */
        min_first_file_date?: string;
        /** Selects all candidates whose first filing was received by the FEC before this date. */
        max_first_file_date?: string;
        /**
         *  Candidates who are actively seeking office. If no value is specified, all candidates
         * are returned. When True is specified, only active candidates are returned. When False is
         * specified, only inactive candidates are returned.
         */
        is_active_candidate?: boolean;
        /**
         *
         * Two-year election cycle in which a candidate runs for office.
         * Calculated from Form 2. The cycle begins with
         * an odd year and is named for its ending, even year. This cycle follows
         * the traditional house election cycle and subdivides the presidential
         * and Senate elections into comparable two-year blocks. To retrieve data for
         * the entire four years of a presidential term or six years of a senatorial term,
         * you will need the `election_full` flag.
         */
        cycle?: number[];
        /** Year of election */
        election_year?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: ("" | "H" | "S" | "P")[];
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: string[];
        /** Retrieve records pertaining to a particular election year. The list of election years is based on a candidate filing a statement of candidacy (F2) for that year. */
        year?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /**
         * One-letter code explaining if the candidate is:
         *         - C present candidate
         *         - F future candidate
         *         - N not yet a candidate
         *         - P prior candidate
         */
        candidate_status?: ("" | "C" | "F" | "N" | "P")[];
        /** One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open. */
        incumbent_challenge?: ("" | "I" | "C" | "O")[];
        /** A boolean the describes if a presidential candidate has accepted federal funds. The flag will be false for House and Senate candidates. */
        federal_funds_flag?: boolean;
        /** A boolean that describes if a candidate's committee has ever received any receipts for their campaign for this particular office. (Candidates have separate candidate IDs for each office.) */
        has_raised_funds?: boolean;
        /** Name (candidate or committee) to search for. Alias for 'q'. */
        name?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidatePage>({
        path: `/v1/candidates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch basic information about candidates and their principal committees. Each result reflects a unique FEC candidate ID. That ID is assigned to the candidate for a particular office sought. If a candidate runs for the same office over time, that ID stays the same. If the same person runs for multiple offices — for example, a House candidate runs for a Senate office — that candidate will get a unique ID for each office. The candidate endpoints primarily use data from FEC registration [Form 1](https://www.fec.gov/pdf/forms/fecfrm1.pdf) for committee information and [Form 2](https://www.fec.gov/pdf/forms/fecfrm2.pdf) for candidate information.
     *
     * @tags candidate
     * @name CandidatesSearchList
     * @request GET:/v1/candidates/search/
     * @secure
     */
    candidatesSearchList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Name of candidate running for office */
        q?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /** Selects all candidates whose first filing was received by the FEC after this date. */
        min_first_file_date?: string;
        /** Selects all candidates whose first filing was received by the FEC before this date. */
        max_first_file_date?: string;
        /**
         *  Candidates who are actively seeking office. If no value is specified, all candidates
         * are returned. When True is specified, only active candidates are returned. When False is
         * specified, only inactive candidates are returned.
         */
        is_active_candidate?: boolean;
        /**
         *
         * Two-year election cycle in which a candidate runs for office.
         * Calculated from Form 2. The cycle begins with
         * an odd year and is named for its ending, even year. This cycle follows
         * the traditional house election cycle and subdivides the presidential
         * and Senate elections into comparable two-year blocks. To retrieve data for
         * the entire four years of a presidential term or six years of a senatorial term,
         * you will need the `election_full` flag.
         */
        cycle?: number[];
        /** Year of election */
        election_year?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: ("" | "H" | "S" | "P")[];
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: string[];
        /** Retrieve records pertaining to a particular election year. The list of election years is based on a candidate filing a statement of candidacy (F2) for that year. */
        year?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /**
         * One-letter code explaining if the candidate is:
         *         - C present candidate
         *         - F future candidate
         *         - N not yet a candidate
         *         - P prior candidate
         */
        candidate_status?: ("" | "C" | "F" | "N" | "P")[];
        /** One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open. */
        incumbent_challenge?: ("" | "I" | "C" | "O")[];
        /** A boolean the describes if a presidential candidate has accepted federal funds. The flag will be false for House and Senate candidates. */
        federal_funds_flag?: boolean;
        /** A boolean that describes if a candidate's committee has ever received any receipts for their campaign for this particular office. (Candidates have separate candidate IDs for each office.) */
        has_raised_funds?: boolean;
        /** Name (candidate or committee) to search for. Alias for 'q'. */
        name?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateSearchPage>({
        path: `/v1/candidates/search/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Aggregated candidate receipts and disbursements grouped by cycle.
     *
     * @tags candidate
     * @name CandidatesTotalsList
     * @request GET:/v1/candidates/totals/
     * @secure
     */
    candidatesTotalsList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Name of candidate running for office */
        q?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        election_year?: number[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: ("" | "H" | "S" | "P")[];
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /** Three-letter party code */
        party?: string[];
        /** Minimum aggregated receipts */
        min_receipts?: number;
        /** Maximum aggregated receipts */
        max_receipts?: number;
        /** Minimum aggregated disbursements */
        min_disbursements?: number;
        /** Maximum aggregated disbursements */
        max_disbursements?: number;
        /** Minimum cash on hand */
        min_cash_on_hand_end_period?: number;
        /** Maximum cash on hand */
        max_cash_on_hand_end_period?: number;
        /** Minimum debt */
        min_debts_owed_by_committee?: number;
        /** Maximum debt */
        max_debts_owed_by_committee?: number;
        /** A boolean the describes if a presidential candidate has accepted federal funds. The flag will be false for House and Senate candidates. */
        federal_funds_flag?: boolean;
        /** A boolean that describes if a candidate's committee has ever received any receipts for their campaign for this particular office. (Candidates have separate candidate IDs for each office.) */
        has_raised_funds?: boolean;
        /**
         *  Candidates who are actively seeking office. If no value is specified, all candidates
         * are returned. When True is specified, only active candidates are returned. When False is
         * specified, only inactive candidates are returned.
         */
        is_active_candidate?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-election_year"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateHistoryTotalPage>({
        path: `/v1/candidates/totals/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Candidate total receipts and disbursements aggregated by `aggregate_by`.
     *
     * @tags candidate
     * @name CandidatesTotalsAggregatesList
     * @request GET:/v1/candidates/totals/aggregates/
     * @secure
     */
    candidatesTotalsAggregatesList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        election_year?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: "" | "H" | "S" | "P";
        /**
         *  Candidates who are actively seeking office. If no value is specified, all candidates
         * are returned. When True is specified, only active candidates are returned. When False is
         * specified, only inactive candidates are returned.
         */
        is_active_candidate?: boolean;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         *
         * Filter records to only those that are applicable to a given two-year
         * period. This cycle follows the traditional House election cycle and
         * subdivides the presidential and Senate elections into comparable
         * two-year blocks. The cycle begins with an odd year and is named for its
         * ending, even year.
         */
        min_election_cycle?: number;
        /**
         *
         * Filter records to only those that are applicable to a given two-year
         * period. This cycle follows the traditional House election cycle and
         * subdivides the presidential and Senate elections into comparable
         * two-year blocks. The cycle begins with an odd year and is named for its
         * ending, even year.
         */
        max_election_cycle?: number;
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: "" | "DEM" | "REP" | "OTHER";
        /**
         * Candidate totals aggregate_by (Chose one of dropdown options):
         *         - ' ' grouped by election year
         *         - office grouped by election year, by office
         *         - office-state grouped by election year, by office, by state
         *         - office-state-district grouped by election year, by office, by state, by district
         *         - office-party grouped by election year, by office, by party
         */
        aggregate_by?:
          | "office"
          | "office-state"
          | "office-state-district"
          | "office-party";
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-election_year"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateTotalAggregatePage>({
        path: `/v1/candidates/totals/aggregates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint is useful for finding detailed information about a particular committee or filer. Use the `committee_id` to find the most recent information about the committee.
     *
     * @tags committee
     * @name CommitteeDetail
     * @request GET:/v1/committee/{committee_id}/
     * @secure
     */
    committeeDetail: (
      committeeId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** A year that the committee was active— (after original registration date     or filing but before expiration date) */
        year?: number[];
        /**
         *
         * A two year election cycle that the committee was active- (after original registration
         * date but before expiration date in Form 1s) The cycle begins with
         * an odd year and is named for its ending, even year.
         */
        cycle?: number[];
        /**
         * The one-letter
         *     code of the filing frequency:
         *          - A Administratively terminated
         *          - D Debt
         *          - M Monthly filer
         *          - Q Quarterly filer
         *          - T Terminated
         *          - W Waived
         */
        filing_frequency?: (
          | ""
          | "A"
          | "M"
          | "N"
          | "Q"
          | "T"
          | "W"
          | "-A"
          | "-T"
        )[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        designation?: ("" | "A" | "J" | "P" | "U" | "B" | "D")[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        organization_type?: ("" | "C" | "L" | "M" | "T" | "V" | "W")[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: (
          | ""
          | "C"
          | "D"
          | "E"
          | "H"
          | "I"
          | "N"
          | "O"
          | "P"
          | "Q"
          | "S"
          | "U"
          | "V"
          | "W"
          | "X"
          | "Y"
          | "Z"
        )[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeDetailPage>({
        path: `/v1/committee/${committeeId}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint is useful for finding detailed information about a particular candidate. Use the `candidate_id` to find the most recent information about that candidate.
     *
     * @tags candidate
     * @name CommitteeCandidatesDetail
     * @request GET:/v1/committee/{committee_id}/candidates/
     * @secure
     */
    committeeCandidatesDetail: (
      committeeId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Two-year election cycle in which a candidate runs for office.
         * Calculated from Form 2. The cycle begins with
         * an odd year and is named for its ending, even year. This cycle follows
         * the traditional house election cycle and subdivides the presidential
         * and Senate elections into comparable two-year blocks. To retrieve data for
         * the entire four years of a presidential term or six years of a senatorial term,
         * you will need the `election_full` flag.
         */
        cycle?: number[];
        /** Year of election */
        election_year?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: ("" | "H" | "S" | "P")[];
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: string[];
        /** Retrieve records pertaining to a particular election year. The list of election years is based on a candidate filing a statement of candidacy (F2) for that year. */
        year?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /**
         * One-letter code explaining if the candidate is:
         *         - C present candidate
         *         - F future candidate
         *         - N not yet a candidate
         *         - P prior candidate
         */
        candidate_status?: ("" | "C" | "F" | "N" | "P")[];
        /** One-letter code ('I', 'C', 'O') explaining if the candidate is an incumbent, a challenger, or if the seat is open. */
        incumbent_challenge?: ("" | "I" | "C" | "O")[];
        /** A boolean the describes if a presidential candidate has accepted federal funds. The flag will be false for House and Senate candidates. */
        federal_funds_flag?: boolean;
        /** A boolean that describes if a candidate's committee has ever received any receipts for their campaign for this particular office. (Candidates have separate candidate IDs for each office.) */
        has_raised_funds?: boolean;
        /** Name (candidate or committee) to search for. Alias for 'q'. */
        name?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateDetailPage>({
        path: `/v1/committee/${committeeId}/candidates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Find out a candidate's characteristics over time. This is particularly useful if the candidate runs for the same office in different districts or you want to know more about a candidate's previous races. This information is organized by `candidate_id`, so it won't help you find a candidate who ran for different offices over time; candidates get a new ID for each office.
     *
     * @tags candidate
     * @name CommitteeCandidatesHistoryDetail
     * @request GET:/v1/committee/{committee_id}/candidates/history/
     * @secure
     */
    committeeCandidatesHistoryDetail: (
      committeeId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-two_year_period"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateHistoryPage>({
        path: `/v1/committee/${committeeId}/candidates/history/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Find out a candidate's characteristics over time. This is particularly useful if the candidate runs for the same office in different districts or you want to know more about a candidate's previous races. This information is organized by `candidate_id`, so it won't help you find a candidate who ran for different offices over time; candidates get a new ID for each office.
     *
     * @tags candidate
     * @name CommitteeCandidatesHistoryDetail2
     * @request GET:/v1/committee/{committee_id}/candidates/history/{cycle}/
     * @originalName committeeCandidatesHistoryDetail
     * @duplicate
     * @secure
     */
    committeeCandidatesHistoryDetail2: (
      committeeId: string,
      cycle: number,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-two_year_period"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateHistoryPage>({
        path: `/v1/committee/${committeeId}/candidates/history/${cycle}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description All official records and reports filed by or delivered to the FEC. Note: because the filings data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
     *
     * @tags filings
     * @name CommitteeFilingsDetail
     * @request GET:/v1/committee/{committee_id}/filings/
     * @secure
     */
    committeeFilingsDetail: (
      committeeId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: string;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
         */
        is_amended?: boolean;
        /**
         *
         * Report is either new or is the most-recently filed amendment
         */
        most_recent?: boolean;
        /**
         * Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         *     - 90S Post Inaugural Supplement
         *     - 90D Post Inaugural
         *     - 48  48 Hour Notification
         *     - 24  24 Hour Notification
         *     - M7S July Monthly/Semi-Annual
         *     - MSA Monthly Semi-Annual (MY)
         *     - MYS Monthly Year End/Semi-Annual
         *     - Q2S July Quarterly/Semi-Annual
         *     - QSA Quarterly Semi-Annual (MY)
         *     - QYS Quarterly Year End/Semi-Annual
         *     - QYE Quarterly Semi-Annual (YE)
         *     - QMS Quarterly Mid-Year/ Semi-Annual
         *     - MSY Monthly Semi-Annual (YE)
         */
        report_type?: string[];
        /**
         *
         * Requests for additional information (RFAIs) sent to filers. The request type is based on the type of document filed:
         *     - 1 Statement of Organization
         *     - 2 Report of Receipts and Expenditures (Form 3 and 3X)
         *     - 3 Second Notice - Reports
         *     - 4 Request for Additional Information
         *     - 5 Informational - Reports
         *     - 6 Second Notice - Statement of Organization
         *     - 7 Failure to File
         *     - 8 From Public Disclosure
         *     - 9 From Multi Candidate Status
         */
        request_type?: string[];
        /**
         *
         * The type of document for documents other than reports:
         *     - 2 24 Hour Contribution Notice
         *     - 4 48 Hour Contribution Notice
         *     - A Debt Settlement Statement
         *     - B Acknowledgment of Receipt of Debt Settlement Statement
         *     - C RFAI: Debt Settlement First Notice
         *     - D Commission Debt Settlement Review
         *     - E Commission Response TO Debt Settlement Request
         *     - F Administrative Termination
         *     - G Debt Settlement Plan Amendment
         *     - H Disavowal Notice
         *     - I Disavowal Response
         *     - J Conduit Report
         *     - K Termination Approval
         *     - L Repeat Non-Filer Notice
         *     - M Filing Frequency Change Notice
         *     - N Paper Amendment to Electronic Report
         *     - O Acknowledgment of Filing Frequency Change
         *     - S RFAI: Debt Settlement Second
         *     - T Miscellaneous Report TO FEC
         *     - V Repeat Violation Notice (441A OR 441B)
         *     - P Notice of Paper Filing
         *     - R F3L Filing Frequency Change Notice
         *     - Q Acknowledgment of F3L Filing Frequency Change
         *     - U Unregistered Committee Notice
         */
        document_type?: string[];
        /**
         *
         * Unique identifier for the electronic or paper report. This number is used to construct
         * PDF URLs to the original document.
         */
        beginning_image_number?: string[];
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        report_year?: number[];
        /**
         *
         * Selects all filings received after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Selects all filings received before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         * The form where the underlying data comes from, for example, Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         *     - FRQ  Request for Additional Information
         */
        form_type?: string[];
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /** Federal office candidate runs for: H, S or P */
        office?: ("" | "H" | "S" | "P")[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: string[];
        /** The method used to file with the FEC, either electronic or on paper. */
        filer_type?: "e-file" | "paper";
        /** Filing ID number */
        file_number?: number[];
        /**
         *
         * Primary, general or special election indicator.
         */
        primary_general_indicator?: string[];
        /**
         * Amendent types:
         *     -N   new
         *     -A   amendment
         *     -T   terminated
         *     -C   consolidated
         *     -M   multi-candidate
         *     -S   secondary
         *
         * NULL might be new or amendment. If amendment indicator is null and the filings is the first or first in a chain treat it as if it was a new. If it is not the first or first in a chain then treat the filing as an amendment.
         */
        amendment_indicator?: ("" | "N" | "A" | "T" | "C" | "M" | "S")[];
        /**
         *
         * The forms filed are categorized based on the nature of the filing:
         *     - REPORT F3, F3X, F3P, F3L, F4, F5, F7, F13
         *     - NOTICE F5, F24, F6, F9, F10, F11
         *     - STATEMENT F1, F2
         *     - OTHER F1M, F8, F99, F12, FRQ
         */
        form_category?: string[];
        /**
         *
         * Keyword search for filer name or ID
         */
        q_filer?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-receipt_date"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, FilingsPage>({
        path: `/v1/committee/${committeeId}/filings/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Explore a filer's characteristics over time. This can be particularly useful if the committees change treasurers, designation, or `committee_type`.
     *
     * @tags committee
     * @name CommitteeHistoryDetail
     * @request GET:/v1/committee/{committee_id}/history/
     * @secure
     */
    committeeHistoryDetail: (
      committeeId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        designation?: ("" | "A" | "J" | "P" | "U" | "B" | "D")[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-cycle"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeHistoryProfilePage>({
        path: `/v1/committee/${committeeId}/history/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Explore a filer's characteristics over time. This can be particularly useful if the committees change treasurers, designation, or `committee_type`.
     *
     * @tags committee
     * @name CommitteeHistoryDetail2
     * @request GET:/v1/committee/{committee_id}/history/{cycle}/
     * @originalName committeeHistoryDetail
     * @duplicate
     * @secure
     */
    committeeHistoryDetail2: (
      committeeId: string,
      cycle: number,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        designation?: ("" | "A" | "J" | "P" | "U" | "B" | "D")[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-cycle"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeHistoryProfilePage>({
        path: `/v1/committee/${committeeId}/history/${cycle}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Each report represents the summary information from Form 3, Form 3X and Form 3P. These reports have key statistics that illuminate the financial status of a given committee. Things like cash on hand, debts owed by committee, total receipts, and total disbursements are especially helpful for understanding a committee's financial dealings. By default, this endpoint includes both amended and final versions of each report. To restrict to only the final versions of each report, use `is_amended=false`; to retrieve only reports that have been amended, use `is_amended=true`. Several different reporting structures exist, depending on the type of organization that submits financial information. To see an example of these reporting requirements, look at the summary and detailed summary pages of Form 3, Form 3X, and Form 3P. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
     *
     * @tags financial
     * @name CommitteeReportsDetail
     * @request GET:/v1/committee/{committee_id}/reports/
     * @secure
     */
    committeeReportsDetail: (
      committeeId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        year?: number[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * Unique identifier for the electronic or paper report. This number is used to construct
         * PDF URLs to the original document.
         */
        beginning_image_number?: string[];
        /**
         * Report type; prefix with "-" to exclude. Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         */
        report_type?: string[];
        /**
         *
         * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
         */
        is_amended?: boolean;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_disbursements_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_disbursements_amount?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_receipts_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_receipts_amount?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_cash_on_hand_end_period_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_cash_on_hand_end_period_amount?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_debts_owed_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_debts_owed_expenditures?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_independent_expenditures?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_independent_expenditures?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_party_coordinated_expenditures?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_party_coordinated_expenditures?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_total_contributions?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_total_contributions?: number;
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        type?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-coverage_end_date"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeReportsPage>({
        path: `/v1/committee/${committeeId}/reports/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides information about a committee's Form 3, Form 3X, or Form 3P financial reports, which are aggregated by two-year period. We refer to two-year periods as a `cycle`. The cycle is named after the even-numbered year and includes the year before it. To obtain totals from 2013 and 2014, you would use 2014. In odd-numbered years, the current cycle is the next year — for example, in 2015, the current cycle is 2016. For presidential and Senate candidates, multiple two-year cycles exist between elections.
     *
     * @tags financial
     * @name CommitteeTotalsDetail
     * @request GET:/v1/committee/{committee_id}/totals/
     * @secure
     */
    committeeTotalsDetail: (
      committeeId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-cycle"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeTotalsPage>({
        path: `/v1/committee/${committeeId}/totals/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Fetch basic information about committees and filers. Use parameters to filter for particular characteristics.
     *
     * @tags committee
     * @name CommitteesList
     * @request GET:/v1/committees/
     * @secure
     */
    committeesList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** A year that the committee was active— (after original registration date     or filing but before expiration date) */
        year?: number[];
        /**
         *
         * A two year election cycle that the committee was active- (after original registration
         * date but before expiration date in Form 1s) The cycle begins with
         * an odd year and is named for its ending, even year.
         */
        cycle?: number[];
        /**
         * The one-letter
         *     code of the filing frequency:
         *          - A Administratively terminated
         *          - D Debt
         *          - M Monthly filer
         *          - Q Quarterly filer
         *          - T Terminated
         *          - W Waived
         */
        filing_frequency?: (
          | ""
          | "A"
          | "M"
          | "N"
          | "Q"
          | "T"
          | "W"
          | "-A"
          | "-T"
        )[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        designation?: ("" | "A" | "J" | "P" | "U" | "B" | "D")[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        organization_type?: ("" | "C" | "L" | "M" | "T" | "V" | "W")[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: (
          | ""
          | "C"
          | "D"
          | "E"
          | "H"
          | "I"
          | "N"
          | "O"
          | "P"
          | "Q"
          | "S"
          | "U"
          | "V"
          | "W"
          | "X"
          | "Y"
          | "Z"
        )[];
        /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
        q?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /** US state or territory */
        state?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: string[];
        /** Filter for committees whose first filing was received on or after this date. */
        min_first_file_date?: string;
        /** Filter for committees whose first filing was received on or before this date. */
        max_first_file_date?: string;
        /** Filter for committees whose last filing was received on or after this date. */
        min_last_file_date?: string;
        /** Filter for committees whose last filing was received on or before this date. */
        max_last_file_date?: string;
        /** Filter for committees whose first Form 1 was received on or after this date. */
        min_first_f1_date?: string;
        /** Filter for committees whose first Form 1 was received on or before this date. */
        max_first_f1_date?: string;
        /** Filter for committees whose latest Form 1 was received on or after this date. */
        min_last_f1_date?: string;
        /** Filter for committees whose latest Form 1 was received on or before this date. */
        max_last_f1_date?: string;
        /** Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown. */
        treasurer_name?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC. If a person runs for several offices, that person will have separate candidate IDs for each office. This is a filter for Leadership PAC sponsor.
         */
        sponsor_candidate_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "name"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteePage>({
        path: `/v1/committees/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 52 U.S.C. 30118 allows "communications by a corporation to its stockholders and executive or administrative personnel and their families or by a labor organization to its members and their families on any subject," including the express advocacy of the election or defeat of any Federal candidate.  The costs of such communications must be reported to the Federal Election Commission under certain circumstances.
     *
     * @tags communication cost
     * @name CommunicationCostsList
     * @request GET:/v1/communication_costs/
     * @secure
     */
    communicationCostsList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** Filter for all amounts greater than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /** Minimum date */
        min_date?: string;
        /** Maximum date */
        max_date?: string;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /** Support or opposition */
        support_oppose_indicator?: ("S" | "O")[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommunicationCostPage>({
        path: `/v1/communication_costs/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Communication cost aggregated by candidate ID and committee ID.
     *
     * @tags communication cost
     * @name CommunicationCostsAggregatesList
     * @request GET:/v1/communication_costs/aggregates/
     * @secure
     */
    communicationCostsAggregatesList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Support or opposition
         * @default null
         */
        support_oppose_indicator?: "S" | "O";
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CCAggregatesPage>({
        path: `/v1/communication_costs/aggregates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Communication cost aggregated by candidate ID and committee ID.
     *
     * @tags communication cost
     * @name CommunicationCostsByCandidateList
     * @request GET:/v1/communication_costs/by_candidate/
     * @secure
     */
    communicationCostsByCandidateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** US state or territory where a candidate runs for office */
        state?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: "house" | "senate" | "president";
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         * Support or opposition
         * @default null
         */
        support_oppose?: "S" | "O";
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommunicationCostByCandidatePage>({
        path: `/v1/communication_costs/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Total communications costs aggregated across committees on supported or opposed candidates by cycle or candidate election year.
     *
     * @tags communication cost
     * @name CommunicationCostsTotalsByCandidateList
     * @request GET:/v1/communication_costs/totals/by_candidate/
     * @secure
     */
    communicationCostsTotalsByCandidateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-cycle","candidate_id"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CCTotalsByCandidatePage>({
        path: `/v1/communication_costs/totals/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Basic information about electronic files coming into the FEC, posted as they are received.
     *
     * @tags efiling
     * @name EfileFilingsList
     * @request GET:/v1/efile/filings/
     * @secure
     */
    efileFilingsList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Filing ID number */
        file_number?: number[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * Selects all filings received after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Selects all filings received before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         *
         * Keyword search for filer name or ID
         */
        q_filer?: string[];
        /**
         * The form where the underlying data comes from, for example Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         * NOTE: This filter also works if you specify new, amended, or termination,
         * for example F3XN, F3XA, or F3XT respectively
         */
        form_type?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-receipt_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, EFilingsPage>({
        path: `/v1/efile/filings/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Basic information about electronic files coming into the FEC, posted as they are received.
     *
     * @tags efiling
     * @name EfileForm1List
     * @request GET:/v1/efile/form1/
     * @secure
     */
    efileForm1List: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Filing ID number */
        file_number?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * State or territory of the office sought.
         */
        election_state?: string[];
        /** Federal office candidate runs for: H, S or P */
        candidate_office?: ("" | "H" | "S" | "P")[];
        /**
         *
         * House district of the office sought, if applicable.
         */
        candidate_district?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        candidate_party?: string[];
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently. */
        min_load_timestamp?: string;
        /** Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently. */
        max_load_timestamp?: string;
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: string[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        organization_type?: ("" | "C" | "L" | "M" | "T" | "V" | "W")[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-load_timestamp"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, Form1Page>({
        path: `/v1/efile/form1/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Basic information about electronic files coming into the FEC, posted as they are received.
     *
     * @tags efiling
     * @name EfileForm2List
     * @request GET:/v1/efile/form2/
     * @secure
     */
    efileForm2List: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Filing ID number */
        file_number?: number[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * State or territory of the office sought.
         */
        election_state?: string[];
        /** Federal office candidate runs for: H, S or P */
        candidate_office?: ("" | "H" | "S" | "P")[];
        /**
         *
         * House district of the office sought, if applicable.
         */
        candidate_district?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        candidate_party?: string[];
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently. */
        min_load_timestamp?: string;
        /** Date the information was loaded into the FEC systems. This can be affected by reseting systems and other factors, refer to receipt_date for the day that the FEC received the paper or electronic document. Keep in mind that paper filings take more time to process and there can be a lag between load_date and receipt_date. This field can be helpful to identify paper records that have been processed recently. */
        max_load_timestamp?: string;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-load_timestamp"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, Form2Page>({
        path: `/v1/efile/form2/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Key financial data reported periodically by committees as they are reported. This feed includes summary information from the the House F3 reports, the presidential F3p reports and the PAC and party F3x reports. Generally, committees file reports on a quarterly or monthly basis, but some must also submit a report 12 days before primary elections. Therefore, during the primary season, the period covered by this file may be different for different committees. These totals also incorporate any changes made by committees, if any report covering the period is amended. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
     *
     * @tags efiling
     * @name EfileReportsHouseSenateList
     * @request GET:/v1/efile/reports/house-senate/
     * @secure
     */
    efileReportsHouseSenateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Filing ID number */
        file_number?: number[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * Selects all filings received after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Selects all filings received before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         *
         * Keyword search for filer name or ID
         */
        q_filer?: string[];
        /**
         * The form where the underlying data comes from, for example Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         * NOTE: This filter also works if you specify new, amended, or termination,
         * for example F3XN, F3XA, or F3XT respectively
         */
        form_type?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-receipt_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, BaseF3FilingPage>({
        path: `/v1/efile/reports/house-senate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Key financial data reported periodically by committees as they are reported. This feed includes summary information from the the House F3 reports, the presidential F3p reports and the PAC and party F3x reports. Generally, committees file reports on a quarterly or monthly basis, but some must also submit a report 12 days before primary elections. Therefore, during the primary season, the period covered by this file may be different for different committees. These totals also incorporate any changes made by committees, if any report covering the period is amended. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
     *
     * @tags efiling
     * @name EfileReportsPacPartyList
     * @request GET:/v1/efile/reports/pac-party/
     * @secure
     */
    efileReportsPacPartyList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Filing ID number */
        file_number?: number[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * Selects all filings received after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Selects all filings received before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         *
         * Keyword search for filer name or ID
         */
        q_filer?: string[];
        /**
         * The form where the underlying data comes from, for example Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         * NOTE: This filter also works if you specify new, amended, or termination,
         * for example F3XN, F3XA, or F3XT respectively
         */
        form_type?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-receipt_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, BaseF3XFilingPage>({
        path: `/v1/efile/reports/pac-party/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Key financial data reported periodically by committees as they are reported. This feed includes summary information from the the House F3 reports, the presidential F3p reports and the PAC and party F3x reports. Generally, committees file reports on a quarterly or monthly basis, but some must also submit a report 12 days before primary elections. Therefore, during the primary season, the period covered by this file may be different for different committees. These totals also incorporate any changes made by committees, if any report covering the period is amended. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
     *
     * @tags efiling
     * @name EfileReportsPresidentialList
     * @request GET:/v1/efile/reports/presidential/
     * @secure
     */
    efileReportsPresidentialList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Filing ID number */
        file_number?: number[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * Selects all filings received after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Selects all filings received before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         *
         * Keyword search for filer name or ID
         */
        q_filer?: string[];
        /**
         * The form where the underlying data comes from, for example Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         * NOTE: This filter also works if you specify new, amended, or termination,
         * for example F3XN, F3XA, or F3XT respectively
         */
        form_type?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-receipt_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, BaseF3PFilingPage>({
        path: `/v1/efile/reports/presidential/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description FEC election dates since 1995.
     *
     * @tags dates
     * @name ElectionDatesList
     * @request GET:/v1/election-dates/
     * @secure
     */
    electionDatesList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * State or territory of the office sought.
         */
        election_state?: string[];
        /**
         *
         * House district of the office sought, if applicable.
         */
        election_district?: string[];
        /**
         *
         * Party, if applicable.
         */
        election_party?: string[];
        /**
         *
         * House, Senate or presidential office.
         */
        office_sought?: ("H" | "S" | "P")[];
        /**
         *
         * The minimum date of election.
         */
        min_election_date?: string;
        /**
         *
         * The maximum date of election.
         */
        max_election_date?: string;
        /**
         *
         * Election type id
         */
        election_type_id?: string[];
        /**
         *
         * The minimum date this record was added to the system.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_create_date?: string;
        /**
         *
         * The maximum date this record was added to the system.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_create_date?: string;
        /**
         *
         * The minimum date this record was last updated.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_update_date?: string;
        /**
         *
         * The maximum date this record was last updated.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_update_date?: string;
        /** Year of election */
        election_year?: string[];
        /**
         *
         * The minimum date of primary or general election.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_primary_general_date?: string;
        /**
         *
         * The maximum date of primary or general election.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_primary_general_date?: string;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-election_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ElectionDatesPage>({
        path: `/v1/election-dates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description An electioneering communication is any broadcast, cable or satellite communication that fulfills each of the following conditions: _The communication refers to a clearly identified federal candidate._ _The communication is publicly distributed by a television station, radio station, cable television system or satellite system for a fee._ _The communication is distributed within 60 days prior to a general election or 30 days prior to a primary election to federal office._
     *
     * @tags electioneering
     * @name ElectioneeringList
     * @request GET:/v1/electioneering/
     * @secure
     */
    electioneeringList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        report_year?: number[];
        /** Filter for all amounts greater than a value */
        min_amount?: number;
        /** Filter for all amounts less than a value */
        max_amount?: number;
        /** Minimum disbursement date */
        min_date?: string;
        /** Maximum disbursement date */
        max_date?: string;
        /** Description of disbursement */
        disbursement_description?: string[];
        /**
         * Index of last result from previous page
         * @default null
         */
        last_index?: number | null;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ElectioneeringPage>({
        path: `/v1/electioneering/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Electioneering communications costs aggregates
     *
     * @tags electioneering
     * @name ElectioneeringAggregatesList
     * @request GET:/v1/electioneering/aggregates/
     * @secure
     */
    electioneeringAggregatesList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ECAggregatesPage>({
        path: `/v1/electioneering/aggregates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Electioneering costs aggregated by candidate
     *
     * @tags electioneering
     * @name ElectioneeringByCandidateList
     * @request GET:/v1/electioneering/by_candidate/
     * @secure
     */
    electioneeringByCandidateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** US state or territory where a candidate runs for office */
        state?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: "house" | "senate" | "president";
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ElectioneeringByCandidatePage>({
        path: `/v1/electioneering/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Total electioneering communications spent on candidates by cycle or candidate election year
     *
     * @tags electioneering
     * @name ElectioneeringTotalsByCandidateList
     * @request GET:/v1/electioneering/totals/by_candidate/
     * @secure
     */
    electioneeringTotalsByCandidateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-cycle","candidate_id"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ECTotalsByCandidatePage>({
        path: `/v1/electioneering/totals/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Look at the top-level financial information for all candidates running for the same office. Choose a 2-year cycle, and `house`, `senate` or `presidential`. If you are looking for a Senate seat, you will need to select the state using a two-letter abbreviation. House races require state and a two-digit district number. Since this endpoint reflects financial information, it will only have candidates once they file financial reporting forms. Query the `/candidates` endpoint to retrieve an-up-to-date list of all the candidates that filed to run for a particular seat.
     *
     * @tags financial
     * @name ElectionsList
     * @request GET:/v1/elections/
     * @secure
     */
    electionsList: (
      query: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** US state or territory where a candidate runs for office */
        state?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string;
        /**
         *
         * Two-year election cycle in which a candidate runs for office.
         * Calculated from Form 2. The cycle begins with
         * an odd year and is named for its ending, even year. This cycle follows
         * the traditional house election cycle and subdivides the presidential
         * and Senate elections into comparable two-year blocks. To retrieve data for
         * the entire four years of a presidential term or six years of a senatorial term,
         * you will need the `election_full` flag.
         */
        cycle: number;
        /** Federal office candidate runs for: H, S or P */
        office: "house" | "senate" | "president";
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-total_receipts"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ElectionPage>({
        path: `/v1/elections/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description List elections by cycle, office, state, and district.
     *
     * @tags financial
     * @name ElectionsSearchList
     * @request GET:/v1/elections/search/
     * @secure
     */
    electionsSearchList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /**
         *
         * Two-year election cycle in which a candidate runs for office.
         * Calculated from Form 2. The cycle begins with
         * an odd year and is named for its ending, even year. This cycle follows
         * the traditional house election cycle and subdivides the presidential
         * and Senate elections into comparable two-year blocks. To retrieve data for
         * the entire four years of a presidential term or six years of a senatorial term,
         * you will need the `election_full` flag.
         */
        cycle?: number[];
        /** Zip code */
        zip?: number[];
        office?: ("house" | "senate" | "president")[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["sort_order","district"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ElectionsListPage>({
        path: `/v1/elections/search/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description List elections by cycle, office, state, and district.
     *
     * @tags financial
     * @name ElectionsSummaryList
     * @request GET:/v1/elections/summary/
     * @secure
     */
    electionsSummaryList: (
      query: {
        /** US state or territory where a candidate runs for office */
        state?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string;
        /**
         *
         * Two-year election cycle in which a candidate runs for office.
         * Calculated from Form 2. The cycle begins with
         * an odd year and is named for its ending, even year. This cycle follows
         * the traditional house election cycle and subdivides the presidential
         * and Senate elections into comparable two-year blocks. To retrieve data for
         * the entire four years of a presidential term or six years of a senatorial term,
         * you will need the `election_full` flag.
         */
        cycle: number;
        /** Federal office candidate runs for: H, S or P */
        office: "house" | "senate" | "president";
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ElectionSummary>({
        path: `/v1/elections/summary/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description All official records and reports filed by or delivered to the FEC. Note: because the filings data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
     *
     * @tags filings
     * @name FilingsList
     * @request GET:/v1/filings/
     * @secure
     */
    filingsList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: string;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
         */
        is_amended?: boolean;
        /**
         *
         * Report is either new or is the most-recently filed amendment
         */
        most_recent?: boolean;
        /**
         * Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         *     - 90S Post Inaugural Supplement
         *     - 90D Post Inaugural
         *     - 48  48 Hour Notification
         *     - 24  24 Hour Notification
         *     - M7S July Monthly/Semi-Annual
         *     - MSA Monthly Semi-Annual (MY)
         *     - MYS Monthly Year End/Semi-Annual
         *     - Q2S July Quarterly/Semi-Annual
         *     - QSA Quarterly Semi-Annual (MY)
         *     - QYS Quarterly Year End/Semi-Annual
         *     - QYE Quarterly Semi-Annual (YE)
         *     - QMS Quarterly Mid-Year/ Semi-Annual
         *     - MSY Monthly Semi-Annual (YE)
         */
        report_type?: string[];
        /**
         *
         * Requests for additional information (RFAIs) sent to filers. The request type is based on the type of document filed:
         *     - 1 Statement of Organization
         *     - 2 Report of Receipts and Expenditures (Form 3 and 3X)
         *     - 3 Second Notice - Reports
         *     - 4 Request for Additional Information
         *     - 5 Informational - Reports
         *     - 6 Second Notice - Statement of Organization
         *     - 7 Failure to File
         *     - 8 From Public Disclosure
         *     - 9 From Multi Candidate Status
         */
        request_type?: string[];
        /**
         *
         * The type of document for documents other than reports:
         *     - 2 24 Hour Contribution Notice
         *     - 4 48 Hour Contribution Notice
         *     - A Debt Settlement Statement
         *     - B Acknowledgment of Receipt of Debt Settlement Statement
         *     - C RFAI: Debt Settlement First Notice
         *     - D Commission Debt Settlement Review
         *     - E Commission Response TO Debt Settlement Request
         *     - F Administrative Termination
         *     - G Debt Settlement Plan Amendment
         *     - H Disavowal Notice
         *     - I Disavowal Response
         *     - J Conduit Report
         *     - K Termination Approval
         *     - L Repeat Non-Filer Notice
         *     - M Filing Frequency Change Notice
         *     - N Paper Amendment to Electronic Report
         *     - O Acknowledgment of Filing Frequency Change
         *     - S RFAI: Debt Settlement Second
         *     - T Miscellaneous Report TO FEC
         *     - V Repeat Violation Notice (441A OR 441B)
         *     - P Notice of Paper Filing
         *     - R F3L Filing Frequency Change Notice
         *     - Q Acknowledgment of F3L Filing Frequency Change
         *     - U Unregistered Committee Notice
         */
        document_type?: string[];
        /**
         *
         * Unique identifier for the electronic or paper report. This number is used to construct
         * PDF URLs to the original document.
         */
        beginning_image_number?: string[];
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        report_year?: number[];
        /**
         *
         * Selects all filings received after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Selects all filings received before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         * The form where the underlying data comes from, for example, Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         *     - FRQ  Request for Additional Information
         */
        form_type?: string[];
        /** US state or territory where a candidate runs for office */
        state?: string[];
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string[];
        /** Federal office candidate runs for: H, S or P */
        office?: ("" | "H" | "S" | "P")[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        party?: string[];
        /** The method used to file with the FEC, either electronic or on paper. */
        filer_type?: "e-file" | "paper";
        /** Filing ID number */
        file_number?: number[];
        /**
         *
         * Primary, general or special election indicator.
         */
        primary_general_indicator?: string[];
        /**
         * Amendent types:
         *     -N   new
         *     -A   amendment
         *     -T   terminated
         *     -C   consolidated
         *     -M   multi-candidate
         *     -S   secondary
         *
         * NULL might be new or amendment. If amendment indicator is null and the filings is the first or first in a chain treat it as if it was a new. If it is not the first or first in a chain then treat the filing as an amendment.
         */
        amendment_indicator?: ("" | "N" | "A" | "T" | "C" | "M" | "S")[];
        /**
         *
         * The forms filed are categorized based on the nature of the filing:
         *     - REPORT F3, F3X, F3P, F3L, F4, F5, F7, F13
         *     - NOTICE F5, F24, F6, F9, F10, F11
         *     - STATEMENT F1, F2
         *     - OTHER F1M, F8, F99, F12, FRQ
         */
        form_category?: string[];
        /**
         *
         * Keyword search for filer name or ID
         */
        q_filer?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-receipt_date"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, FilingsPage>({
        path: `/v1/filings/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Search legal documents by document type, or across all document types using keywords, parameter values and ranges. This endpoint uses elasticsearch-dsl pagination.For pagination, use both `from_hit` and `hits_returned` parameters. `from_hit` defines the offset from the first result you want to fetch. `hits_returned` allows you to configure the maximum results to be returned. By default `from_hit` = 0 and `hits_returned` = 20, endpoint will return the first 20 documents (i.e. 0 to 19). if set `from_hit` = 20 and `hits_returned` = 20, endpoint will return documents range from 21 to 40 (i.e. 20 to 39). The maximum value of `hits_returned` is 200.
     *
     * @tags legal
     * @name LegalSearchList
     * @request GET:/v1/legal/search/
     * @secure
     */
    legalSearchList: (
      query?: {
        /**
         *
         * Text to search legal documents for
         */
        q?: string;
        /**
         *
         * Get results starting from this index
         */
        from_hit?: number;
        /**
         *
         * Number of results to return (max 10)
         */
        hits_returned?: number;
        /**
         *
         * Choose a legal document type
         */
        type?:
          | "admin_fines"
          | "adrs"
          | "advisory_opinions"
          | "murs"
          | "regulations"
          | "statutes";
        /**
         *
         * Force advisory opinion number
         */
        ao_no?: string[];
        /**
         *
         * Force advisory opinion name
         */
        ao_name?: string[];
        /**
         *
         * Earliest issue date of advisory opinion
         */
        ao_min_issue_date?: string;
        /**
         *
         * Latest issue date of advisory opinion
         */
        ao_max_issue_date?: string;
        /**
         *
         * Earliest request date of advisory opinion
         */
        ao_min_request_date?: string;
        /**
         *
         * Latest request date of advisory opinion
         */
        ao_max_request_date?: string;
        /**
         *
         * Category of the document
         */
        ao_category?: ("F" | "V" | "D" | "R" | "W" | "C" | "S")[];
        /**
         *
         * AO is pending
         */
        ao_is_pending?: boolean;
        /**
         *
         * Status of AO (pending, withdrawn, or final)
         */
        ao_status?: string;
        /**
         *
         * The requestor of the advisory opinion
         */
        ao_requestor?: string;
        /**
         *
         * Code of the advisory opinion requestor type.
         */
        ao_requestor_type?: (
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | 7
          | 8
          | 9
          | 10
          | 11
          | 12
          | 13
          | 14
          | 15
          | 16
        )[];
        /**
         *
         * Regulatory citations
         */
        ao_regulatory_citation?: string[];
        /**
         *
         * Statutory citations
         */
        ao_statutory_citation?: string[];
        /**
         *
         * Require all citations to be in document (default behavior is any)
         */
        ao_citation_require_all?: boolean;
        /**
         *
         * Name of commenter or representative
         */
        ao_entity_name?: string[];
        /**
         *
         * Enforcement matter case number
         */
        case_no?: string[];
        /**
         *
         * Cases respondents
         */
        case_respondents?: string;
        /**
         *
         * Cases dispositions
         */
        case_dispositions?: string[];
        /**
         *
         * Cases election cycles
         */
        case_election_cycles?: number;
        /**
         *
         * The earliest date opened of case
         */
        case_min_open_date?: string;
        /**
         *
         * The latest date opened of case
         */
        case_max_open_date?: string;
        /**
         *
         * The earliest date closed of case
         */
        case_min_close_date?: string;
        /**
         *
         * The latest date closed of case
         */
        case_max_close_date?: string;
        /**
         *
         * Regulatory citations
         */
        case_regulatory_citation?: string[];
        /**
         *
         * Statutory citations
         */
        case_statutory_citation?: string[];
        /**
         *
         * Require all citations to be in document (default behavior is any)
         */
        case_citation_require_all?: boolean;
        /**
         *
         * Select one or more case_doc_category_id to filter by corresponding CASE_DOCUMENT_CATEGORY:
         *         - 1 - Conciliation and Settlement Agreements
         *         - 2 - Complaint, Responses, Designation of Counsel and Extensions of Time
         *         - 3 - General Counsel Reports, Briefs, Notifications and Responses
         *         - 4 - Certifications
         *         - 5 - Civil Penalties, Disgorgements, Other Payments and Letters of Compliance
         *         - 6 - Statement of Reasons
         *         - 1001 - ADR Settlement Agreements
         *         - 1002 - Complaint, Responses, Designation of Counsel and Extensions of Time
         *         - 1003 - ADR Memoranda, Notifications and Responses
         *         - 1004 - Certifications
         *         - 1005 - Civil Penalties, Disgorgements, Other Payments and Letters of Compliance
         *         - 1006 - Statement of Reasons
         *         - 2001 - Administrative Fine Case
         */
        case_doc_category_id?: (
          | "1"
          | "2"
          | "3"
          | "4"
          | "5"
          | "6"
          | "1001"
          | "1002"
          | "1003"
          | "1004"
          | "1005"
          | "1006"
          | "2001"
        )[];
        /**
         *
         * Type of MUR : current or archived
         */
        mur_type?: "archived" | "current";
        /**
         *
         * Admin fine committee name
         */
        af_name?: string[];
        /**
         *
         * Admin fine committee ID
         */
        af_committee_id?: string;
        /**
         *
         * Admin fine report year
         */
        af_report_year?: string;
        /**
         *
         * The earliest Reason to Believe date
         */
        af_min_rtb_date?: string;
        /**
         *
         * The latest Reason to Believe date
         */
        af_max_rtb_date?: string;
        /**
         *
         * Reason to Believe fine amount
         */
        af_rtb_fine_amount?: number;
        /**
         *
         * The earliest Final Determination date
         */
        af_min_fd_date?: string;
        /**
         *
         * The latest Final Determination date
         */
        af_max_fd_date?: string;
        /**
         *
         * Final Determination fine amount
         */
        af_fd_fine_amount?: number;
        /**
         *
         * Provide a field to sort by. Use `-` for descending order. ex: `-case_no`
         */
        sort?: string;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          admin_fines?: {
            challenge_outcome?: string;
            /** @format date */
            challenge_receipt_date?: string;
            check_amount?: number;
            commission_votes?: {
              action?: string;
              /** @format date */
              vote_date?: string;
            }[];
            committee_id?: string;
            doc_id?: string;
            document_highlights?: object;
            documents?: {
              category?: string;
              description?: string;
              /** @format date */
              document_date?: string;
              document_id?: number;
              length?: number;
              url?: string;
            }[];
            final_determination_amount?: number;
            /** @format date */
            final_determination_date?: string;
            highlights?: string[];
            name?: string;
            no?: string;
            /** @format date */
            petition_court_decision_date?: string;
            /** @format date */
            petition_court_filing_date?: string;
            /** @format date */
            reason_to_believe_action_date?: string;
            reason_to_believe_fine_amount?: number;
            report_type?: string;
            report_year?: string;
            treasury_referral_amount?: number;
            /** @format date */
            treasury_referral_date?: string;
            url?: string;
          }[];
          adrs?: {
            /** @format date */
            close_date?: string;
            commission_votes?: {
              action?: string;
              /** @format date */
              vote_date?: string;
            }[];
            dispositions?: {
              citations?: {
                text?: string;
                title?: string;
                type?: string;
                url?: string;
              }[];
              disposition?: string;
              penalty?: number;
              respondent?: string;
            }[];
            doc_id?: string;
            document_highlights?: object;
            documents?: {
              category?: string;
              description?: string;
              /** @format date */
              document_date?: string;
              document_id?: number;
              length?: number;
              url?: string;
            }[];
            election_cycles?: number;
            highlights?: string[];
            name?: string;
            no?: string;
            /** @format date */
            open_date?: string;
            participants?: {
              citations?: object;
              name?: string;
              role?: string;
            }[];
            respondents?: string[];
            subjects?: string[];
            url?: string;
          }[];
          advisory_opinions?: {
            ao_citations?: {
              name?: string;
              no?: string;
            }[];
            aos_cited_by?: {
              name?: string;
              no?: string;
            }[];
            commenter_names?: string[];
            document_highlights?: object;
            documents?: {
              category?: string;
              /** @format date */
              date?: string;
              description?: string;
              document_id?: number;
              url?: string;
            }[];
            entities?: {
              name?: string;
              role?: string;
              type?: string;
            }[];
            highlights?: string[];
            is_pending?: boolean;
            /** @format date */
            issue_date?: string;
            name?: string;
            no?: string;
            regulatory_citations?: {
              part?: number;
              section?: number;
              title?: number;
            }[];
            representative_names?: string[];
            /** @format date */
            request_date?: string;
            requestor_names?: string[];
            requestor_types?: string[];
            status?: string;
            statutory_citations?: {
              section?: string;
              title?: number;
            }[];
            summary?: string;
          }[];
          murs?: {
            /** @format date */
            close_date?: string;
            commission_votes?: {
              action?: string;
              /** @format date */
              vote_date?: string;
            }[];
            dispositions?: {
              citations?: {
                text?: string;
                title?: string;
                type?: string;
                url?: string;
              }[];
              disposition?: string;
              penalty?: number;
              respondent?: string;
            }[];
            doc_id?: string;
            document_highlights?: object;
            documents?: {
              category?: string;
              description?: string;
              /** @format date */
              document_date?: string;
              document_id?: number;
              length?: number;
              url?: string;
            }[];
            election_cycles?: number;
            highlights?: string[];
            mur_type?: "current" | "archived";
            name?: string;
            no?: string;
            /** @format date */
            open_date?: string;
            participants?: {
              citations?: object;
              name?: string;
              role?: string;
            }[];
            respondents?: string[];
            subjects?: string[];
            url?: string;
          }[];
          regulations?: {
            doc_id?: string;
            document_highlights?: object;
            highlights?: string[];
            name?: string;
            no?: string;
            url?: string;
          }[];
          statutes?: {
            chapter?: string;
            doc_id?: string;
            document_highlights?: object;
            highlights?: string[];
            name?: string;
            no?: string;
            title?: string;
            url?: string;
          }[];
          /** Total number of Admin Fines matching the search criteria */
          total_admin_fines?: number;
          /** Total number of ADRs matching the search criteria */
          total_adrs?: number;
          /** Total number of Advisory Opinions matching the search criteria */
          total_advisory_opinions?: number;
          /** Total number of legal documents matching the search criteria */
          total_all?: number;
          /** Total number of MURs matching the search criteria */
          total_murs?: number;
          /** Total number of Regulations matching the search criteria */
          total_regulations?: number;
          /** Total number of Statutes matching the search criteria */
          total_statutes?: number;
        }
      >({
        path: `/v1/legal/search/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Search for candidates or committees by name. If you're looking for information on a particular person or group, using a name to find the `candidate_id` or `committee_id` on this endpoint can be a helpful first step.
     *
     * @tags audit
     * @name NamesAuditCandidatesList
     * @request GET:/v1/names/audit_candidates/
     * @secure
     */
    namesAuditCandidatesList: (
      query: {
        /** Name (candidate or committee) to search for */
        q: string[];
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, AuditCandidateSearchList>({
        path: `/v1/names/audit_candidates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Search for candidates or committees by name. If you're looking for information on a particular person or group, using a name to find the `candidate_id` or `committee_id` on this endpoint can be a helpful first step.
     *
     * @tags audit
     * @name NamesAuditCommitteesList
     * @request GET:/v1/names/audit_committees/
     * @secure
     */
    namesAuditCommitteesList: (
      query: {
        /** Name (candidate or committee) to search for */
        q: string[];
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, AuditCommitteeSearchList>({
        path: `/v1/names/audit_committees/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Search for candidates or committees by name. If you're looking for information on a particular person or group, using a name to find the `candidate_id` or `committee_id` on this endpoint can be a helpful first step.
     *
     * @tags search
     * @name NamesCandidatesList
     * @request GET:/v1/names/candidates/
     * @secure
     */
    namesCandidatesList: (
      query: {
        /** Name (candidate or committee) to search for */
        q: string[];
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CandidateSearchListSchema>({
        path: `/v1/names/candidates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Search for candidates or committees by name. If you're looking for information on a particular person or group, using a name to find the `candidate_id` or `committee_id` on this endpoint can be a helpful first step.
     *
     * @tags search
     * @name NamesCommitteesList
     * @request GET:/v1/names/committees/
     * @secure
     */
    namesCommitteesList: (
      query: {
        /** Name (candidate or committee) to search for */
        q: string[];
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeSearchList>({
        path: `/v1/names/committees/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description The Operations log contains details of each report loaded into the database. It is primarily used as status check to determine when all of the data processes, from initial entry through review are complete.
     *
     * @tags filings
     * @name OperationsLogList
     * @request GET:/v1/operations-log/
     * @secure
     */
    operationsLogList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier of the registered filer.
         */
        candidate_committee_id?: string[];
        /**
         * Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         *     - 90S Post Inaugural Supplement
         *     - 90D Post Inaugural
         *     - 48  48 Hour Notification
         *     - 24  24 Hour Notification
         *     - M7S July Monthly/Semi-Annual
         *     - MSA Monthly Semi-Annual (MY)
         *     - MYS Monthly Year End/Semi-Annual
         *     - Q2S July Quarterly/Semi-Annual
         *     - QSA Quarterly Semi-Annual (MY)
         *     - QYS Quarterly Year End/Semi-Annual
         *     - QYE Quarterly Semi-Annual (YE)
         *     - QMS Quarterly Mid-Year/ Semi-Annual
         *     - MSY Monthly Semi-Annual (YE)
         */
        report_type?: string[];
        /**
         *
         * Unique identifier for the electronic or paper report. This number is used to construct
         * PDF URLs to the original document.
         */
        beginning_image_number?: string[];
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        report_year?: number[];
        /**
         * The form where the underlying data comes from, for example, Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         *     - FRQ  Request for Additional Information
         */
        form_type?: string[];
        /**
         * Amendent types:
         *     -N   new
         *     -A   amendment
         *     -T   terminated
         *     -C   consolidated
         *     -M   multi-candidate
         *     -S   secondary
         *
         * NULL might be new or amendment. If amendment indicator is null and the filings is the first or first in a chain treat it as if it was a new. If it is not the first or first in a chain then treat the filing as an amendment.
         */
        amendment_indicator?: string[];
        /**
         *
         * Status of the transactional report.
         *     -0- Transaction is entered
         *           into the system.
         *           But not verified.
         *     -1- Transaction is verified.
         */
        status_num?: ("0" | "1")[];
        /**
         *
         * Selects all filings received after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Selects all filings received before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         *
         * Ending date of the reporting period after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_coverage_end_date?: string;
        /**
         *
         * Ending date of the reporting period before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_coverage_end_date?: string;
        /**
         *
         * Select all filings processed completely after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_transaction_data_complete_date?: string;
        /**
         *
         * Select all filings processed completely before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_transaction_data_complete_date?: string;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-report_year"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, OperationsLogPage>({
        path: `/v1/operations-log/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Net receipts per candidate. Filter with `contributor_state='US'` for national totals
     *
     * @tags presidential
     * @name PresidentialContributionsByCandidateList
     * @request GET:/v1/presidential/contributions/by_candidate/
     * @secure
     */
    presidentialContributionsByCandidateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Year of election */
        election_year?: number[];
        /** State of contributor */
        contributor_state?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-net_receipts"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, PresidentialByCandidatePage>({
        path: `/v1/presidential/contributions/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Contribution receipts by size per candidate. Filter by candidate_id, election_year and/or size
     *
     * @tags presidential
     * @name PresidentialContributionsBySizeList
     * @request GET:/v1/presidential/contributions/by_size/
     * @secure
     */
    presidentialContributionsBySizeList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Year of election */
        election_year?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         *   -P00000001    All candidates
         *   -P00000002    Democrasts
         *   -P00000003    Republicans
         */
        candidate_id?: string[];
        /**
         *
         * The total all contributions in the following ranges:
         * ```
         *   -0    $200 and under
         *   -200  $200.01 - $499.99
         *   -500  $500 - $999.99
         *   -1000 $1000 - $1999.99
         *   -2000 $2000 +
         * ```
         * Unitemized contributions are included in the `0` category.
         */
        size?: (0 | 200 | 500 | 1000 | 2000)[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "size"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, PresidentialBySizePage>({
        path: `/v1/presidential/contributions/by_size/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Contribution receipts by state per candidate. Filter by candidate_id and/or election_year
     *
     * @tags presidential
     * @name PresidentialContributionsByStateList
     * @request GET:/v1/presidential/contributions/by_state/
     * @secure
     */
    presidentialContributionsByStateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Year of election */
        election_year?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         *   -P00000001    All candidates
         *   -P00000002    Democrasts
         *   -P00000003    Republicans
         */
        candidate_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-contribution_receipt_amount"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, PresidentialByStatePage>({
        path: `/v1/presidential/contributions/by_state/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Coverage end date per candidate. Filter by candidate_id and/or election_year
     *
     * @tags presidential
     * @name PresidentialCoverageEndDateList
     * @request GET:/v1/presidential/coverage_end_date/
     * @secure
     */
    presidentialCoverageEndDateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Year of election */
        election_year?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         *   -P00000001    All candidates
         *   -P00000002    Democrasts
         *   -P00000003    Republicans
         */
        candidate_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "candidate_id"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, PresidentialCoveragePage>({
        path: `/v1/presidential/coverage_end_date/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Financial summary per candidate. Filter by candidate_id and/or election_year
     *
     * @tags presidential
     * @name PresidentialFinancialSummaryList
     * @request GET:/v1/presidential/financial_summary/
     * @secure
     */
    presidentialFinancialSummaryList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** Year of election */
        election_year?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         *   -P00000001    All candidates
         *   -P00000002    Democrasts
         *   -P00000003    Republicans
         */
        candidate_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-net_receipts"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, PresidentialSummaryPage>({
        path: `/v1/presidential/financial_summary/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Use this endpoint to look up the RAD Analyst for a committee. The mission of the Reports Analysis Division (RAD) is to ensure that campaigns and political committees file timely and accurate reports that fully disclose their financial activities.  RAD is responsible for reviewing statements and financial reports filed by political committees participating in federal elections, providing assistance and guidance to the committees to properly file their reports, and for taking appropriate action to ensure compliance with the Federal Election Campaign Act (FECA).
     *
     * @tags filer resources
     * @name RadAnalystList
     * @request GET:/v1/rad-analyst/
     * @secure
     */
    radAnalystList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** ID of RAD analyst */
        analyst_id?: number[];
        /** Short ID of RAD analyst */
        analyst_short_id?: number[];
        /** Telephone extension of RAD analyst */
        telephone_ext?: number[];
        /** Name of RAD analyst */
        name?: string[];
        /** Email of RAD analyst */
        email?: string[];
        /** Title of RAD analyst */
        title?: string[];
        /** Filter results for assignment updates made after this date */
        min_assignment_update_date?: string;
        /** Filter results for assignment updates made before this date */
        max_assignment_update_date?: string;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RadAnalystPage>({
        path: `/v1/rad-analyst/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description FEC election dates since 1995.
     *
     * @tags dates
     * @name ReportingDatesList
     * @request GET:/v1/reporting-dates/
     * @secure
     */
    reportingDatesList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * The minimum date the report is due.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_due_date?: string;
        /**
         *
         * The maximum date the report is due.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_due_date?: string;
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        report_year?: number[];
        /**
         * Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         *     - 90S Post Inaugural Supplement
         *     - 90D Post Inaugural
         *     - 48  48 Hour Notification
         *     - 24  24 Hour Notification
         *     - M7S July Monthly/Semi-Annual
         *     - MSA Monthly Semi-Annual (MY)
         *     - MYS Monthly Year End/Semi-Annual
         *     - Q2S July Quarterly/Semi-Annual
         *     - QSA Quarterly Semi-Annual (MY)
         *     - QYS Quarterly Year End/Semi-Annual
         *     - QYE Quarterly Semi-Annual (YE)
         *     - QMS Quarterly Mid-Year/ Semi-Annual
         *     - MSY Monthly Semi-Annual (YE)
         */
        report_type?: string[];
        /**
         *
         * The minimum date this record was added to the system.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_create_date?: string;
        /**
         *
         * The maximum date this record was added to the system.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_create_date?: string;
        /**
         *
         * The minimum date this record was last updated.(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_update_date?: string;
        /**
         *
         * The maximum date this record was last updated.(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_update_date?: string;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-due_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ReportingDatesPage>({
        path: `/v1/reporting-dates/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Each report represents the summary information from Form 3, Form 3X and Form 3P. These reports have key statistics that illuminate the financial status of a given committee. Things like cash on hand, debts owed by committee, total receipts, and total disbursements are especially helpful for understanding a committee's financial dealings. By default, this endpoint includes both amended and final versions of each report. To restrict to only the final versions of each report, use `is_amended=false`; to retrieve only reports that have been amended, use `is_amended=true`. Several different reporting structures exist, depending on the type of organization that submits financial information. To see an example of these reporting requirements, look at the summary and detailed summary pages of Form 3, Form 3X, and Form 3P. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
     *
     * @tags financial
     * @name ReportsDetail
     * @request GET:/v1/reports/{entity_type}/
     * @secure
     */
    reportsDetail: (
      entityType: "presidential" | "pac-party" | "house-senate" | "ie-only",
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        year?: number[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * Unique identifier for the electronic or paper report. This number is used to construct
         * PDF URLs to the original document.
         */
        beginning_image_number?: string[];
        /**
         * Report type; prefix with "-" to exclude. Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         */
        report_type?: string[];
        /**
         *
         * False indicates that a report is the most recent. True indicates that the report has been superseded by an amendment.
         */
        is_amended?: boolean;
        /**
         *
         * Report is either new or is the most-recently filed amendment
         */
        most_recent?: boolean;
        /** The method used to file with the FEC, either electronic or on paper. */
        filer_type?: "e-file" | "paper";
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_disbursements_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_disbursements_amount?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_receipts_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_receipts_amount?: number;
        /**
         *
         * Selects all items received by FEC before this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        max_receipt_date?: string;
        /**
         *
         * Selects all items received by FEC after this date(MM/DD/YYYY or YYYY-MM-DD)
         */
        min_receipt_date?: string;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_cash_on_hand_end_period_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_cash_on_hand_end_period_amount?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_debts_owed_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_debts_owed_expenditures?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_independent_expenditures?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_independent_expenditures?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_party_coordinated_expenditures?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_party_coordinated_expenditures?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_total_contributions?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_total_contributions?: number;
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Amendent types:
         *     -N   new
         *     -A   amendment
         *     -T   terminated
         *     -C   consolidated
         *     -M   multi-candidate
         *     -S   secondary
         *
         * NULL might be new or amendment. If amendment indicator is null and the filings is the first or first in a chain treat it as if it was a new. If it is not the first or first in a chain then treat the filing as an amendment.
         */
        amendment_indicator?: ("" | "N" | "A" | "T" | "C" | "M" | "S")[];
        /**
         *
         * Keyword search for filer name or ID
         */
        q_filer?: string[];
        /**
         *
         * Keyword search for spender name or ID
         */
        q_spender?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-coverage_end_date"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeReportsPage>({
        path: `/v1/reports/${entityType}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This description is for both ​`/schedules​/schedule_a​/` and ​ `/schedules​/schedule_a​/{sub_id}​/`. This endpoint provides itemized receipts. Schedule A records describe itemized receipts, including contributions from individuals. If you are interested in contributions from an individual, use the `/schedules/schedule_a/` endpoint. For a more complete description of all Schedule A records visit [About receipts data](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/about-receipts-data/). If you are interested in our "is_individual" methodology visit our [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology/). ​The `/schedules​/schedule_a​/` endpoint is not paginated by page number. This endpoint uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. To request the next page, you should append the values found in the `last_indexes` object from pagination to the URL of your last request as additional parameters. For example, when sorting by `contribution_receipt_date`, you might receive a page of results with the two scenarios of following pagination information: case #1: ``` pagination: { pages: 2152643, per_page: 20, is_count_exact: False, count: 43052850, last_indexes: { last_index: "230880619", last_contribution_receipt_date: "2014-01-01" } } ``` <br/> case #2 (results which include contribution_receipt_date = NULL): ``` pagination: { pages: 2152644, per_page: 20, count: 43052850, is_count_exact: False, last_indexes: { last_index: "230880639", sort_null_only: True } } ``` To fetch the next page of sorted results, append `last_index=230880619` and `last_contribution_receipt_date=2014-01-01` to the URL and when reaching `contribution_receipt_date=NULL`, append `last_index=230880639` and `sort_null_only=True`. We strongly advise paging through these results using sort indices. The default sort is acending by `contribution_receipt_date` (`deprecated`, will be descending). If you do not page using sort indices, some transactions may be unintentionally filtered out. Calls to ​`/schedules​/schedule_a​/` may return many records. For large result sets, the record counts found in the pagination object are approximate; you will need to page through the records until no records are returned. To avoid throwing the "out of range" exception on the last page, one recommandation is to use total count and `per_page` to control the traverse loop of results. ​The `/schedules​/schedule_a​/{sub_id}​/` endpoint returns a single transaction, but it does include a pagination object class. Please ignore the information in that object class.
     *
     * @tags receipts
     * @name SchedulesScheduleAList
     * @request GET:/v1/schedules/schedule_a/
     * @secure
     */
    schedulesScheduleAList: (
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** Filter for all amounts greater than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /** Minimum date */
        min_date?: string;
        /** Maximum date */
        max_date?: string;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** The FEC identifier should be represented here if the contributor is registered with the FEC. */
        contributor_id?: string[];
        /** Name of contributor */
        contributor_name?: string[];
        /** City of contributor */
        contributor_city?: string[];
        /** State of contributor */
        contributor_state?: string[];
        /** Zip code of contributor */
        contributor_zip?: string[];
        /** Employer of contributor, filers need to make an effort to gather this information */
        contributor_employer?: string[];
        /** Occupation of contributor, filers need to make an effort to gather this information */
        contributor_occupation?: string[];
        /**
         * When sorting by `contribution_receipt_date`, this is populated with the         `contribution_receipt_date` of the last result. However, you will need to pass the index         of that last result to `last_index` to get the next page.
         * @default null
         */
        last_contribution_receipt_date?: string | null;
        /**
         * When sorting by `contribution_receipt_amount`, this is populated with the         `contribution_receipt_amount` of the last result. However, you will need to pass the index         of that last result to `last_index` to get the next page.
         * @default null
         */
        last_contribution_receipt_amount?: number | null;
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        line_number?: string;
        /**
         * Restrict to non-earmarked individual contributions where memo code is true. Filtering individuals is useful to make sure contributions are not double reported and in creating breakdowns of the amount of money coming from individuals.
         * @default null
         */
        is_individual?: boolean | null;
        /** Filters individual or committee contributions based on line number */
        contributor_type?: ("individual" | "committee")[];
        /**
         *
         * This is a two-year period that is derived from the year a transaction took place in the
         * Itemized Schedule A and Schedule B tables. In cases where we have the date of the transaction
         * (contribution_receipt_date in schedules/schedule_a, disbursement_date in schedules/schedule_b)
         * the two_year_transaction_period is named after the ending, even-numbered year. If we do not
         * have the date  of the transaction, we fall back to using the report year (report_year in both
         * tables) instead,  making the same cycle adjustment as necessary. If no transaction year is
         * specified, the results default to the most current cycle.
         */
        two_year_transaction_period?: number[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        recipient_committee_type?: (
          | ""
          | "C"
          | "D"
          | "E"
          | "H"
          | "I"
          | "N"
          | "O"
          | "P"
          | "Q"
          | "S"
          | "U"
          | "V"
          | "W"
          | "X"
          | "Y"
          | "Z"
        )[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        recipient_committee_org_type?: (
          | ""
          | "C"
          | "L"
          | "M"
          | "T"
          | "V"
          | "W"
        )[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        recipient_committee_designation?: (
          | ""
          | "A"
          | "J"
          | "P"
          | "U"
          | "B"
          | "D"
        )[];
        /** Minimum load date */
        min_load_date?: string;
        /** Maximum load date */
        max_load_date?: string;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Index of last result from previous page
         * @default null
         */
        last_index?: number | null;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-contribution_receipt_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAPage>({
        path: `/v1/schedules/schedule_a/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides itemized individual contributions received by a committee, aggregated by the contributor’s employer name. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
     *
     * @tags receipts
     * @name SchedulesScheduleAByEmployerList
     * @request GET:/v1/schedules/schedule_a/by_employer/
     * @secure
     */
    schedulesScheduleAByEmployerList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Employer of contributor as reported on the committee's filing */
        employer?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAByEmployerPage>({
        path: `/v1/schedules/schedule_a/by_employer/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides itemized individual contributions received by a committee, aggregated by the contributor’s occupation. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
     *
     * @tags receipts
     * @name SchedulesScheduleAByOccupationList
     * @request GET:/v1/schedules/schedule_a/by_occupation/
     * @secure
     */
    schedulesScheduleAByOccupationList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Occupation of contributor as reported on the committee's filing */
        occupation?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAByOccupationPage>({
        path: `/v1/schedules/schedule_a/by_occupation/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides individual contributions received by a committee, aggregated by size: ``` - $200 and under - $200.01 - $499.99 - $500 - $999.99 - $1000 - $1999.99 - $2000 + ``` The $200.00 and under category includes contributions of $200 or less combined with unitemized individual contributions.
     *
     * @tags receipts
     * @name SchedulesScheduleABySizeList
     * @request GET:/v1/schedules/schedule_a/by_size/
     * @secure
     */
    schedulesScheduleABySizeList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * The total all contributions in the following ranges:
         * ```
         *   -0    $200 and under
         *   -200  $200.01 - $499.99
         *   -500  $500 - $999.99
         *   -1000 $1000 - $1999.99
         *   -2000 $2000 +
         * ```
         * Unitemized contributions are included in the `0` category.
         */
        size?: (0 | 200 | 500 | 1000 | 2000)[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleABySizePage>({
        path: `/v1/schedules/schedule_a/by_size/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides itemized individual contributions received by a committee, aggregated by size of contribution and candidate. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
     *
     * @tags receipts
     * @name SchedulesScheduleABySizeByCandidateList
     * @request GET:/v1/schedules/schedule_a/by_size/by_candidate/
     * @secure
     */
    schedulesScheduleABySizeByCandidateList: (
      query: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id: string[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle: number[];
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["size"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleABySizeCandidatePage>({
        path: `/v1/schedules/schedule_a/by_size/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides itemized individual contributions received by a committee, aggregated by the contributor’s state. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
     *
     * @tags receipts
     * @name SchedulesScheduleAByStateList
     * @request GET:/v1/schedules/schedule_a/by_state/
     * @secure
     */
    schedulesScheduleAByStateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** State of contributor */
        state?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Exclude values with missing state
         * @default false
         */
        hide_null?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-total"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAByStatePage>({
        path: `/v1/schedules/schedule_a/by_state/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides itemized individual contributions received by a committee, aggregated by contributor’s state and candidate. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
     *
     * @tags receipts
     * @name SchedulesScheduleAByStateByCandidateList
     * @request GET:/v1/schedules/schedule_a/by_state/by_candidate/
     * @secure
     */
    schedulesScheduleAByStateByCandidateList: (
      query: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id: string[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle: number[];
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["state"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAByStateCandidatePage>({
        path: `/v1/schedules/schedule_a/by_state/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Itemized individual contributions aggregated by contributor’s state, candidate, committee type and cycle. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
     *
     * @tags receipts
     * @name SchedulesScheduleAByStateByCandidateTotalsList
     * @request GET:/v1/schedules/schedule_a/by_state/by_candidate/totals/
     * @secure
     */
    schedulesScheduleAByStateByCandidateTotalsList: (
      query: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id: string[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle: number[];
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["total"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAByStateCandidatePage>({
        path: `/v1/schedules/schedule_a/by_state/by_candidate/totals/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides itemized individual contributions received by a committee, aggregated by contributor’s state, committee type and cycle. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
     *
     * @tags receipts
     * @name SchedulesScheduleAByStateTotalsList
     * @request GET:/v1/schedules/schedule_a/by_state/totals/
     * @secure
     */
    schedulesScheduleAByStateTotalsList: (
      query?: {
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** US state or territory */
        state?: string[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         *         - all All Committee Types
         *         - all_candidates All Candidate Committee Types (H, S, P)
         *         - all_pacs All PAC Committee Types (N, O, Q, V, W)
         */
        committee_type?: string[];
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "cycle"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAByStateRecipientTotalsPage>({
        path: `/v1/schedules/schedule_a/by_state/totals/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides itemized individual contributions received by a committee, aggregated by the contributor’s ZIP code. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
     *
     * @tags receipts
     * @name SchedulesScheduleAByZipList
     * @request GET:/v1/schedules/schedule_a/by_zip/
     * @secure
     */
    schedulesScheduleAByZipList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Zip code of contributor */
        zip?: string[];
        /** State of contributor */
        state?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAByZipPage>({
        path: `/v1/schedules/schedule_a/by_zip/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Efiling endpoints provide real-time campaign finance data received from electronic filers. Efiling endpoints only contain the most recent four months of data and don't contain the processed and coded data that you can find on other endpoints.
     *
     * @tags receipts
     * @name SchedulesScheduleAEfileList
     * @request GET:/v1/schedules/schedule_a/efile/
     * @secure
     */
    schedulesScheduleAEfileList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** Name of contributor */
        contributor_name?: string[];
        /** City of contributor */
        contributor_city?: string[];
        /** State of contributor */
        contributor_state?: string[];
        /** Employer of contributor, filers need to make an effort to gather this information */
        contributor_employer?: string[];
        /** Occupation of contributor, filers need to make an effort to gather this information */
        contributor_occupation?: string[];
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** Filter for all amounts greater than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /** Minimum date */
        min_date?: string;
        /** Maximum date */
        max_date?: string;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-contribution_receipt_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAEfilePage>({
        path: `/v1/schedules/schedule_a/efile/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This description is for both ​`/schedules​/schedule_a​/` and ​ `/schedules​/schedule_a​/{sub_id}​/`. This endpoint provides itemized receipts. Schedule A records describe itemized receipts, including contributions from individuals. If you are interested in contributions from an individual, use the `/schedules/schedule_a/` endpoint. For a more complete description of all Schedule A records visit [About receipts data](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/about-receipts-data/). If you are interested in our "is_individual" methodology visit our [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology/). ​The `/schedules​/schedule_a​/` endpoint is not paginated by page number. This endpoint uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. To request the next page, you should append the values found in the `last_indexes` object from pagination to the URL of your last request as additional parameters. For example, when sorting by `contribution_receipt_date`, you might receive a page of results with the two scenarios of following pagination information: case #1: ``` pagination: { pages: 2152643, per_page: 20, is_count_exact: False, count: 43052850, last_indexes: { last_index: "230880619", last_contribution_receipt_date: "2014-01-01" } } ``` <br/> case #2 (results which include contribution_receipt_date = NULL): ``` pagination: { pages: 2152644, per_page: 20, count: 43052850, is_count_exact: False, last_indexes: { last_index: "230880639", sort_null_only: True } } ``` To fetch the next page of sorted results, append `last_index=230880619` and `last_contribution_receipt_date=2014-01-01` to the URL and when reaching `contribution_receipt_date=NULL`, append `last_index=230880639` and `sort_null_only=True`. We strongly advise paging through these results using sort indices. The default sort is acending by `contribution_receipt_date` (`deprecated`, will be descending). If you do not page using sort indices, some transactions may be unintentionally filtered out. Calls to ​`/schedules​/schedule_a​/` may return many records. For large result sets, the record counts found in the pagination object are approximate; you will need to page through the records until no records are returned. To avoid throwing the "out of range" exception on the last page, one recommandation is to use total count and `per_page` to control the traverse loop of results. ​The `/schedules​/schedule_a​/{sub_id}​/` endpoint returns a single transaction, but it does include a pagination object class. Please ignore the information in that object class.
     *
     * @tags receipts
     * @name SchedulesScheduleADetail
     * @request GET:/v1/schedules/schedule_a/{sub_id}/
     * @secure
     */
    schedulesScheduleADetail: (
      subId: string,
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** Filter for all amounts greater than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /** Minimum date */
        min_date?: string;
        /** Maximum date */
        max_date?: string;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** The FEC identifier should be represented here if the contributor is registered with the FEC. */
        contributor_id?: string[];
        /** Name of contributor */
        contributor_name?: string[];
        /** City of contributor */
        contributor_city?: string[];
        /** State of contributor */
        contributor_state?: string[];
        /** Zip code of contributor */
        contributor_zip?: string[];
        /** Employer of contributor, filers need to make an effort to gather this information */
        contributor_employer?: string[];
        /** Occupation of contributor, filers need to make an effort to gather this information */
        contributor_occupation?: string[];
        /**
         * When sorting by `contribution_receipt_date`, this is populated with the         `contribution_receipt_date` of the last result. However, you will need to pass the index         of that last result to `last_index` to get the next page.
         * @default null
         */
        last_contribution_receipt_date?: string | null;
        /**
         * When sorting by `contribution_receipt_amount`, this is populated with the         `contribution_receipt_amount` of the last result. However, you will need to pass the index         of that last result to `last_index` to get the next page.
         * @default null
         */
        last_contribution_receipt_amount?: number | null;
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        line_number?: string;
        /**
         * Restrict to non-earmarked individual contributions where memo code is true. Filtering individuals is useful to make sure contributions are not double reported and in creating breakdowns of the amount of money coming from individuals.
         * @default null
         */
        is_individual?: boolean | null;
        /** Filters individual or committee contributions based on line number */
        contributor_type?: ("individual" | "committee")[];
        /**
         *
         * This is a two-year period that is derived from the year a transaction took place in the
         * Itemized Schedule A and Schedule B tables. In cases where we have the date of the transaction
         * (contribution_receipt_date in schedules/schedule_a, disbursement_date in schedules/schedule_b)
         * the two_year_transaction_period is named after the ending, even-numbered year. If we do not
         * have the date  of the transaction, we fall back to using the report year (report_year in both
         * tables) instead,  making the same cycle adjustment as necessary. If no transaction year is
         * specified, the results default to the most current cycle.
         */
        two_year_transaction_period?: number[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        recipient_committee_type?: (
          | ""
          | "C"
          | "D"
          | "E"
          | "H"
          | "I"
          | "N"
          | "O"
          | "P"
          | "Q"
          | "S"
          | "U"
          | "V"
          | "W"
          | "X"
          | "Y"
          | "Z"
        )[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        recipient_committee_org_type?: (
          | ""
          | "C"
          | "L"
          | "M"
          | "T"
          | "V"
          | "W"
        )[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        recipient_committee_designation?: (
          | ""
          | "A"
          | "J"
          | "P"
          | "U"
          | "B"
          | "D"
        )[];
        /** Minimum load date */
        min_load_date?: string;
        /** Maximum load date */
        max_load_date?: string;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Index of last result from previous page
         * @default null
         */
        last_index?: number | null;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-contribution_receipt_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleAPage>({
        path: `/v1/schedules/schedule_a/${subId}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule B filings describe itemized disbursements. This data explains how committees and other filers spend their money. These figures are reported as part of forms F3, F3X and F3P. The data are divided in two-year periods, called `two_year_transaction_period`, which is derived from the `report_year` submitted of the corresponding form. If no value is supplied, the results will default to the most recent two-year period that is named after the ending, even-numbered year. Due to the large quantity of Schedule B filings, this endpoint is not paginated by page number. Instead, you can request the next page of results by adding the values in the `last_indexes` object from `pagination` to the URL of your last request. For example, when sorting by `disbursement_date`, you might receive a page of results with the following pagination information: ``` pagination: { pages: 965191, per_page: 20, count: 19303814, is_count_exact: False, last_indexes: { last_index: "230906248", last_disbursement_date: "2014-07-04" } } ``` To fetch the next page of sorted results, append `last_index=230906248` and `last_disbursement_date=2014-07-04` to the URL.  We strongly advise paging through these results by using the sort indices (defaults to sort by disbursement date, e.g. `last_disbursement_date`), otherwise some resources may be unintentionally filtered out. This resource uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. Note: because the Schedule B data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
     *
     * @tags disbursements
     * @name SchedulesScheduleBList
     * @request GET:/v1/schedules/schedule_b/
     * @secure
     */
    schedulesScheduleBList: (
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** Filter for all amounts greater than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /** Minimum date */
        min_date?: string;
        /** Maximum date */
        max_date?: string;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** Description of disbursement */
        disbursement_description?: string[];
        /** Disbursement purpose category */
        disbursement_purpose_category?: (
          | "ADMINISTRATIVE"
          | "ADVERTISING"
          | "CONTRIBUTIONS"
          | "EVENTS"
          | "FUNDRAISING"
          | "LOAN-REPAYMENTS"
          | "MATERIALS"
          | "OTHER"
          | "POLLING"
          | "REFUNDS"
          | "TRANSFERS"
          | "TRAVEL"
        )[];
        /**
         * When sorting by `disbursement_amount`, this is populated with the `disbursement_amount` of the last result.  However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_disbursement_amount?: number | null;
        /**
         * When sorting by `disbursement_date`, this is populated with the `disbursement_date` of the last result. However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_disbursement_date?: string | null;
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        line_number?: string;
        /** City of recipient */
        recipient_city?: string[];
        /** The FEC identifier should be represented here if the contributor is registered with the FEC. */
        recipient_committee_id?: string[];
        /** Name of the entity receiving the disbursement */
        recipient_name?: string[];
        /** State of recipient */
        recipient_state?: string[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        spender_committee_designation?: (
          | ""
          | "A"
          | "J"
          | "P"
          | "U"
          | "B"
          | "D"
        )[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        spender_committee_org_type?: ("" | "C" | "L" | "M" | "T" | "V" | "W")[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        spender_committee_type?: (
          | ""
          | "C"
          | "D"
          | "E"
          | "H"
          | "I"
          | "N"
          | "O"
          | "P"
          | "Q"
          | "S"
          | "U"
          | "V"
          | "W"
          | "X"
          | "Y"
          | "Z"
        )[];
        /**
         *
         * This is a two-year period that is derived from the year a transaction took place in the
         * Itemized Schedule A and Schedule B tables. In cases where we have the date of the transaction
         * (contribution_receipt_date in schedules/schedule_a, disbursement_date in schedules/schedule_b)
         * the two_year_transaction_period is named after the ending, even-numbered year. If we do not
         * have the date  of the transaction, we fall back to using the report year (report_year in both
         * tables) instead,  making the same cycle adjustment as necessary. If no transaction year is
         * specified, the results default to the most current cycle.
         */
        two_year_transaction_period?: number[];
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Index of last result from previous page
         * @default null
         */
        last_index?: number | null;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-disbursement_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleBPage>({
        path: `/v1/schedules/schedule_b/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule B disbursements aggregated by disbursement purpose category. To avoid double counting, memoed items are not included. Purpose is a combination of transaction codes, category codes and disbursement description. Inspect the `disbursement_purpose` sql function within the migrations for more details.
     *
     * @tags disbursements
     * @name SchedulesScheduleBByPurposeList
     * @request GET:/v1/schedules/schedule_b/by_purpose/
     * @secure
     */
    schedulesScheduleBByPurposeList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Disbursement purpose category */
        purpose?: (
          | "ADMINISTRATIVE"
          | "ADVERTISING"
          | "CONTRIBUTIONS"
          | "EVENTS"
          | "FUNDRAISING"
          | "LOAN-REPAYMENTS"
          | "MATERIALS"
          | "OTHER"
          | "POLLING"
          | "REFUNDS"
          | "TRANSFERS"
          | "TRAVEL"
        )[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleBByPurposePage>({
        path: `/v1/schedules/schedule_b/by_purpose/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule B disbursements aggregated by recipient name. To avoid double counting, memoed items are not included.
     *
     * @tags disbursements
     * @name SchedulesScheduleBByRecipientList
     * @request GET:/v1/schedules/schedule_b/by_recipient/
     * @secure
     */
    schedulesScheduleBByRecipientList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Name of the entity receiving the disbursement */
        recipient_name?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleBByRecipientPage>({
        path: `/v1/schedules/schedule_b/by_recipient/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule B disbursements aggregated by recipient committee ID, if applicable. To avoid double counting, memoed items are not included.
     *
     * @tags disbursements
     * @name SchedulesScheduleBByRecipientIdList
     * @request GET:/v1/schedules/schedule_b/by_recipient_id/
     * @secure
     */
    schedulesScheduleBByRecipientIdList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** The FEC identifier should be represented here if the entity receiving the disbursement is registered with the FEC. */
        recipient_id?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleBByRecipientIDPage>({
        path: `/v1/schedules/schedule_b/by_recipient_id/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Efiling endpoints provide real-time campaign finance data received from electronic filers. Efiling endpoints only contain the most recent four months of data and don't contain the processed and coded data that you can find on other endpoints.
     *
     * @tags disbursements
     * @name SchedulesScheduleBEfileList
     * @request GET:/v1/schedules/schedule_b/efile/
     * @secure
     */
    schedulesScheduleBEfileList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** Description of disbursement */
        disbursement_description?: string[];
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** City of recipient */
        recipient_city?: string[];
        /** State of recipient */
        recipient_state?: string[];
        /**
         * When sorting by `disbursement_date`, this is populated with the         `disbursement_date` of the last result. However, you will need to pass the index         of that last result to `last_index` to get the next page.
         * @default null
         */
        max_date?: string | null;
        /**
         * When sorting by `disbursement_date`, this is populated with the         `disbursement_date` of the last result. However, you will need to pass the index         of that last result to `last_index` to get the next page.
         * @default null
         */
        min_date?: string | null;
        /** Filter for all amounts less than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-disbursement_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleBEfilePage>({
        path: `/v1/schedules/schedule_b/efile/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule B filings describe itemized disbursements. This data explains how committees and other filers spend their money. These figures are reported as part of forms F3, F3X and F3P. The data are divided in two-year periods, called `two_year_transaction_period`, which is derived from the `report_year` submitted of the corresponding form. If no value is supplied, the results will default to the most recent two-year period that is named after the ending, even-numbered year. Due to the large quantity of Schedule B filings, this endpoint is not paginated by page number. Instead, you can request the next page of results by adding the values in the `last_indexes` object from `pagination` to the URL of your last request. For example, when sorting by `disbursement_date`, you might receive a page of results with the following pagination information: ``` pagination: { pages: 965191, per_page: 20, count: 19303814, is_count_exact: False, last_indexes: { last_index: "230906248", last_disbursement_date: "2014-07-04" } } ``` To fetch the next page of sorted results, append `last_index=230906248` and `last_disbursement_date=2014-07-04` to the URL.  We strongly advise paging through these results by using the sort indices (defaults to sort by disbursement date, e.g. `last_disbursement_date`), otherwise some resources may be unintentionally filtered out. This resource uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. Note: because the Schedule B data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
     *
     * @tags disbursements
     * @name SchedulesScheduleBDetail
     * @request GET:/v1/schedules/schedule_b/{sub_id}/
     * @secure
     */
    schedulesScheduleBDetail: (
      subId: string,
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** Filter for all amounts greater than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /** Minimum date */
        min_date?: string;
        /** Maximum date */
        max_date?: string;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** Description of disbursement */
        disbursement_description?: string[];
        /** Disbursement purpose category */
        disbursement_purpose_category?: (
          | "ADMINISTRATIVE"
          | "ADVERTISING"
          | "CONTRIBUTIONS"
          | "EVENTS"
          | "FUNDRAISING"
          | "LOAN-REPAYMENTS"
          | "MATERIALS"
          | "OTHER"
          | "POLLING"
          | "REFUNDS"
          | "TRANSFERS"
          | "TRAVEL"
        )[];
        /**
         * When sorting by `disbursement_amount`, this is populated with the `disbursement_amount` of the last result.  However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_disbursement_amount?: number | null;
        /**
         * When sorting by `disbursement_date`, this is populated with the `disbursement_date` of the last result. However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_disbursement_date?: string | null;
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        line_number?: string;
        /** City of recipient */
        recipient_city?: string[];
        /** The FEC identifier should be represented here if the contributor is registered with the FEC. */
        recipient_committee_id?: string[];
        /** Name of the entity receiving the disbursement */
        recipient_name?: string[];
        /** State of recipient */
        recipient_state?: string[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        spender_committee_designation?: (
          | ""
          | "A"
          | "J"
          | "P"
          | "U"
          | "B"
          | "D"
        )[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        spender_committee_org_type?: ("" | "C" | "L" | "M" | "T" | "V" | "W")[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        spender_committee_type?: (
          | ""
          | "C"
          | "D"
          | "E"
          | "H"
          | "I"
          | "N"
          | "O"
          | "P"
          | "Q"
          | "S"
          | "U"
          | "V"
          | "W"
          | "X"
          | "Y"
          | "Z"
        )[];
        /**
         *
         * This is a two-year period that is derived from the year a transaction took place in the
         * Itemized Schedule A and Schedule B tables. In cases where we have the date of the transaction
         * (contribution_receipt_date in schedules/schedule_a, disbursement_date in schedules/schedule_b)
         * the two_year_transaction_period is named after the ending, even-numbered year. If we do not
         * have the date  of the transaction, we fall back to using the report year (report_year in both
         * tables) instead,  making the same cycle adjustment as necessary. If no transaction year is
         * specified, the results default to the most current cycle.
         */
        two_year_transaction_period?: number[];
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Index of last result from previous page
         * @default null
         */
        last_index?: number | null;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-disbursement_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleBPage>({
        path: `/v1/schedules/schedule_b/${subId}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule C shows all loans, endorsements and loan guarantees a committee receives or makes. The committee continues to report the loan until it is repaid.
     *
     * @tags loans
     * @name SchedulesScheduleCList
     * @request GET:/v1/schedules/schedule_c/
     * @secure
     */
    schedulesScheduleCList: (
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_amount?: number;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** Name of candidate running for office */
        candidate_name?: string[];
        /** Source of the loan (i.e., bank loan, brokerage account, credit card, home equity line of credit,               other line of credit, or personal funds of the candidate */
        loan_source_name?: string[];
        /**
         *
         * Minimum payment to date
         */
        min_payment_to_date?: number;
        /**
         *
         * Maximum payment to date
         */
        max_payment_to_date?: number;
        /**
         *
         * Minimum incurred date
         * @default null
         */
        min_incurred_date?: string | null;
        /**
         *
         * Maximum incurred date
         * @default null
         */
        max_incurred_date?: string | null;
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        form_line_number?: string[];
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Index of last result from previous page
         * @default null
         */
        last_index?: number | null;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-incurred_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default true
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleCPage>({
        path: `/v1/schedules/schedule_c/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule C shows all loans, endorsements and loan guarantees a committee receives or makes. The committee continues to report the loan until it is repaid.
     *
     * @tags loans
     * @name SchedulesScheduleCDetail
     * @request GET:/v1/schedules/schedule_c/{sub_id}/
     * @secure
     */
    schedulesScheduleCDetail: (
      subId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleCPage>({
        path: `/v1/schedules/schedule_c/${subId}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule D, it shows debts and obligations owed to or by the committee that are required to be disclosed.
     *
     * @tags debts
     * @name SchedulesScheduleDList
     * @request GET:/v1/schedules/schedule_d/
     * @secure
     */
    schedulesScheduleDList: (
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        min_payment_period?: number;
        max_payment_period?: number;
        min_amount_incurred?: number;
        max_amount_incurred?: number;
        min_amount_outstanding_beginning?: number;
        max_amount_outstanding_beginning?: number;
        min_amount_outstanding_close?: number;
        max_amount_outstanding_close?: number;
        creditor_debtor_name?: string[];
        nature_of_debt?: string;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * Ending date of the reporting period after this date(MM/DD/YYYY or YYYY-MM-DD)
         * @default null
         */
        min_coverage_end_date?: string | null;
        /**
         *
         * Ending date of the reporting period before this date(MM/DD/YYYY or YYYY-MM-DD)
         * @default null
         */
        max_coverage_end_date?: string | null;
        /**
         *
         * Starting date of the reporting period after this date(MM/DD/YYYY or YYYY-MM-DD)
         * @default null
         */
        min_coverage_start_date?: string | null;
        /**
         *
         * Starting date of the reporting period before this date(MM/DD/YYYY or YYYY-MM-DD)
         * @default null
         */
        max_coverage_start_date?: string | null;
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        report_year?: number[];
        /**
         * Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         *     - 90S Post Inaugural Supplement
         *     - 90D Post Inaugural
         *     - 48  48 Hour Notification
         *     - 24  24 Hour Notification
         *     - M7S July Monthly/Semi-Annual
         *     - MSA Monthly Semi-Annual (MY)
         *     - MYS Monthly Year End/Semi-Annual
         *     - Q2S July Quarterly/Semi-Annual
         *     - QSA Quarterly Semi-Annual (MY)
         *     - QYS Quarterly Year End/Semi-Annual
         *     - QYE Quarterly Semi-Annual (YE)
         *     - QMS Quarterly Mid-Year/ Semi-Annual
         *     - MSY Monthly Semi-Annual (YE)
         */
        report_type?: string[];
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        form_line_number?: string[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: string[];
        /**
         * The form where the underlying data comes from, for example, Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         *     - FRQ  Request for Additional Information
         */
        filing_form?: string[];
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-coverage_end_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleDPage>({
        path: `/v1/schedules/schedule_d/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule D, it shows debts and obligations owed to or by the committee that are required to be disclosed.
     *
     * @tags debts
     * @name SchedulesScheduleDDetail
     * @request GET:/v1/schedules/schedule_d/{sub_id}/
     * @secure
     */
    schedulesScheduleDDetail: (
      subId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-coverage_end_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleDPage>({
        path: `/v1/schedules/schedule_d/${subId}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule E covers the line item expenditures for independent expenditures. For example, if a super PAC bought ads on TV to oppose a federal candidate, each ad purchase would be recorded here with the expenditure amount, name and id of the candidate, and whether the ad supported or opposed the candidate. An independent expenditure is an expenditure for a communication "expressly advocating the election or defeat of a clearly identified candidate that is not made in cooperation, consultation, or concert with, or at the request or suggestion of, a candidate, a candidate’s authorized committee, or their agents, or a political party or its agents." Aggregates by candidate do not include 24 and 48 hour reports. This ensures we don't double count expenditures and the totals are more accurate. You can still find the information from 24 and 48 hour reports in `/schedule/schedule_e/`. Due to the large quantity of Schedule E filings, this endpoint is not paginated by page number. Instead, you can request the next page of results by adding the values in the `last_indexes` object from `pagination` to the URL of your last request. For example, when sorting by `expenditure_amount`, you might receive a page of results with the following pagination information: ``` "pagination": { "count": 152623, "is_count_exact": True, "last_indexes": { "last_index": "3023037", "last_expenditure_amount": -17348.5 }, "per_page": 20, "pages": 7632 } } ``` To fetch the next page of sorted results, append `last_index=3023037` and `last_expenditure_amount=` to the URL.  We strongly advise paging through these results by using the sort indices (defaults to sort by disbursement date, e.g. `last_disbursement_date`), otherwise some resources may be unintentionally filtered out.  This resource uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. Note: because the Schedule E data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
     *
     * @tags independent expenditures
     * @name SchedulesScheduleEList
     * @request GET:/v1/schedules/schedule_e/
     * @secure
     */
    schedulesScheduleEList: (
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** Filter for all amounts greater than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /** Minimum date */
        min_date?: string;
        /** Maximum date */
        max_date?: string;
        /** Federal office candidate runs for: H, S or P */
        candidate_office?: ("" | "H" | "S" | "P")[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        candidate_party?: string[];
        /** US state or territory */
        candidate_office_state?: string[];
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        candidate_office_district?: string[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         * The form where the underlying data comes from, for example, Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         *     - FRQ  Request for Additional Information
         */
        filing_form?: string[];
        /**
         *
         * When sorting by `expenditure_date`,
         * this is populated with the `expenditure_date` of the last result.
         * However, you will need to pass the index of that last result to
         * `last_index` to get the next page.
         * @default null
         */
        last_expenditure_date?: string | null;
        /**
         *
         * When sorting by `expenditure_amount`,
         * this is populated with the `expenditure_amount` of the last result.
         * However, you will need to pass the index of that last result to
         * `last_index` to get the next page.
         * @default null
         */
        last_expenditure_amount?: number | null;
        /**
         *
         * When sorting by `office_total_ytd`,
         * this is populated with the `office_total_ytd` of the last result.
         * However, you will need to pass the index of that last result to
         * `last_index` to get the next page.'
         * @default null
         */
        last_office_total_ytd?: number | null;
        /**
         *
         * Name of the entity that received the payment.
         */
        payee_name?: string[];
        /** Explains if the money was spent in order to support or oppose a candidate or candidates. (Coded S or O for support or oppose.) This indicator applies to independent expenditures and communication costs. */
        support_oppose_indicator?: ("S" | "O")[];
        /**
         *
         * When sorting by `support_oppose_indicator`,
         * this is populated with the `support_oppose_indicator` of the last result.
         * However, you will need to pass the index of that last result to `last_index`
         * to get the next page.'
         * @default null
         */
        last_support_oppose_indicator?: string | null;
        /**
         *
         * Record filed as 24- or 48-hour notice.
         */
        is_notice?: boolean[];
        /** Selects all items distributed by this committee after this date */
        min_dissemination_date?: string;
        /** Selects all items distributed by this committee before this date */
        max_dissemination_date?: string;
        /**
         *
         * Selects all filings received after this date
         */
        min_filing_date?: string;
        /**
         *
         * Selects all filings received before this date
         */
        max_filing_date?: string;
        /**
         *
         * The report associated with the transaction is either new or is the most-recently filed amendment. Undetermined version (`null`) is always included.
         */
        most_recent?: boolean;
        /**
         *
         * Keyword search for spender name or ID
         */
        q_spender?: string[];
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        form_line_number?: string[];
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Index of last result from previous page
         * @default null
         */
        last_index?: number | null;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-expenditure_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleEPage>({
        path: `/v1/schedules/schedule_e/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule E receipts aggregated by recipient candidate. To avoid double counting, memoed items are not included.
     *
     * @tags independent expenditures
     * @name SchedulesScheduleEByCandidateList
     * @request GET:/v1/schedules/schedule_e/by_candidate/
     * @secure
     */
    schedulesScheduleEByCandidateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /** US state or territory where a candidate runs for office */
        state?: string;
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        district?: string;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /** Federal office candidate runs for: H, S or P */
        office?: "house" | "senate" | "president";
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * Support or opposition
         * @default null
         */
        support_oppose?: "S" | "O";
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleEByCandidatePage>({
        path: `/v1/schedules/schedule_e/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Efiling endpoints provide real-time campaign finance data received from electronic filers. Efiling endpoints only contain the most recent four months of data and don't contain the processed and coded data that you can find on other endpoints.
     *
     * @tags independent expenditures
     * @name SchedulesScheduleEEfileList
     * @request GET:/v1/schedules/schedule_e/efile/
     * @secure
     */
    schedulesScheduleEEfileList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Search for candidates by candiate id or candidate first or last name
         */
        candidate_search?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * Name of the entity that received the payment.
         */
        payee_name?: string[];
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Explains if the money was spent in order to support or oppose a candidate or candidates. (Coded S or O for support or oppose.) This indicator applies to independent expenditures and communication costs. */
        support_oppose_indicator?: ("S" | "O")[];
        /** Selects all items expended by this committee after this date */
        min_expenditure_date?: string;
        /** Selects all items expended by this committee before this date */
        max_expenditure_date?: string;
        /** Selects all items distributed by this committee after this date */
        min_dissemination_date?: string;
        /** Selects all items distributed by this committee before this date */
        max_dissemination_date?: string;
        /** Selects all items expended by this committee greater than this amount */
        min_expenditure_amount?: number;
        /** Selects all items expended by this committee less than this amount */
        max_expenditure_amount?: number;
        /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
        spender_name?: string[];
        /** Three-letter code for the party affiliated with a candidate or committee. For example, DEM for Democratic Party and REP for Republican Party. */
        candidate_party?: string[];
        /** Federal office candidate runs for: H, S or P */
        candidate_office?: "" | "H" | "S" | "P";
        /** US state or territory where a candidate runs for office */
        candidate_office_state?: string[];
        /** Two-digit US House distirict of the office the candidate is running for. Presidential, Senate and House at-large candidates will have District 00. */
        candidate_office_district?: string[];
        /**
         *
         * The report associated with the transaction is either new or is the most-recently filed amendment. Undetermined version (`null`) is always included.
         */
        most_recent?: boolean;
        /** Timestamp of electronic or paper record that FEC received */
        min_filed_date?: string;
        /** Timestamp of electronic or paper record that FEC received */
        max_filed_date?: string;
        /**
         * The form where the underlying data comes from, for example, Form 1 would appear as F1:
         *     - F1   Statement of Organization
         *     - F1M  Notification of Multicandidate Status
         *     - F2   Statement of Candidacy
         *     - F3   Report of Receipts and Disbursements for an Authorized Committee
         *     - F3P  Report of Receipts and Disbursements by an Authorized Committee of a Candidate for     The Office of President or Vice President
         *     - F3L  Report of Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant PACs
         *     - F3X  Report of Receipts and Disbursements for other than an Authorized Committee
         *     - F4   Report of Receipts and Disbursements for a Committee or Organization Supporting a Nomination Convention
         *     - F5   Report of Independent Expenditures Made and Contributions Received
         *     - F6   48 Hour Notice of Contributions/Loans Received
         *     - F7   Report of Communication Costs by Corporations and Membership Organizations
         *     - F8   Debt Settlement Plan
         *     - F9   24 Hour Notice of Disbursements for Electioneering Communications
         *     - F13  Report of Donations Accepted for Inaugural Committee
         *     - F99  Miscellaneous Text
         *     - FRQ  Request for Additional Information
         */
        filing_form?: string[];
        /**
         *
         * Record filed as 24- or 48-hour notice.
         */
        is_notice?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-expenditure_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleEEfilePage>({
        path: `/v1/schedules/schedule_e/efile/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Total independent expenditure on supported or opposed candidates by cycle or candidate election year.
     *
     * @tags independent expenditures
     * @name SchedulesScheduleETotalsByCandidateList
     * @request GET:/v1/schedules/schedule_e/totals/by_candidate/
     * @secure
     */
    schedulesScheduleETotalsByCandidateList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         * `True` indicates that full election period of a candidate.
         * `False` indicates that two year election cycle.
         * @default true
         */
        election_full?: boolean;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-cycle","candidate_id"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, IETotalsByCandidatePage>({
        path: `/v1/schedules/schedule_e/totals/by_candidate/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule F, it shows all special expenditures a national or state party committee makes in connection with the general election campaigns of federal candidates. These coordinated party expenditures do not count against the contribution limits but are subject to other limits, these limits are detailed in Chapter 7 of the FEC Campaign Guide for Political Party Committees.
     *
     * @tags party-coordinated expenditures
     * @name SchedulesScheduleFList
     * @request GET:/v1/schedules/schedule_f/
     * @secure
     */
    schedulesScheduleFList: (
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** Filter for all amounts greater than a value. */
        min_amount?: number;
        /** Filter for all amounts less than a value. */
        max_amount?: number;
        /** Minimum date */
        min_date?: string;
        /** Maximum date */
        max_date?: string;
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC.
         * If a person runs for several offices, that person will have separate candidate IDs for each office.
         * First character indicates office - [P]residential, [H]ouse, [S]enate].
         * Second character is the last digit of the two-year period the ID was created.
         * Third and fourth is the candidate state. Presidential IDs don't have state.
         * Fifth and sixth is the district when the candidate first ran. This does not change if the
         * candidate/member's district changes during re-districting. Presidential IDs don't have districts.
         * The rest is sequence.
         */
        candidate_id?: string[];
        /**
         *
         * Name of the entity that received the payment.
         */
        payee_name?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        form_line_number?: string[];
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "expenditure_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleFPage>({
        path: `/v1/schedules/schedule_f/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule F, it shows all special expenditures a national or state party committee makes in connection with the general election campaigns of federal candidates. These coordinated party expenditures do not count against the contribution limits but are subject to other limits, these limits are detailed in Chapter 7 of the FEC Campaign Guide for Political Party Committees.
     *
     * @tags party-coordinated expenditures
     * @name SchedulesScheduleFDetail
     * @request GET:/v1/schedules/schedule_f/{sub_id}/
     * @secure
     */
    schedulesScheduleFDetail: (
      subId: string,
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleFPage>({
        path: `/v1/schedules/schedule_f/${subId}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Schedule H4 filings describe disbursements for allocated federal/nonfederal activity. This data demonstrates how separate segregated funds, party committees and nonconnected committees that are active in both federal and nonfederal elections, and have established separate federal and nonfederal accounts, allocate their activity. These figures are reported on Form 3X. The data are divided in two-year periods, called `two_year_transaction_period`, which are derived from the `report_year` submitted on Form 3X. If no value is supplied, the results will default to the most recent two-year period.
     *
     * @tags disbursements
     * @name SchedulesScheduleH4List
     * @request GET:/v1/schedules/schedule_h4/
     * @secure
     */
    schedulesScheduleH4List: (
      query?: {
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_amount?: number;
        /**
         * Minimum event_purpose_date
         * @default null
         */
        min_date?: string | null;
        /**
         * Maximum event_purpose_date
         * @default null
         */
        max_date?: string | null;
        /**
         *
         * Forms with coverage date -
         *     year from the coverage ending date.
         * Forms without coverage date -
         *     year from the receipt date.
         */
        report_year?: number[];
        /**
         * Name of report where the underlying data comes from:
         *     - 10D Pre-Election
         *     - 10G Pre-General
         *     - 10P Pre-Primary
         *     - 10R Pre-Run-Off
         *     - 10S Pre-Special
         *     - 12C Pre-Convention
         *     - 12G Pre-General
         *     - 12P Pre-Primary
         *     - 12R Pre-Run-Off
         *     - 12S Pre-Special
         *     - 30D Post-Election
         *     - 30G Post-General
         *     - 30P Post-Primary
         *     - 30R Post-Run-Off
         *     - 30S Post-Special
         *     - 60D Post-Convention
         *     - M1  January Monthly
         *     - M10 October Monthly
         *     - M11 November Monthly
         *     - M12 December Monthly
         *     - M2  February Monthly
         *     - M3  March Monthly
         *     - M4  April Monthly
         *     - M5  May Monthly
         *     - M6  June Monthly
         *     - M7  July Monthly
         *     - M8  August Monthly
         *     - M9  September Monthly
         *     - MY  Mid-Year Report
         *     - Q1  April Quarterly
         *     - Q2  July Quarterly
         *     - Q3  October Quarterly
         *     - TER Termination Report
         *     - YE  Year-End
         *     - ADJ COMP ADJUST AMEND
         *     - CA  COMPREHENSIVE AMEND
         *     - 90S Post Inaugural Supplement
         *     - 90D Post Inaugural
         *     - 48  48 Hour Notification
         *     - 24  24 Hour Notification
         *     - M7S July Monthly/Semi-Annual
         *     - MSA Monthly Semi-Annual (MY)
         *     - MYS Monthly Year End/Semi-Annual
         *     - Q2S July Quarterly/Semi-Annual
         *     - QSA Quarterly Semi-Annual (MY)
         *     - QYS Quarterly Year End/Semi-Annual
         *     - QYE Quarterly Semi-Annual (YE)
         *     - QMS Quarterly Mid-Year/ Semi-Annual
         *     - MSY Monthly Semi-Annual (YE)
         */
        report_type?: string[];
        activity_or_event?: string[];
        /**
         *
         * Name of the entity that received the payment.
         */
        q_payee_name?: string[];
        /** City of the entity that received the payment */
        payee_city?: string[];
        /** Zip of the entity that received the payment */
        payee_zip?: string[];
        /** State of the entity that received the payment */
        payee_state?: string[];
        /** Purpose of the allocated disbursement */
        q_disbursement_purpose?: string[];
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * When sorting by `payee_name`, this is populated with the `payee_name` of the last result.  However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_payee_name?: string[] | null;
        /**
         * When sorting by `disbursement_purpose`, this is populated with the `disbursement_purpose`of the last result.  However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_disbursement_purpose?: string[] | null;
        /**
         * When sorting by `event_purpose_date`, this is populated with the `event_purpose_date` of the last result. However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_event_purpose_date?: string | null;
        /**
         * When sorting by `spender_committee_name`, this is populated with the `spender_committee_name` of the last result.  However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_spender_committee_name?: string[] | null;
        /**
         * When sorting by `disbursement_amount`, this is populated with the `disbursement_amount` of the last result.  However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_disbursement_amount?: number | null;
        /** Activity or event: Admin/Voter Drive checkbox */
        administrative_voter_drive_activity_indicator?: string[];
        /** Activity or event: Fundraising checkbox */
        fundraising_activity_indicator?: string[];
        /** Activity or event: Exempt checkbox */
        exempt_activity_indicator?: string[];
        /** Activity or event: Direct Candidate checkbox */
        direct_candidate_support_activity_indicator?: string[];
        /** Activity or event: Administrative checkbox */
        administrative_activity_indicator?: string[];
        /** Activity or event: Voter Drive checkbox */
        general_voter_drive_activity_indicator?: string[];
        /** Activity or event: Public Comm (ref to party only) by PAC checkbox */
        public_comm_indicator?: string[];
        /** The name of the committee. If a committee changes its name,     the most recent name will be shown. Committee names are not unique. Use committee_id     for looking up records. */
        spender_committee_name?: string[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        spender_committee_type?: (
          | ""
          | "C"
          | "D"
          | "E"
          | "H"
          | "I"
          | "N"
          | "O"
          | "P"
          | "Q"
          | "S"
          | "U"
          | "V"
          | "W"
          | "X"
          | "Y"
          | "Z"
        )[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        spender_committee_designation?: (
          | ""
          | "A"
          | "J"
          | "P"
          | "U"
          | "B"
          | "D"
        )[];
        /**
         *
         * Filter for form and line number using the following format:
         * `FORM-LINENUMBER`.  For example an argument such as `F3X-16` would filter
         * down to all entries from form `F3X` line number `16`.
         */
        form_line_number?: string[];
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         * Index of last result from previous page
         * @default null
         */
        last_index?: number | null;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-event_purpose_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleH4Page>({
        path: `/v1/schedules/schedule_h4/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Efiling endpoints provide real-time campaign finance data received from electronic filers. Efiling endpoints only contain the most recent four months of data and don't contain the processed and coded data that you can find on other endpoints.
     *
     * @tags disbursements
     * @name SchedulesScheduleH4EfileList
     * @request GET:/v1/schedules/schedule_h4/efile/
     * @secure
     */
    schedulesScheduleH4EfileList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * An unique identifier for each page where the electronic or paper filing is reported.
         */
        image_number?: string[];
        /** Minium image number of the page where the schedule item is reported */
        min_image_number?: string;
        /** Maxium image number of the page where the schedule item is reported */
        max_image_number?: string;
        /** City of the entity that received the payment */
        payee_city?: string[];
        /** Zip of the entity that received the payment */
        payee_zip?: string[];
        /** State of the entity that received the payment */
        payee_state?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * When sorting by `disbursement_purpose`, this is populated with the `disbursement_purpose`of the last result.  However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_disbursement_purpose?: string[] | null;
        /**
         * When sorting by `event_purpose_date`, this is populated with the `event_purpose_date` of the last result. However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_event_purpose_date?: string | null;
        /**
         * Minimum event_purpose_date
         * @default null
         */
        min_date?: string | null;
        /**
         * Maximum event_purpose_date
         * @default null
         */
        max_date?: string | null;
        /**
         * When sorting by `disbursement_amount`, this is populated with the `disbursement_amount` of the last result.  However, you will need to pass the index of that last result to `last_index` to get the next page.
         * @default null
         */
        last_disbursement_amount?: number | null;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_amount?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_amount?: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-event_purpose_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ScheduleH4EfilePage>({
        path: `/v1/schedules/schedule_h4/efile/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description State laws and procedures govern elections for state or local offices as well as how candidates appear on election ballots. Contact the appropriate state election office for more information.
     *
     * @tags filer resources
     * @name StateElectionOfficeList
     * @request GET:/v1/state-election-office/
     * @secure
     */
    stateElectionOfficeList: (
      query: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Enter a state (Ex: AK, TX, VA etc..) to find the local election offices contact
         * information.
         *
         */
        state: string;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default null
         */
        sort?: string | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, StateElectionOfficeInfoPage>({
        path: `/v1/state-election-office/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Provides cumulative receipt totals by entity type, over a two year cycle. Totals are adjusted to avoid double counting. This is [the sql](https://github.com/fecgov/openFEC/blob/develop/data/migrations/V41__large_aggregates.sql) that creates these calculations.
     *
     * @tags financial
     * @name TotalsByEntityList
     * @request GET:/v1/totals/by_entity/
     * @secure
     */
    totalsByEntityList: (
      query: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle: number;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "end_date"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, EntityReceiptDisbursementTotalsPage>({
        path: `/v1/totals/by_entity/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides information about an inaugural committee's Form 13 report of donations accepted. The data is aggregated by the contributor and the two-year period. We refer to two-year periods as a `cycle`.
     *
     * @tags financial
     * @name TotalsInauguralCommitteesByContributorList
     * @request GET:/v1/totals/inaugural_committees/by_contributor/
     * @secure
     */
    totalsInauguralCommitteesByContributorList: (
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /** Name of contributor */
        contributor_name?: string[];
        /**
         *
         * A two year election cycle that the committee was active- (after original registration
         * date but before expiration date in Form 1s) The cycle begins with
         * an odd year and is named for its ending, even year.
         */
        cycle?: number[];
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default ["-total_donation"]
         */
        sort?: string[] | null;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, InauguralDonationsPage>({
        path: `/v1/totals/inaugural_committees/by_contributor/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint provides information about a committee's Form 3, Form 3X, or Form 3P financial reports, which are aggregated by two-year period. We refer to two-year periods as a `cycle`. The cycle is named after the even-numbered year and includes the year before it. To obtain totals from 2013 and 2014, you would use 2014. In odd-numbered years, the current cycle is the next year — for example, in 2015, the current cycle is 2016. For presidential and Senate candidates, multiple two-year cycles exist between elections.
     *
     * @tags financial
     * @name TotalsDetail
     * @request GET:/v1/totals/{entity_type}/
     * @secure
     */
    totalsDetail: (
      entityType:
        | "presidential"
        | "pac"
        | "party"
        | "pac-party"
        | "house-senate"
        | "ie-only",
      query?: {
        /**
         * For paginating through results, starting at page 1
         * @default 1
         */
        page?: number;
        /**
         * The number of results returned per page. Defaults to 20.
         * @default 20
         */
        per_page?: number;
        /**
         *
         * Filter records to only those that were applicable to a given
         * two-year period.The cycle begins with an odd year and is named
         * for its ending, even year.
         */
        cycle?: number[];
        /**
         * The one-letter designation code of the organization:
         *          - A authorized by a candidate
         *          - J joint fundraising committee
         *          - P principal campaign committee of a candidate
         *          - U unauthorized
         *          - B lobbyist/registrant PAC
         *          - D leadership PAC
         */
        committee_designation?: string[];
        /**
         *
         * A unique identifier assigned to each committee or filer registered with the FEC. In general a committee id begins with the letter C which is followed by eight digits.
         */
        committee_id?: string[];
        /**
         * The one-letter type code of the organization:
         *         - C communication cost
         *         - D delegate
         *         - E electioneering communication
         *         - H House
         *         - I independent expenditure filer (not a committee)
         *         - N PAC - nonqualified
         *         - O independent expenditure-only (super PACs)
         *         - P presidential
         *         - Q PAC - qualified
         *         - S Senate
         *         - U single candidate independent expenditure
         *         - V PAC with non-contribution account, nonqualified
         *         - W PAC with non-contribution account, qualified
         *         - X party, nonqualified
         *         - Y party, qualified
         *         - Z national party non-federal account
         */
        committee_type?: string[];
        /** US state or territory */
        committee_state?: string[];
        /**
         * The one-letter
         *     code of the filing frequency:
         *          - A Administratively terminated
         *          - D Debt
         *          - M Monthly filer
         *          - Q Quarterly filer
         *          - T Terminated
         *          - W Waived
         */
        filing_frequency?: (
          | ""
          | "A"
          | "M"
          | "N"
          | "Q"
          | "T"
          | "W"
          | "-A"
          | "-T"
        )[];
        /** Name of the Committee's treasurer. If multiple treasurers for the committee, the most recent treasurer will be shown. */
        treasurer_name?: string[];
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_disbursements?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_disbursements?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_receipts?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_receipts?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_last_cash_on_hand_end_period?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_last_cash_on_hand_end_period?: number;
        /**
         *
         * Filter for all amounts greater than a value.
         */
        min_last_debts_owed_by_committee?: number;
        /**
         *
         * Filter for all amounts less than a value.
         */
        max_last_debts_owed_by_committee?: number;
        /**
         *
         * A unique identifier assigned to each candidate registered with the FEC. If a person runs for several offices, that person will have separate candidate IDs for each office. This is a filter for Leadership PAC sponsor.
         */
        sponsor_candidate_id?: string[];
        /**
         * The one-letter code for the kind for organization:
         *         - C corporation
         *         - L labor organization
         *         - M membership organization
         *         - T trade association
         *         - V cooperative
         *         - W corporation without capital stock
         */
        organization_type?: ("" | "C" | "L" | "M" | "T" | "V" | "W")[];
        /** Filter for committees whose first Form 1 was received on or after this date. */
        min_first_f1_date?: string;
        /** Filter for committees whose first Form 1 was received on or before this date. */
        max_first_f1_date?: string;
        /**
         * Provide a field to sort by. Use `-` for descending order.
         * @default "-cycle"
         */
        sort?: string;
        /**
         * Hide null values on sorted column(s).
         * @default false
         */
        sort_hide_null?: boolean;
        /**
         * Toggle that filters out all rows having sort column that is non-null
         * @default false
         */
        sort_null_only?: boolean;
        /**
         * Toggle that sorts null values last
         * @default false
         */
        sort_nulls_last?: boolean;
        /**
         *
         * API key for https://api.data.gov. Get one at https://api.data.gov/signup.
         * @default "DEMO_KEY"
         */
        api_key?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, CommitteeTotalsPage>({
        path: `/v1/totals/${entityType}/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
}
