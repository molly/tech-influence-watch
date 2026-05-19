import "@testing-library/jest-dom";

import { sortRaces } from "@/app/utils/races";

describe("racesUtils", () => {
  test("sortRaces comparator", () => {
    expect(sortRaces("AZ-S-1", "AZ-H-1")).toBe(-1);
    expect(sortRaces("AZ-H-1", "AZ-S-1")).toBe(1);
    expect(sortRaces("AZ-H-1", "AZ-H-2")).toBe(-1);
  });

  test("sortRaces sorting", () => {
    expect(["AZ-H-2", "AZ-S", "AZ-H-1"].sort(sortRaces)).toEqual([
      "AZ-S",
      "AZ-H-1",
      "AZ-H-2",
    ]);
  });
});
