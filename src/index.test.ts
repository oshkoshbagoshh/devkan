import { describe, expect, it } from "vitest";

import { greet, lorenipsem } from "./index";

describe("greet", () => {
  it("greets by name", () => {
    expect(greet("AJ")).toBe("Hello, AJ");
  });

  it("trims whitespace", () => {
    expect(greet("  AJ ")).toBe("Hello, AJ");
  });

  it("handles blank input", () => {
    expect(greet("   ")).toBe("Hello");
  });
});

describe("public exports", () => {
  it("exposes lorenipsem", () => {
    expect(typeof lorenipsem).toBe("function");
    expect(lorenipsem({ count: 3, unit: "words", seed: 1 })).toBe(
      "Lorem ipsum dolor"
    );
  });
});
