import { describe, expect, it } from "vitest";
import { parseDiffLines } from "../../src/components/utils/highlight";

describe("parseDiffLines", () => {
  it("keys each range by its 1-based line", () => {
    const diff = parseDiffLines({ removed: "2", added: "3", highlight: "5-6" });

    expect([...diff]).toEqual([
      [2, "remove"],
      [3, "add"],
      [5, "highlight"],
      [6, "highlight"],
    ]);
  });

  it("gives a line named twice to the later marker", () => {
    const diff = parseDiffLines({ removed: "4", added: "4" });

    expect(diff.get(4)).toBe("add");
  });

  it("marks nothing when every range is empty", () => {
    expect(parseDiffLines({}).size).toBe(0);
    expect(parseDiffLines({ added: "" }).size).toBe(0);
  });
});
