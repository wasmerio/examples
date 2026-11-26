import { readFile } from "node:fs/promises";

export function parseSemverTag(tag) {
	const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(String(tag).trim());
	if (!match) return null;

	const major = Number(match[1]);
	const minor = Number(match[2]);
	const patch = Number(match[3]);
	const version = `${major}.${minor}.${patch}`;

	return {
		major,
		minor,
		patch,
		version,
		tag: `v${version}`,
	};
}

export function parseSemverVersion(version) {
	const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(version).trim());
	if (!match) return null;

	const major = Number(match[1]);
	const minor = Number(match[2]);
	const patch = Number(match[3]);
	return {
		major,
		minor,
		patch,
		version: `${major}.${minor}.${patch}`,
		tag: `v${major}.${minor}.${patch}`,
	};
}

export function compareSemver(a, b) {
	for (const key of ["major", "minor", "patch"]) {
		if (a[key] > b[key]) return 1;
		if (a[key] < b[key]) return -1;
	}
	return 0;
}

export function selectLatestSemverTag(tags) {
	return tags
		.map(parseSemverTag)
		.filter(Boolean)
		.sort(compareSemver)
		.at(-1) ?? null;
}

export function isVersionGreater(candidateVersion, currentVersion) {
	const candidate = parseSemverVersion(candidateVersion);
	const current = parseSemverVersion(currentVersion);
	if (!candidate || !current) return false;
	return compareSemver(candidate, current) > 0;
}

export function extractLatestChangelogVersion(changelog) {
	const match = /^##\s+\[?v?(\d+\.\d+\.\d+)\]?/m.exec(changelog);
	return match?.[1] ?? null;
}

export function versionsMatch({
	packageVersion,
	templateVersion,
	changelogVersion,
	tagName,
}) {
	const expectedTag = `v${packageVersion}`;
	const errors = [];

	if (templateVersion !== packageVersion) {
		errors.push(
			`.template-version ${templateVersion} does not match package.json ${packageVersion}`,
		);
	}

	if (changelogVersion !== packageVersion) {
		errors.push(
			`CHANGELOG.md ${changelogVersion} does not match package.json ${packageVersion}`,
		);
	}

	if (tagName !== expectedTag) {
		errors.push(`tag ${tagName} does not match package.json ${packageVersion}`);
	}

	if (!parseSemverTag(expectedTag)) {
		errors.push(`package.json ${packageVersion} is not a valid SemVer release`);
	}

	return {
		ok: errors.length === 0,
		errors,
	};
}

export async function readReleaseState(rootUrl, tagName) {
	const packageJson = JSON.parse(
		await readFile(new URL("package.json", rootUrl), "utf8"),
	);
	const templateVersion = (
		await readFile(new URL(".template-version", rootUrl), "utf8")
	).trim();
	const changelog = await readFile(new URL("CHANGELOG.md", rootUrl), "utf8");

	return {
		packageVersion: packageJson.version,
		templateVersion,
		changelogVersion: extractLatestChangelogVersion(changelog),
		tagName,
	};
}
