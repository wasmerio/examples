import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { migrateLegacyContent } from "../scripts/migrate-legacy-content.mjs";

describe("legacy project and teaching migration", () => {
	test("creates content entries once and preserves the YAML sources", async () => {
		const root = await mkdtemp(join(tmpdir(), "scholars-content-migration-"));
		const dataDir = join(root, "src/data");
		const projectsYaml = `
- title: Legacy Project
  status: active
  period: 2022 — Present
  description: Personal project summary.
  tech:
    - Astro
  url: https://example.com/project
- title: Undated Project
  description: Project without a legacy period.
  tech: []
`;
		const teachingYaml = `
current:
  - term: Autumn 2025
    modules:
      - title: Course Title
        code: INFO 500
        summary: Personal course summary.
        tags:
          - studio
        link:
          label: Syllabus
          href: https://example.com/syllabus
past: []
`;

		try {
			await mkdir(dataDir, { recursive: true });
			await Promise.all([
				writeFile(join(dataDir, "projects.yml"), projectsYaml),
				writeFile(join(dataDir, "teaching.yml"), teachingYaml),
			]);

			const result = await migrateLegacyContent(root);
			expect(result).toEqual({
				projects: { status: "migrated", count: 2 },
				teaching: { status: "migrated", count: 1 },
			});

			const projectPath = join(root, "src/content/projects/legacy-project.md");
			const teachingPath = join(
				root,
				"src/content/teaching/course-title-autumn-2025.md",
			);
			expect(await readFile(projectPath, "utf8")).toContain(
				"summary: Personal project summary.",
			);
			expect(await readFile(projectPath, "utf8")).toContain(
				"href: https://example.com/project",
			);
			expect(
				await readFile(
					join(root, "src/content/projects/undated-project.md"),
					"utf8",
				),
			).toContain("status: unspecified");
			expect(await readFile(teachingPath, "utf8")).toContain("status: current");
			expect(await readFile(teachingPath, "utf8")).toContain(
				"href: https://example.com/syllabus",
			);
			expect(await readFile(join(dataDir, "projects.yml"), "utf8")).toBe(
				projectsYaml,
			);

			await writeFile(projectPath, "personal edit\n");
			const rerun = await migrateLegacyContent(root);
			expect(rerun.projects.status).toBe("existing");
			expect(await readFile(projectPath, "utf8")).toBe("personal edit\n");
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	});
});
