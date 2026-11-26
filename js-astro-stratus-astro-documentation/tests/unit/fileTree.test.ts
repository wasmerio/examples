import { describe, expect, it } from "vitest";
import { drawFileTree } from "../../src/components/utils/fileTree";

const draw = (source: string) => drawFileTree(source.split("\n"));

describe("drawFileTree", () => {
  it("draws connectors from the relative indent", () => {
    expect(
      draw(`src/
  components/
    Button.astro
  styles/
    base.css
astro.config.mjs`)
    ).toEqual([
      "src/",
      "├─ components/",
      "│  └─ Button.astro",
      "└─ styles/",
      "   └─ base.css",
      "astro.config.mjs",
    ]);
  });

  it("continues an ancestor's line past a deeper subtree", () => {
    expect(
      draw(`a/
  b/
    c/
      d
    e
  f`)
    ).toEqual(["a/", "├─ b/", "│  ├─ c/", "│  │  └─ d", "│  └─ e", "└─ f"]);
  });

  it("reads any consistent indent unit, tabs included", () => {
    const spaces = draw("src/\n    a\n    b");
    const tabs = draw("src/\n\ta\n\tb");

    expect(tabs).toEqual(spaces);
    expect(tabs).toEqual(["src/", "├─ a", "└─ b"]);
  });

  it("measures depth relative to the first line, so an indented block works", () => {
    expect(draw("\n  src/\n    a\n  b\n")).toEqual(["src/", "└─ a", "b"]);
  });

  it("drops blank lines rather than drawing them as nodes", () => {
    expect(draw("src/\n\n  a\n   \n  b")).toEqual(["src/", "├─ a", "└─ b"]);
  });

  it("returns nothing for empty input", () => {
    expect(draw("")).toEqual([]);
    expect(draw("\n  \n")).toEqual([]);
  });
});
