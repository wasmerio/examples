#!/usr/bin/env node
/**
 * release.mjs — guarded local release flow for this repository.
 *
 * Why this exists:
 *   `pnpm version <type>` is useful, but too bare as a full release workflow.
 *   This script adds the usual local protections first, then delegates the
 *   actual version bump and tag creation to pnpm.
 *
 * Usage:
 *   pnpm release:patch
 *   pnpm release:minor
 *   pnpm release:major
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const packageJsonPath = join(root, "package.json");
const changelogPath = join(root, "CHANGELOG.md");
const releaseType = process.argv[2];
const allowedTypes = new Set(["patch", "minor", "major"]);

if (!allowedTypes.has(releaseType)) {
  fail("Usage: node scripts/release.mjs <patch|minor|major>");
}

assertOnMainBranch();
assertCleanWorkingTree();
assertHasUnreleasedSection();

const currentVersion = readVersion();
const nextVersion = bumpVersion(currentVersion, releaseType);

run("pnpm check");
run("pnpm build");

await confirmRelease(currentVersion, nextVersion, releaseType);
runVersion(releaseType);

console.log(`
Release created locally.

Next steps:
  git push && git push --tags

That tag push will trigger the GitHub release workflow.
`);

function run(command) {
  execSync(command, { cwd: root, stdio: "inherit" });
}

function runVersion(type) {
  // `pnpm run` injects npm_config_* variables into child processes.
  // Some of those keys are pnpm-specific and trigger noisy npm warnings when
  // `pnpm version` delegates to npm internals. Strip them for the version step.
  const cleanEnv = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => {
      if (key.startsWith("npm_config_")) return false;
      if (key.startsWith("NPM_CONFIG_")) return false;
      return true;
    }),
  );

  execSync(`pnpm version ${type}`, {
    cwd: root,
    env: cleanEnv,
    stdio: "inherit",
  });
}

function capture(command) {
  return execSync(command, { cwd: root, encoding: "utf8" }).trim();
}

function fail(message) {
  console.error(`\nRelease aborted: ${message}\n`);
  process.exit(1);
}

function assertOnMainBranch() {
  const branch = capture("git rev-parse --abbrev-ref HEAD");
  if (branch !== "main") {
    fail(`releases must be cut from 'main' (current branch: '${branch}')`);
  }
}

function assertCleanWorkingTree() {
  const status = capture("git status --porcelain");
  if (status.length > 0) {
    fail("working tree is not clean; commit, stash, or remove local changes first");
  }
}

function assertHasUnreleasedSection() {
  const changelog = readFileSync(changelogPath, "utf8");
  if (!changelog.includes("## [Unreleased]")) {
    fail("CHANGELOG.md must contain an '## [Unreleased]' section before releasing");
  }
}

function readVersion() {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  return pkg.version;
}

function bumpVersion(version, type) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    fail(`package.json version '${version}' is not a simple semver version`);
  }

  const [major, minor, patch] = match.slice(1).map(Number);

  if (type === "patch") {
    return `${major}.${minor}.${patch + 1}`;
  }

  if (type === "minor") {
    return `${major}.${minor + 1}.0`;
  }

  return `${major + 1}.0.0`;
}

async function confirmRelease(currentVersion, nextVersion, type) {
  const rl = createInterface({ input, output });
  const answer = await rl.question(
    `About to release ${type} version ${currentVersion} -> ${nextVersion}. Continue? [y/N] `,
  );
  rl.close();

  if (!/^(y|yes)$/i.test(answer.trim())) {
    fail("release cancelled by user");
  }
}
