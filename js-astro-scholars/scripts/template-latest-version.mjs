#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFile, appendFile } from "node:fs/promises";
import {
	isVersionGreater,
	selectLatestSemverTag,
} from "./lib/release-version.mjs";

const root = new URL("../", import.meta.url);
const config = JSON.parse(await readFile(new URL(".template-sync.json", root), "utf8"));
const currentVersion = (await readFile(new URL(".template-version", root), "utf8")).trim();

const output = execFileSync(
	"git",
	["ls-remote", "--tags", `https://github.com/${config.upstream}.git`],
	{ encoding: "utf8" },
);

const tags = [
	...new Set(
		output
			.split("\n")
			.map((line) => line.trim().split(/\s+/)[1])
			.filter(Boolean)
			.map((ref) => ref.replace(/^refs\/tags\//, "").replace(/\^\{\}$/, "")),
	),
];

const latest = selectLatestSemverTag(tags);
const updateAvailable = Boolean(
	latest && isVersionGreater(latest.version, currentVersion),
);

const lines = [
	`current_version=${currentVersion}`,
	`latest_version=${latest?.version ?? ""}`,
	`latest_tag=${latest?.tag ?? ""}`,
	`update_available=${updateAvailable ? "true" : "false"}`,
];

if (process.env.GITHUB_OUTPUT) {
	await appendFile(process.env.GITHUB_OUTPUT, `${lines.join("\n")}\n`);
} else {
	console.log(lines.join("\n"));
}
