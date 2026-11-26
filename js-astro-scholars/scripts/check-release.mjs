#!/usr/bin/env node
import { readReleaseState, versionsMatch } from "./lib/release-version.mjs";

function readTagName() {
	const index = process.argv.indexOf("--tag");
	if (index >= 0) return process.argv[index + 1];
	return process.env.GITHUB_REF_NAME;
}

const tagName = readTagName();

if (!tagName) {
	console.error("Missing release tag. Pass --tag vX.Y.Z or set GITHUB_REF_NAME.");
	process.exit(1);
}

const state = await readReleaseState(new URL("../", import.meta.url), tagName);
const result = versionsMatch(state);

if (!result.ok) {
	console.error("Release version check failed:");
	for (const error of result.errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(`Release version check passed for ${tagName}.`);
