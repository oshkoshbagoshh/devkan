import { describe, expect, it } from "vitest";

import { greet } from "./index";

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

