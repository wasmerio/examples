import { describe, expect, test } from "bun:test";
import {
	buildProjectFromUrl,
	type GHRepo,
	parseRepoUrl,
} from "./lib/project.ts";

describe("parseRepoUrl", () => {
	test("parses canonical GitHub URLs", () => {
		expect(parseRepoUrl("https://github.com/owner/repo")).toEqual({
			owner: "owner",
			repo: "repo",
		});
	});

	test("strips .git suffix", () => {
		expect(parseRepoUrl("https://github.com/owner/repo.git")).toEqual({
			owner: "owner",
			repo: "repo",
		});
	});

	test("strips trailing slash", () => {
		expect(parseRepoUrl("https://github.com/owner/repo/")).toEqual({
			owner: "owner",
			repo: "repo",
		});
	});

	test("returns null for non-GitHub URLs", () => {
		expect(parseRepoUrl("https://gitlab.com/owner/repo")).toBeNull();
		expect(parseRepoUrl("not-a-url")).toBeNull();
		expect(parseRepoUrl("https://github.com/only-owner")).toBeNull();
	});
});

describe("buildProjectFromUrl", () => {
	const mockRepo: GHRepo = {
		full_name: "owner/repo",
		name: "repo",
		description: "A short description",
		html_url: "https://github.com/owner/repo",
		homepage: "https://example.com",
		stargazers_count: 1500,
		size: 2048,
		updated_at: "2024-01-15T10:00:00Z",
	};

	test("formats stars in k", () => {
		const project = buildProjectFromUrl(mockRepo, mockRepo.html_url);
		expect(project.stars).toBe("★ 1.5k");
	});

	test("formats zero stars as 1", () => {
		const project = buildProjectFromUrl(
			{ ...mockRepo, stargazers_count: 0 },
			mockRepo.html_url,
		);
		expect(project.stars).toBe("★ 1");
	});

	test("truncates long descriptions with ellipsis", () => {
		const longDesc = "a".repeat(120);
		const project = buildProjectFromUrl(
			{ ...mockRepo, description: longDesc },
			mockRepo.html_url,
		);
		expect(project.description.length).toBeLessThanOrEqual(90);
		expect(project.description.endsWith("…")).toBe(true);
	});

	test("uses provided url as-is", () => {
		const project = buildProjectFromUrl(
			mockRepo,
			"https://github.com/owner/repo",
		);
		expect(project.url).toBe("https://github.com/owner/repo");
		expect(project.repo).toBe("github.com/owner/repo");
	});

	test("includes homepage when set", () => {
		const project = buildProjectFromUrl(mockRepo, mockRepo.html_url);
		expect(project.homepage).toBe("https://example.com");
	});

	test("omits homepage when null/empty", () => {
		const project = buildProjectFromUrl(
			{ ...mockRepo, homepage: null },
			mockRepo.html_url,
		);
		expect(project.homepage).toBeUndefined();
	});
});
