import "@testing-library/jest-dom";

import { humanizeSector, parseSector } from "@/app/utils/sector";

describe("humanizeSector", () => {
  describe("default (no options)", () => {
    test("all", () => {
      expect(humanizeSector("all")).toBe("Cryptocurrency and artificial intelligence");
    });

    test("crypto", () => {
      expect(humanizeSector("crypto")).toBe("Cryptocurrency");
    });

    test("ai", () => {
      expect(humanizeSector("ai")).toBe("Artificial intelligence");
    });
  });

  describe("abbrev", () => {
    test("all", () => {
      expect(humanizeSector("all", { abbrev: true })).toBe("Crypto and AI");
    });

    test("crypto", () => {
      expect(humanizeSector("crypto", { abbrev: true })).toBe("Crypto");
    });

    test("ai", () => {
      expect(humanizeSector("ai", { abbrev: true })).toBe("AI");
    });
  });

  describe("lowercase", () => {
    test("all", () => {
      expect(humanizeSector("all", { lowercase: true })).toBe(
        "cryptocurrency and artificial intelligence",
      );
    });

    test("crypto", () => {
      expect(humanizeSector("crypto", { lowercase: true })).toBe(
        "cryptocurrency",
      );
    });

    test("ai", () => {
      expect(humanizeSector("ai", { lowercase: true })).toBe(
        "artificial intelligence",
      );
    });
  });

  describe("abbrev + lowercase", () => {
    test("all preserves AI capitalization", () => {
      expect(humanizeSector("all", { abbrev: true, lowercase: true })).toBe(
        "crypto and AI",
      );
    });

    test("crypto", () => {
      expect(humanizeSector("crypto", { abbrev: true, lowercase: true })).toBe(
        "crypto",
      );
    });

    test("ai preserves AI capitalization", () => {
      expect(humanizeSector("ai", { abbrev: true, lowercase: true })).toBe(
        "AI",
      );
    });
  });

  describe("context: industry", () => {
    test("all", () => {
      expect(humanizeSector("all", { context: "industry" })).toBe(
        "Cryptocurrency and artificial intelligence industry",
      );
    });

    test("crypto", () => {
      expect(humanizeSector("crypto", { context: "industry" })).toBe(
        "Cryptocurrency industry",
      );
    });

    test("ai", () => {
      expect(humanizeSector("ai", { context: "industry" })).toBe(
        "Artificial intelligence industry",
      );
    });

    test("abbrev + industry", () => {
      expect(
        humanizeSector("crypto", { abbrev: true, context: "industry" }),
      ).toBe("Crypto industry");
    });

    test("hyphen + industry", () => {
      expect(
        humanizeSector("crypto", { hyphen: true, context: "industry" }),
      ).toBe("Cryptocurrency industry-");
    });
  });

  describe("hyphen", () => {
    test("all inserts hyphen after first segment and appends hyphen", () => {
      expect(humanizeSector("all", { hyphen: true })).toBe(
        "Cryptocurrency- and artificial intelligence-",
      );
    });

    test("crypto", () => {
      expect(humanizeSector("crypto", { hyphen: true })).toBe(
        "Cryptocurrency-",
      );
    });

    test("ai", () => {
      expect(humanizeSector("ai", { hyphen: true })).toBe(
        "Artificial intelligence-",
      );
    });

    test("abbrev + hyphen, all", () => {
      expect(humanizeSector("all", { abbrev: true, hyphen: true })).toBe(
        "Crypto- and AI-",
      );
    });

    test("abbrev + hyphen, crypto", () => {
      expect(humanizeSector("crypto", { abbrev: true, hyphen: true })).toBe(
        "Crypto-",
      );
    });
  });
});

describe("parseSector", () => {
  test("returns 'crypto' for 'crypto'", () => {
    expect(parseSector("crypto")).toBe("crypto");
  });

  test("returns 'ai' for 'ai'", () => {
    expect(parseSector("ai")).toBe("ai");
  });

  test("returns 'all' for undefined", () => {
    expect(parseSector(undefined)).toBe("all");
  });

  test("returns 'all' for unknown string", () => {
    expect(parseSector("unknown")).toBe("all");
  });

  test("returns 'all' for empty string", () => {
    expect(parseSector("")).toBe("all");
  });
});
