import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { parse } from "yaml";

if (process.argv.includes("--help")) {
  console.log(
    "Usage: npm run og:generate\nGenerate public/og-image.jpg (1200 × 630) from project YAML and dark-theme colors. This replaces that generated image; it does not change seo.image.",
  );
  process.exit(0);
}
if (process.argv.slice(2).length)
  throw new Error("Unknown arguments. Use --help.");

const root = new URL("../", import.meta.url);
const project = parse(
  await readFile(new URL("src/content/project/main.yaml", root), "utf8"),
);
const css = await readFile(new URL("src/styles/base.css", root), "utf8");
const token = (name, fallback, last = false) => {
  const matches = [
    ...css.matchAll(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`, "g")),
  ];
  return (last ? matches.at(-1) : matches[0])?.[1] ?? fallback;
};
const accent = token("--brand-500", "#f0887c", true);
const background = token("--dark-900", "#191a1d");
const foreground = token("--light-100", "#fcfbf9");
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
const text = (key) => {
  if (typeof project[key] !== "string" || !project[key].trim())
    throw new Error(`Missing project.${key}`);
  return project[key].trim();
};
const wrap = (value, width) => {
  const lines = [];
  let line = "";
  for (const word of value.split(/\s+/)) {
    if (line && `${line} ${word}`.length > width) {
      lines.push(line);
      line = "";
    }
    line += `${line ? " " : ""}${word}`;
  }
  if (line) lines.push(line);
  return lines;
};
const headline = text("headline");
const accentLine = text("headlineAccent");
const intro = wrap(text("intro"), 78);
if (intro.length > 3)
  throw new Error(
    "Hero intro is too long for the OG card. Shorten it to at most three lines (about 230 characters).",
  );
if (Math.max(headline.length, accentLine.length) > 54)
  throw new Error(
    "Hero headline is too long for the OG card. Keep each line under 55 characters.",
  );
const titleSize = Math.min(88, Math.floor(1040 / (headline.length * 0.58)));
const accentSize = Math.min(94, Math.floor(1040 / (accentLine.length * 0.54)));
const shortName = text("shortName");
if (shortName.length > 44)
  throw new Error(
    "Use a shortName of at most 44 characters for the OG wordmark.",
  );
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".22"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="${foreground}" stroke-opacity=".045"/></pattern>
</defs>
<rect width="1200" height="630" fill="${background}"/>
<rect width="1200" height="630" fill="url(#grid)"/>
<ellipse cx="945" cy="205" rx="600" ry="430" fill="url(#glow)"/>
<rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="${foreground}" stroke-opacity=".15"/>
<circle cx="69" cy="82" r="5" fill="${accent}"/>
<text x="88" y="93" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="32" letter-spacing="-1">${escape(shortName)}.</text>
<text x="64" y="198" fill="${accent}" font-family="monospace" font-size="15" letter-spacing="2">${escape(text("eyebrow"))}</text>
<text x="60" y="296" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" letter-spacing="-3">${escape(headline)}</text>
<text x="60" y="391" fill="${accent}" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${accentSize}" letter-spacing="-2">${escape(accentLine)}</text>
${intro.map((line, i) => `<text x="64" y="453" dy="${i * 31}" fill="${foreground}" fill-opacity=".72" font-family="Arial, Helvetica, sans-serif" font-size="23">${escape(line)}</text>`).join("\n")}
<path d="M64 549H1136" stroke="${foreground}" stroke-opacity=".15"/>
<text x="64" y="582" fill="${foreground}" fill-opacity=".65" font-family="monospace" font-size="14">${escape(text("name"))}</text>
<text x="1136" y="582" text-anchor="end" fill="${accent}" font-family="monospace" font-size="14">${escape(text("license"))}</text>
</svg>`;
const output = new URL("public/og-image.jpg", root);
await writeFile(
  output,
  await sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true }).toBuffer(),
);
const metadata = await sharp(fileURLToPath(output)).metadata();
console.log(
  `Generated public/og-image.jpg: ${metadata.width} × ${metadata.height}. Review the image and update seo.imageAlt when copy changes.`,
);
if (project.seo?.image && project.seo.image !== "/og-image.jpg")
  console.log(
    `Note: seo.image still points to ${project.seo.image}. The generated file is not selected automatically.`,
  );
