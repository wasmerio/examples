import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { fingerprint } from "./fingerprint.ts";
import type { Problem } from "./problems.ts";

// content/.starter.json lists the starter values and files that setup must change, with the
// hash of each untouched file. Without it nothing is reported.
type Manifest = {
  values: { module: string; export: string; path: string; value: string }[];
  files: { path: string; sha256: string }[];
};

const dig = (data: unknown, path: string) =>
  path
    .split(".")
    .reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], data);

const isAsset = (path: string) => path.startsWith("content/public/");
// Covers and screenshots for the example posts and projects. They go with that content,
// so --allow-placeholders does not accept them.
const isDemo = (path: string) => path.startsWith("content/public/images/demo/");

const fileMessage = (path: string) =>
  isDemo(path)
    ? "is artwork for the example posts and projects. Delete it, along with anything that still links to it."
    : isAsset(path)
    ? "is still the placeholder file. Replace it with your own, or pass --allow-placeholders if you do not have one yet."
    : path.endsWith(".md")
      ? "is still the example page. Delete it or replace it with your own."
      : "still holds the example entries. Replace them with your own, or empty the list if you have none.";

// What --allow-placeholders still prints for a placeholder it accepts. The photo and social
// image show the example person, so a site must not go live with them.
const acceptedMessage = (path: string) =>
  /\.(png|jpe?g|webp|avif|svg)$/.test(path)
    ? "is still the placeholder image of the example person. Accepted for now; replace it before the site goes live."
    : "is still the placeholder file. Accepted for now; replace it before the site goes live.";

export async function checkStarter(root: string, { allowPlaceholders = false } = {}): Promise<Problem[]> {
  const manifestPath = join(root, "content/.starter.json");
  if (!existsSync(manifestPath)) return [];
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  const problems: Problem[] = [];

  for (const entry of manifest.values) {
    const file = `content/${entry.module}.ts`;
    const loaded = await import(pathToFileURL(join(root, file)).href).catch(() => null);
    if (dig(loaded?.[entry.export], entry.path) === entry.value) {
      problems.push({
        file,
        message: `${entry.export}.${entry.path} is still the starter value "${entry.value}". Replace it with your own.`,
      });
    }
  }

  for (const entry of manifest.files) {
    if (!existsSync(join(root, entry.path))) continue;
    if (fingerprint(entry.path, readFileSync(join(root, entry.path))) === entry.sha256) {
      if (allowPlaceholders && isAsset(entry.path) && !isDemo(entry.path)) {
        problems.push({ file: entry.path, message: acceptedMessage(entry.path), warning: true });
        continue;
      }
      problems.push({ file: entry.path, message: fileMessage(entry.path) });
    }
  }
  return problems;
}
