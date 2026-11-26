/**
 * Report starter placeholders that survive into a real site. A placeholder `site`
 * URL silently points every canonical, sitemap entry and JSON-LD `@id` elsewhere.
 *
 *   node scripts/check/placeholders.mjs            warn, exit 0
 *   node scripts/check/placeholders.mjs --strict   exit 1 if anything is unset
 *
 * Warn is the default because this repo legitimately holds the placeholders.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const strict = process.argv.includes("--strict");

const PLACEHOLDER_URL = "https://example.com";
const STARTER_NAME = "Stratus";
const STARTER_LOGOS = [
  "/src/assets/images/logo/logo-light.svg",
  "/src/assets/images/logo/logo-dark.svg",
];
const STARTER_REPO = "CloudCannon/stratus-astro-documentation-template";

function read(relativePath) {
  try {
    return readFileSync(join(root, relativePath), "utf8");
  } catch {
    return null;
  }
}

function readJson(relativePath) {
  const raw = read(relativePath);

  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const breaking = [];
const branding = [];

const astroConfig = read("astro.config.mjs");

if (astroConfig?.includes(`site: "${PLACEHOLDER_URL}"`)) {
  breaking.push({
    file: "astro.config.mjs",
    detail: `site is still ${PLACEHOLDER_URL}`,
    why: "every canonical, sitemap entry and JSON-LD @id points at example.com",
  });
}

const seo = readJson("src/data/seo.json");

if (seo?.url === PLACEHOLDER_URL) {
  breaking.push({
    file: "src/data/seo.json",
    detail: `url is still ${PLACEHOLDER_URL}`,
    why: "Organization and WebSite structured data advertise the wrong domain",
  });
}
if (seo?.siteName === STARTER_NAME) {
  branding.push({ file: "src/data/seo.json", detail: `siteName is still "${STARTER_NAME}"` });
}
if (typeof seo?.titleFormat === "string" && seo.titleFormat.includes(STARTER_NAME)) {
  branding.push({
    file: "src/data/seo.json",
    detail: `titleFormat still appends "${STARTER_NAME}" to every page title`,
  });
}
if (typeof seo?.logoSource === "string" && STARTER_LOGOS.includes(seo.logoSource)) {
  branding.push({ file: "src/data/seo.json", detail: "logoSource is the starter logo" });
}

const announcement = readJson("src/data/announcementBar.json");

if (announcement?.enabled && announcement.text?.includes(STARTER_NAME)) {
  branding.push({
    file: "src/data/announcementBar.json",
    detail: `the announcement still mentions "${STARTER_NAME}"`,
  });
}

const pageTools = readJson("src/data/pageTools.json");

if (
  typeof pageTools?.repositoryUrl === "string" &&
  pageTools.repositoryUrl.includes(STARTER_REPO)
) {
  branding.push({
    file: "src/data/pageTools.json",
    detail: "repositoryUrl still points at the template's own repository",
  });
}

for (const file of ["src/data/header.json", "src/data/footer.json"]) {
  const data = readJson(file);

  if (!data) continue;
  const logos = [data.logoSource, data.logoAlternateSource].filter(
    (value) => typeof value === "string" && STARTER_LOGOS.includes(value)
  );

  if (logos.length) {
    branding.push({ file, detail: "logo still points at the starter logo" });
  }
  const stubSocials = (data.socials ?? []).filter((social) =>
    /^https:\/\/(www\.)?(github|x|twitter|linkedin|facebook|instagram)\.com\/?$/.test(
      social?.link ?? ""
    )
  );

  if (stubSocials.length) {
    branding.push({
      file,
      detail: `${stubSocials.length} social link${stubSocials.length === 1 ? "" : "s"} still point at a bare platform URL`,
    });
  }
}

if (!breaking.length && !branding.length) {
  console.log("✔ No starter placeholders found.");
  process.exit(0);
}

const label = strict ? "✖" : "!";

console.log("");
if (breaking.length) {
  console.log(`${label} Placeholders that break production URLs:`);
  for (const item of breaking) {
    console.log(`    ${item.file} — ${item.detail}`);
    console.log(`      ${item.why}`);
  }
  console.log("");
}
if (branding.length) {
  console.log(`${label} Starter branding still in place:`);
  for (const item of branding) {
    console.log(`    ${item.file} — ${item.detail}`);
  }
  console.log("");
}
console.log("  Run `npm run reset:starter` to set these, or edit the files directly.");
console.log("");

process.exit(strict && breaking.length ? 1 : 0);
