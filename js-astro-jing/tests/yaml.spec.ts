import { expect, test } from "@playwright/test";
import { yamlEscape } from "@/utils/yaml";

test.describe("yamlEscape", () => {
  test("leaves strings without single quotes unchanged", () => {
    expect(yamlEscape("Welcome to Astro Jing")).toBe("Welcome to Astro Jing");
  });

  test("doubles a single quote so the YAML scalar stays valid", () => {
    expect(yamlEscape("It's a test")).toBe("It''s a test");
  });

  test("doubles every single quote when there are multiple", () => {
    expect(yamlEscape("'quoted' title's")).toBe("''quoted'' title''s");
  });

  test("produces a value that round-trips through a single-quoted YAML scalar", () => {
    const original = 'It\'s a "test" title';
    const escaped = yamlEscape(original);
    const frontmatter = `title: '${escaped}'`;

    // A single-quoted YAML scalar only special-cases '' -> '; nothing else needs decoding.
    const value = frontmatter.slice("title: '".length, -1).replace(/''/g, "'");
    expect(value).toBe(original);
  });
});
