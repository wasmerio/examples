import { describe, expect, it } from "vitest";
import { parseHex, readableOn, themeCustomProperties } from "../../src/utils/themeTokens.mjs";

describe("parseHex", () => {
  it("accepts three- and six-digit hex, with or without the hash", () => {
    expect(parseHex("#fff")).toEqual([255, 255, 255]);
    expect(parseHex("0f766e")).toEqual([15, 118, 110]);
    expect(parseHex("  #0F766E  ")).toEqual([15, 118, 110]);
  });

  it("rejects anything it cannot read", () => {
    for (const value of ["", "teal", "#12345", "rgb(1,2,3)", null, undefined, 16]) {
      expect(parseHex(value as string)).toBeNull();
    }
  });
});

describe("readableOn", () => {
  it("puts ink on light fills and paper on dark ones", () => {
    expect(readableOn([255, 255, 255])).toBe("#08090b");
    expect(readableOn([94, 234, 212])).toBe("#08090b");
    expect(readableOn([15, 118, 110])).toBe("#ffffff");
    expect(readableOn([8, 9, 11])).toBe("#ffffff");
  });
});

describe("themeCustomProperties", () => {
  it("derives a whole family from one accent swatch", () => {
    const props = themeCustomProperties({ accentLight: "#0f766e" });

    expect(props["--accent-light"]).toBe("#0f766e");
    expect(props["--accent-light-on"]).toBe("#ffffff");
    // Hover darkens on light; surface and border sit on paper.
    expect(props["--accent-light-hover"]).toBe("#0e625c");
    expect(props["--accent-light-surface"]).toBe("#ecf4f3");
    expect(props["--accent-light-border"]).toBe("#b7d6d4");
  });

  it("moves the dark hover towards paper, not ink", () => {
    const props = themeCustomProperties({ accentDark: "#5eead4" });

    expect(props["--accent-dark"]).toBe("#5eead4");
    expect(props["--accent-dark-on"]).toBe("#08090b");
    expect(Number.parseInt(props["--accent-dark-hover"].slice(1, 3), 16)).toBeGreaterThan(0x5e);
  });

  it("omits every property it has no usable value for", () => {
    expect(themeCustomProperties({})).toEqual({});
    expect(themeCustomProperties({ accentLight: "not a color" })).toEqual({});
  });

  it("sets the radius base from a non-negative number only", () => {
    expect(themeCustomProperties({ radius: 0 })["--radius-base"]).toBe("0px");
    expect(themeCustomProperties({ radius: 16 })["--radius-base"]).toBe("16px");

    for (const radius of ["", null, -4, "round"]) {
      expect(themeCustomProperties({ radius })).toEqual({});
    }
  });
});
