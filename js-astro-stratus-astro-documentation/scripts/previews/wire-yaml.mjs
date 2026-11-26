/**
 * Wire `image: public/component-previews/<component>.svg` into a component's
 * `preview:` / `picker_preview:` blocks, idempotently and byte-preserving.
 * CloudCannon resolves the path against the source tree: a site URL
 * (`/component-previews/...`) shows "No preview available".
 */
import { readFileSync, writeFileSync } from "node:fs";

export function previewImagePath(component) {
  return `public/component-previews/${component}.svg`;
}

function findBlock(lines, blockName, indent) {
  const start = lines.findIndex((line) => new RegExp(`^${indent}${blockName}:\\s*$`).test(line));

  if (start === -1) return null;

  const dedented = new RegExp(`^\\s{0,${indent.length}}\\S`);
  let end = lines.length;

  for (let i = start + 1; i < lines.length; i++) {
    if (dedented.test(lines[i])) {
      end = i;
      break;
    }
  }

  const childIndentMatch = lines
    .slice(start + 1, end)
    .map((line) => line.match(/^(\s+)\S/))
    .find(Boolean);

  return { start, end, childIndent: childIndentMatch ? childIndentMatch[1] : `${indent}  ` };
}

function isDirectChild(line, childIndent, key) {
  return (
    new RegExp(`^${childIndent}${key}:`).test(line) && !/^\s/.test(line.slice(childIndent.length))
  );
}

/** `indent` is the block header's own: `""` in a structure-value file, `"  "` in snippets. */
export function ensureImageLine(lines, blockName, imagePath, indent = "") {
  const block = findBlock(lines, blockName, indent);

  if (!block) {
    // Before the first `_`-prefixed meta key, else at the end.
    const insertAt = lines.findIndex((line) => new RegExp(`^${indent}_[a-z]`).test(line));
    const created = [`${indent}${blockName}:`, `${indent}  image: ${imagePath}`];
    const at = insertAt === -1 ? lines.length : insertAt;

    return [...lines.slice(0, at), ...created, ...lines.slice(at)];
  }

  const { start, end, childIndent } = block;
  const newLine = `${childIndent}image: ${imagePath}`;

  // Direct children only: a deeper `image:` is `gallery.image`, owned by `ensureGalleryImage`.
  const imageIdx = lines.findIndex(
    (line, i) => i > start && i < end && isDirectChild(line, childIndent, "image")
  );

  if (imageIdx !== -1) {
    if (lines[imageIdx].replace(/^\s+image:\s*/, "").trim() === imagePath) {
      return lines;
    }
    const next = [...lines];

    next[imageIdx] = newLine;
    return next;
  }

  const iconIdx = lines.findIndex(
    (line, i) => i > start && i < end && isDirectChild(line, childIndent, "icon")
  );
  const insertAt = iconIdx !== -1 ? iconIdx : end;

  return [...lines.slice(0, insertAt), newLine, ...lines.slice(insertAt)];
}

/** Leaves a gallery that binds a content key (`image: { key: ... }` or a list) alone. */
export function ensureGalleryImage(lines, blockName, imagePath, indent = "") {
  const block = findBlock(lines, blockName, indent);

  if (!block) return lines;

  const { start, end, childIndent } = block;
  const galleryHeader = `${childIndent}gallery:`;
  const galleryIdx = lines.findIndex((line, i) => i > start && i < end && line === galleryHeader);
  const galleryChildIndent = `${childIndent}  `;
  const imageLine = `${galleryChildIndent}image: ${imagePath}`;
  const fitLine = `${galleryChildIndent}fit: cover`;

  if (galleryIdx === -1) {
    const galleryBlock = [`${childIndent}gallery:`, imageLine, fitLine];

    return [...lines.slice(0, end), ...galleryBlock, ...lines.slice(end)];
  }

  let galleryEnd = end;

  for (let i = galleryIdx + 1; i < end; i++) {
    if (!lines[i].startsWith(galleryChildIndent) && lines[i].trim() !== "") {
      galleryEnd = i;
      break;
    }
  }

  const imageIdx = lines.findIndex(
    (line, i) =>
      i > galleryIdx && i < galleryEnd && isDirectChild(line, galleryChildIndent, "image")
  );

  if (imageIdx !== -1) {
    const current = lines[imageIdx].replace(/^\s+image:\s*/, "").trim();

    if (current === "" || current.startsWith("-") || current.includes("key:")) {
      return lines;
    }
  }

  let next = [...lines];

  if (imageIdx === -1) {
    next = [...next.slice(0, galleryIdx + 1), imageLine, ...next.slice(galleryIdx + 1)];
    galleryEnd += 1;
  } else if (next[imageIdx] !== imageLine) {
    next[imageIdx] = imageLine;
  }

  const fitIdx = next.findIndex(
    (line, i) => i > galleryIdx && i < galleryEnd && isDirectChild(line, galleryChildIndent, "fit")
  );
  const imageAt = next.findIndex(
    (line, i) =>
      i > galleryIdx && i < galleryEnd + 1 && isDirectChild(line, galleryChildIndent, "image")
  );

  if (fitIdx === -1) {
    const insertAt = (imageAt !== -1 ? imageAt : galleryIdx) + 1;

    next = [...next.slice(0, insertAt), fitLine, ...next.slice(insertAt)];
  } else if (next[fitIdx] !== fitLine) {
    next[fitIdx] = fitLine;
  }

  return next.join("\n") === lines.join("\n") ? lines : next;
}

export function wirePreviewImage(component, absFile) {
  const original = readFileSync(absFile, "utf8");
  const imagePath = previewImagePath(component);
  let lines = original.split("\n");

  lines = ensureImageLine(lines, "preview", imagePath);
  lines = ensureImageLine(lines, "picker_preview", imagePath);
  lines = ensureGalleryImage(lines, "preview", imagePath);
  lines = ensureGalleryImage(lines, "picker_preview", imagePath);

  const updated = lines.join("\n");

  if (updated === original) return "unchanged";

  writeFileSync(absFile, updated);
  return "written";
}

/** False when the snippet's gallery already shows the author's own image (`image: key:`). */
export function snippetWantsPreviewImage(source) {
  return !/gallery:\s*\n\s+image:\s*\n\s+-?\s*key:/m.test(source);
}

/** Only `preview:` is wired — a snippet's `picker_preview` inherits from it. */
export function wireSnippetPreviewImage(component, absFile) {
  const original = readFileSync(absFile, "utf8");

  if (!snippetWantsPreviewImage(original)) return "skipped";

  const imagePath = previewImagePath(component);
  let lines = original.split("\n");

  lines = ensureImageLine(lines, "preview", imagePath, "  ");
  lines = ensureGalleryImage(lines, "preview", imagePath, "  ");

  const updated = lines.join("\n");

  if (updated === original) return "unchanged";

  writeFileSync(absFile, updated);
  return "written";
}
