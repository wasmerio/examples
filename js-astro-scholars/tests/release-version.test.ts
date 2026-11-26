import { describe, expect, test } from "vitest";
import {
	parseSemverTag,
	isVersionGreater,
	selectLatestSemverTag,
	versionsMatch,
} from "../scripts/lib/release-version.mjs";

describe("release version helpers", () => {
	test("parses v-prefixed semver tags", () => {
		expect(parseSemverTag("v1.2.3")).toEqual({
			major: 1,
			minor: 2,
			patch: 3,
			version: "1.2.3",
			tag: "v1.2.3",
		});
	});

	test("rejects non-release tags", () => {
		expect(parseSemverTag("1.2.3")).toBeNull();
		expect(parseSemverTag("v1.2")).toBeNull();
		expect(parseSemverTag("v1.2.3-beta.1")).toBeNull();
	});

	test("selects the highest semver tag", () => {
		expect(selectLatestSemverTag(["v0.2.0", "v0.10.0", "v0.3.2"])?.tag).toBe(
			"v0.10.0",
		);
	});

	test("detects whether a candidate version is newer", () => {
		expect(isVersionGreater("0.4.0", "0.3.9")).toBe(true);
		expect(isVersionGreater("0.3.0", "0.3.0")).toBe(false);
		expect(isVersionGreater("0.2.9", "0.3.0")).toBe(false);
	});

	test("compares package, template, changelog, and tag versions", () => {
		expect(
			versionsMatch({
				packageVersion: "0.3.0",
				templateVersion: "0.3.0",
				changelogVersion: "0.3.0",
				tagName: "v0.3.0",
			}),
		).toEqual({ ok: true, errors: [] });
	});

	test("reports every mismatched release version", () => {
		const result = versionsMatch({
			packageVersion: "0.3.0",
			templateVersion: "0.2.0",
			changelogVersion: "0.4.0",
			tagName: "v0.5.0",
		});

		expect(result.ok).toBe(false);
		expect(result.errors).toEqual([
			".template-version 0.2.0 does not match package.json 0.3.0",
			"CHANGELOG.md 0.4.0 does not match package.json 0.3.0",
			"tag v0.5.0 does not match package.json 0.3.0",
		]);
	});
});
