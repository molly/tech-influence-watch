export interface StateTotals {
  total: number;
  by_race: Record<string, number>;
  by_companies?: Record<string, number>;
  companies_total?: number;
  by_race_companies?: Record<string, number>;
}

export interface MapData {
  [state: string]: StateTotals;
}
