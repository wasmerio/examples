/**
 * Strip the demo content and make a fresh clone your own site. Must set every
 * value scripts/check/placeholders.mjs looks for.
 *
 *   npm run reset:starter               interactive
 *   npm run reset:starter -- --dry-run  print the plan, write nothing
 *
 * Deletes files. Guarded on a clean git tree so `git checkout .` is always an undo.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmdirSync, rmSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const dryRun = process.argv.includes("--dry-run");
const rl = createInterface({ input: process.stdin, output: process.stdout });

const changes = [];
const written = new Set();

function abs(relativePath) {
  return join(root, relativePath);
}

function record(message) {
  changes.push(message);
}

function writeText(relativePath, contents) {
  if (dryRun) return;
  writeFileSync(abs(relativePath), contents);
  written.add(relativePath);
}

// The templates can't match .prettierrc by hand (e.g. `*.md` wants single
// quotes, but yaml() emits double), so a fresh reset would fail `npm run check`.
async function formatWritten() {
  for (const relativePath of written) {
    const file = abs(relativePath);
    const options = await prettier.resolveConfig(file);
    const source = readFileSync(file, "utf8");

    writeFileSync(file, await prettier.format(source, { ...options, filepath: file }));
  }
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(abs(relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  writeText(relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function remove(relativePath, recursive = false) {
  if (!dryRun) rmSync(abs(relativePath), { force: true, recursive });
}

/** YAML double-quoted scalar. JSON's string escaping is a valid subset. */
function yaml(value) {
  return JSON.stringify(value);
}

function removeEmptyDirs(relativePath) {
  if (dryRun) return;
  const dirs = readdirSync(abs(relativePath), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(entry.parentPath, entry.name))
    .sort((a, b) => b.length - a.length);

  for (const dir of dirs) {
    if (readdirSync(dir).length === 0) rmdirSync(dir);
  }
}

function isGitClean() {
  try {
    const status = execFileSync("git", ["status", "--porcelain"], {
      cwd: root,
      encoding: "utf8",
    });

    return status.trim() === "";
  } catch {
    return true;
  }
}

// Not `rl.question()`: it drops piped stdin lines that arrive before the next
// question registers a listener. The async iterator pauses between reads.
const lines = rl[Symbol.asyncIterator]();

async function prompt(text) {
  process.stdout.write(text);
  const { value, done } = await lines.next();

  if (done) {
    process.stdout.write("\n");
    return null;
  }
  return value;
}

function bail() {
  console.log("\n  Canceled — nothing was written.\n");
  rl.close();
  process.exit(1);
}

async function ask(question, fallback = "") {
  const suffix = fallback ? ` (${fallback})` : "";
  const answer = await prompt(`  ${question}${suffix}: `);

  if (answer === null) bail();
  return answer.trim() || fallback;
}

async function confirm(question, defaultYes = true) {
  const answer = await prompt(`  ${question} ${defaultYes ? "(Y/n)" : "(y/N)"} `);

  if (answer === null) bail();
  const normalized = answer.trim().toLowerCase();

  if (!normalized) return defaultYes;
  return normalized.startsWith("y");
}

