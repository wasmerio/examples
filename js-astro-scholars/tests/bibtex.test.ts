import { describe, expect, test } from "vitest";
import { formatCitations, parseBibtex } from "../src/lib/bibtex";
import { getAllPapers, getFeaturedPapers } from "../src/lib/papers";
import siteConfig from "../site.config";

describe("parseBibtex", () => {
	test("keeps entries separate across comments and preserves raw citations", () => {
		const first = '@article{one,title={One {DNA} study},year={2024},doi={10.1234/test},volume={12},number={3},pages={20--30}}';
		const entries = parseBibtex(`${first}\n% between entries\n@article(two,title="Two",year=2025)\n% end`);
		expect(entries.map(({ id, title }) => [id, title])).toEqual([
			["two", "Two"], ["one", "One DNA study"],
		]);
		expect(formatCitations(entries[1]).bibtex).toBe(first);
		expect(formatCitations(entries[1]).apa).toContain("12(3), 20–30");
		expect(formatCitations(entries[1]).apa).toContain("https://doi.org/10.1234/test");
	});

	test("preserves organization authors, family particles, and suffixes", () => {
		const [paper] = parseBibtex('@article{names,title={Names},author={{Research and Development Group} and de la Cruz, Jr., Juan and Ada van Rossum},year=2025}');
		expect(paper.authors).toEqual(["Research and Development Group", "Juan de la Cruz, Jr.", "Ada van Rossum"]);
		expect(formatCitations(paper).apa).toContain("Research and Development Group, de la Cruz, J., Jr., & van Rossum, A.");
	});

	test("rejects malformed or duplicate records instead of publishing partial data", () => {
		expect(() => parseBibtex('@article{bad,title={Unclosed}')).toThrow(/bad|unterminated/i);
		expect(() => parseBibtex('@article{x,title={One}}\n@article{x,title={Two}}')).toThrow(/duplicate.*x/i);
		expect(() => parseBibtex('@article{missing,year=2025}')).toThrow(/title/i);
		expect(parseBibtex('% Empty library\n')).toEqual([]);
	});

	test("handles string macros, escaped delimiters, and comments between fields", () => {
		const [paper] = parseBibtex(String.raw`@string{venue = "Journal"}
		@article{escaped,
		  title = {A \{literal\} and {nested} title},
		  % a field comment with @ and }
		  journal = venue # " of Tests", year = 2025,
		  abstract = "A {braced} and \"quoted\" example"
		}
		% trailing comment`);
		expect(paper.venue).toBe("Journal of Tests");
		expect(paper.title).toBe("A {literal} and nested title");
		expect(paper.abstract).toContain('quoted');
		expect(formatCitations(paper).bibtex).toContain('@string{venue = "Journal"}');
		expect(() => parseBibtex('@article{x,title=undefinedmacro}')).toThrow(/undefined.*string/i);
	});
	test("parses nested braces in titles and abstracts", () => {
		const entries = parseBibtex(`
      @article{smith2025nested,
        title = {Keeping {AI} and {HCI} Capitalized},
        author = {Smith, Ada and Lee, Bo},
        journal = {Journal of Tests},
        year = {2025},
        abstract = {A study with {nested {brace}} content.},
        public = {yes}
      }
    `);

		expect(entries[0].title).toBe("Keeping AI and HCI Capitalized");
		expect(entries[0].abstract).toBe("A study with nested brace content.");
		expect(entries[0].authors).toEqual(["Ada Smith", "Bo Lee"]);
		expect(entries[0].category).toBe("Publication");
	});

	test("parses quoted values and working paper category", () => {
		const entries = parseBibtex(`
      @misc{doe2024quoted,
        title = "Quoted Field Paper",
        author = "Doe, Jane and Public, John Q.",
        year = "2024",
        public = "wp",
        url = "https://example.com/paper"
      }
    `);

		expect(entries[0].title).toBe("Quoted Field Paper");
		expect(entries[0].authors).toEqual(["Jane Doe", "John Q. Public"]);
		expect(entries[0].category).toBe("Working Paper");
		expect(entries[0].url).toBe("https://example.com/paper");
	});

	test("sorts entries by year descending", () => {
		const entries = parseBibtex(`
      @misc{old, title = {Old}, year = {2020}}
      @misc{new, title = {New}, year = {2026}}
    `);

		expect(entries.map((entry) => entry.id)).toEqual(["new", "old"]);
	});

	test("treats an omitted public field as other", () => {
		const [entry] = parseBibtex(`
      @misc{uncategorized, title = {Uncategorized}}
    `);

		expect(entry.category).toBe("Other");
	});

	test("selects only publications for the home page", () => {
		const entries = parseBibtex(`
      @misc{working, title = {Working}, year = {2026}, public = {wp}}
      @misc{published, title = {Published}, year = {2025}, public = {yes}}
      @misc{other, title = {Other}, year = {2024}}
    `);

		expect(getFeaturedPapers(3, entries).map((entry) => entry.id)).toEqual([
			"published",
		]);
	});

	test("formats copy-ready citations in the supported styles", () => {
		const [paper] = parseBibtex(`
      @inproceedings{smith2025citations,
        title = {A Practical Citation Test},
        author = {Smith, Ada and Lee, Bo},
        booktitle = {Proceedings of Testing},
        year = {2025},
        url = {https://example.com/paper}
      }
    `);
		const citations = formatCitations(paper);

		expect(citations.apa).toBe(
			"Smith, A., & Lee, B. (2025). A Practical Citation Test. Proceedings of Testing. https://example.com/paper",
		);
		expect(citations.chicago).toBe(
			'Smith, Ada, and Bo Lee. “A Practical Citation Test.” Proceedings of Testing (2025). https://example.com/paper',
		);
		expect(citations.harvard).toBe(
			"Smith, A. and Lee, B. (2025) ‘A Practical Citation Test’, Proceedings of Testing. Available at: https://example.com/paper.",
		);
		expect(citations.bibtex).toContain("@inproceedings{smith2025citations,");
	});

	test("keeps every demo publication aligned with the fictional profile", () => {
		for (const paper of getAllPapers()) {
			expect(paper.authors).toEqual([siteConfig.author]);
		}
	});
});
