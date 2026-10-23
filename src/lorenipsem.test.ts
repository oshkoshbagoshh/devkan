import { describe, expect, it } from "vitest";

import { lorenipsem } from "./lorenipsem";

describe("lorenipsem", () => {
  it("returns an empty string for zero count", () => {
    expect(lorenipsem({ count: 0, unit: "words" })).toBe("");
    expect(lorenipsem({ count: 0, unit: "sentences" })).toBe("");
    expect(lorenipsem({ count: 0, unit: "paragraphs" })).toBe("");
  });

  it("generates the requested number of words", () => {
    const text = lorenipsem({ count: 10, unit: "words", seed: 1 });
    expect(text.split(/\s+/)).toHaveLength(10);
  });

  it("starts with classic lorem by default", () => {
    const text = lorenipsem({ count: 8, unit: "words", seed: 1 });
    expect(text).toBe(
      "Lorem ipsum dolor sit amet consectetur adipiscing elit"
    );
  });

  it("can skip the classic opening", () => {
    const text = lorenipsem({
      count: 5,
      unit: "words",
      startWithLorem: false,
      seed: 7
    });
    expect(text.startsWith("Lorem")).toBe(false);
    expect(text.split(/\s+/)).toHaveLength(5);
  });

  it("generates the requested number of sentences", () => {
    const text = lorenipsem({ count: 3, unit: "sentences", seed: 2 });
    const sentences = text.match(/[^.]+?\./g) ?? [];
    expect(sentences).toHaveLength(3);
  });

  it("generates the requested number of paragraphs", () => {
    const text = lorenipsem({ count: 2, unit: "paragraphs", seed: 3 });
    expect(text.split("\n\n")).toHaveLength(2);
  });

  it("is deterministic for the same seed", () => {
    const a = lorenipsem({ count: 2, unit: "paragraphs", seed: 99 });
    const b = lorenipsem({ count: 2, unit: "paragraphs", seed: 99 });
    expect(a).toBe(b);
  });

  it("defaults to one paragraph", () => {
    const text = lorenipsem({ seed: 11 });
    expect(text.includes("\n\n")).toBe(false);
    expect(text.length).toBeGreaterThan(0);
    expect(text.endsWith(".")).toBe(true);
  });

  it("floors fractional and clamps negative counts", () => {
    expect(lorenipsem({ count: 2.9, unit: "words", seed: 1 }).split(/\s+/)).toHaveLength(
      2
    );
    expect(lorenipsem({ count: -4, unit: "words", seed: 1 })).toBe("");
  });
});