function normalizeUrl(input) {
  let value = input.trim().replace(/\/+$/, "");

  if (!value) return null;
  if (!/^https?:\/\//.test(value)) value = `https://${value}`;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function firstDoc(siteName) {
  return `---
title: Introduction
description: ${yaml(`What ${siteName} is, and who it is for.`)}
group: Getting started
order: 1
---

Replace this with the first thing a reader needs to know.
`;
}

function homepage(siteName) {
  return `---
_schema: default
title: Overview
description: ${yaml(`Welcome to ${siteName}.`)}
pageSections:
  - _component: page-sections/heroes/hero-center
    eyebrow: ""
    heading: ${yaml(siteName)}
    subtext: Replace this with a sentence about what you document.
    alignmentHorizontal: start
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Get started
        hideText: false
        link: "/introduction/"
        iconName: ""
        iconColor: default
        iconPosition: before
        variant: primary
        size: md
    maxContentWidth: 2xl
    paddingHorizontal: lg
    paddingVertical: 4xl
    colorScheme: inherit
    backgroundColor: base
    background:
      type: image
      positionVertical: top
      positionHorizontal: center
      priority: false
      imageSource: ""
      imageAlt: ""
      videoSource: null
      overlay: 0
---
`;
}

console.log("\n  Reset the Stratus template\n");
if (dryRun) console.log("  Dry run — nothing will be written.\n");

if (!dryRun && !isGitClean()) {
  console.log("  Your git working tree has uncommitted changes.");
  console.log("  This script deletes files; commit or stash first so you can undo.\n");
  const proceed = await confirm("Continue anyway?", false);

  if (!proceed) {
    rl.close();
    process.exit(1);
  }
  console.log("");
}

const siteName = await ask("Site name", "");

if (!siteName) {
  console.log("\n  A site name is required.\n");
  rl.close();
  process.exit(1);
}

let siteUrl = null;

while (!siteUrl) {
  siteUrl = normalizeUrl(await ask("Production URL", ""));
  if (!siteUrl) console.log("  Enter a valid URL, e.g. https://acme.com");
}

const docFiles = existsSync(abs("src/content/docs"))
  ? readdirSync(abs("src/content/docs"), { recursive: true })
      .filter((file) => file.endsWith(".mdx"))
      .sort()
  : [];

const removeDocs = docFiles.length
  ? await confirm(`Remove the demo documentation pages (${docFiles.length})?`)
  : false;
const releaseFiles = existsSync(abs("src/content/changelog"))
  ? readdirSync(abs("src/content/changelog")).filter((file) => file.endsWith(".md"))
  : [];

const removeReleases = releaseFiles.length
  ? await confirm(`Remove the template's changelog releases (${releaseFiles.length})?`)
  : false;
const removePages = await confirm("Reset the overview page?");
const resetBranding = await confirm("Reset header/footer/SEO branding?");

const configPath = "astro.config.mjs";
const config = readFileSync(abs(configPath), "utf8");
const nextConfig = config.replace(/site: "https:\/\/example\.com",.*$/m, `site: ${yaml(siteUrl)},`);

if (nextConfig !== config) {
  writeText(configPath, nextConfig);
  record(`${configPath}   site → ${siteUrl}`);
}

const seo = readJson("src/data/seo.json");

seo.siteName = siteName;
seo.url = siteUrl;
seo.titleFormat = `{title} | ${siteName}`;
if (resetBranding) {
  seo.description = `Welcome to ${siteName}.`;
  seo.logoSource = "";
  seo.faviconSource = "";
  seo.faviconIcoSource = "";
}
writeJson("src/data/seo.json", seo);
record(
  `src/data/seo.json  siteName, url, titleFormat${resetBranding ? ", description, logo, favicons" : ""}`
);

if (resetBranding) {
  const brandFiles = ["public/favicon.svg", "public/favicon.ico", "siteicon.png"].filter((file) =>
    existsSync(abs(file))
  );

  for (const file of brandFiles) remove(file);
  if (brandFiles.length) record(`removed the template's icons: ${brandFiles.join(", ")}`);
}

if (removeDocs) {
  for (const file of docFiles) remove(`src/content/docs/${file}`);
  removeEmptyDirs("src/content/docs");
  writeText("src/content/docs/introduction.mdx", firstDoc(siteName));
  record(
    `removed ${docFiles.length} demo page${docFiles.length === 1 ? "" : "s"}, wrote a blank Introduction`
  );
}

if (removeReleases) {
  for (const file of releaseFiles) remove(`src/content/changelog/${file}`);
  record(
    `removed ${releaseFiles.length} template release${releaseFiles.length === 1 ? "" : "s"} from src/content/changelog/`
  );
}

if (removePages) {
  writeText("src/content/pages/index.md", homepage(siteName));
  record("reset the overview page to a blank hero");
}

if (resetBranding) {
  const header = readJson("src/data/header.json");

  header.logoSource = "";
  header.logoAlternateSource = "";
  header.logoAlt = siteName;
  header.topbarLinks = [];
  writeJson("src/data/header.json", header);
  record("src/data/header.json  branding cleared");

  const sidebar = readJson("src/data/sidebar.json");

  // Groups match page frontmatter by name; the demo's would point at unused groups.
  sidebar.navGroups = [{ name: "Getting started", collapsed: false }];
  writeJson("src/data/sidebar.json", sidebar);
  record("src/data/sidebar.json  nav groups reduced to one");

  const pageTools = readJson("src/data/pageTools.json");

  pageTools.repositoryUrl = "";
  writeJson("src/data/pageTools.json", pageTools);
  record("src/data/pageTools.json  repository URL cleared");

  const footer = readJson("src/data/footer.json");

  footer.links = [];
  footer.socials = [];
  footer.footerText = `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  writeJson("src/data/footer.json", footer);
  record("src/data/footer.json  links and socials emptied, copyright set");

  const announcement = readJson("src/data/announcementBar.json");

  announcement.enabled = false;
  announcement.text = "";
  writeJson("src/data/announcementBar.json", announcement);
  record("src/data/announcementBar.json  disabled and cleared");

  const redirects = readJson("src/data/redirects.json");

  redirects.routes = [];
  writeJson("src/data/redirects.json", redirects);
  record("src/data/redirects.json  demo redirect removed");
}

rl.close();
await formatWritten();

console.log("");
for (const change of changes) console.log(`  ✔ ${change}`);
console.log("");

if (dryRun) {
  console.log("  Dry run — no files were written.\n");
} else {
  console.log("  Next:");
  if (resetBranding)
    console.log("    • Add your logo, favicons and CloudCannon site icon (siteicon.png)");
  console.log("    • Write your description — src/data/seo.json");
  console.log("    • Set your colors and fonts — src/styles/themes/, site-fonts.mjs");
  console.log("    • npm run dev\n");
}
