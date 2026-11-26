import { describe, expect, it } from "vitest";
import { docsMarkdown, llmPrompt, markdownHref } from "@utils/docsMarkdown";

describe("markdownHref", () => {
  it("swaps the trailing slash for a .md extension", () => {
    expect(markdownHref("/guides/setup/")).toBe("/guides/setup.md");
  });

  it("leaves an already-extensionless href alone", () => {
    expect(markdownHref("/guides/setup")).toBe("/guides/setup.md");
  });
});

describe("docsMarkdown", () => {
  it("prepends the title, description and source", () => {
    const output = docsMarkdown({
      title: "Installation",
      description: "Scaffold a site.",
      body: "## Prerequisites\n\n- Node 22\n",
      url: "https://example.com/installation/",
    });

    expect(output).toBe(
      "# Installation\n\nScaffold a site.\n\nSource: https://example.com/installation/\n\n---\n\n## Prerequisites\n\n- Node 22\n"
    );
  });

  it("omits the parts it wasn't given", () => {
    expect(docsMarkdown({ title: "Empty" })).toBe("# Empty\n");
  });

  it("drops the leading MDX module block", () => {
    const output = docsMarkdown({
      title: "Page",
      body: 'import Thing from "./Thing.astro";\nexport const x = 1;\n\nProse.\n',
    });

    expect(output).toBe("# Page\n\n---\n\nProse.\n");
  });

  it("keeps an import shown inside a code fence", () => {
    const body = '## Usage\n\n```js\nimport thing from "thing";\n```\n';

    expect(docsMarkdown({ title: "Page", body })).toContain('import thing from "thing";');
  });
});

describe("llmPrompt", () => {
  it("wraps the markdown with its source", () => {
    expect(llmPrompt("# Page\n", "https://example.com/page/")).toBe(
      "Read the documentation page below, then answer my questions about it.\n\nSource: https://example.com/page/\n\n---\n\n# Page"
    );
  });
});
