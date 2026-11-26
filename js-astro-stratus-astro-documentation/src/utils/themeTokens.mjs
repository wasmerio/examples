/**
 * Turns `src/data/theme.json` into custom properties on `<html>`. Every property is
 * optional: `styles/themes/*.css` must read each with a fallback, or a missing value
 * silently blanks the token. Set on `<html>`, never a selector, so a section pinning its
 * own `data-theme` inherits them. Keep dependency-free: it runs at build and in the editor.
 */

const INK = [8, 9, 11]; // --black
const PAPER = [255, 255, 255]; // --white

const GROUND = { light: PAPER, dark: INK };

/** Parse `#rgb` / `#rrggbb` (hash optional) into RGB, or null. */
export function parseHex(value) {
  if (typeof value !== "string") return null;

  const hex = value.trim().replace(/^#/, "");

  if (/^[\da-f]{3}$/i.test(hex)) {
    return [...hex].map((c) => parseInt(c + c, 16));
  }

  if (/^[\da-f]{6}$/i.test(hex)) {
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }

  return null;
}

function toHex(rgb) {
  return `#${rgb
    .map((c) =>
      Math.round(Math.min(255, Math.max(0, c)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

/** Blend `rgb` with `ground`, `weight` being the share kept of `rgb`. */
function mix(rgb, ground, weight) {
  return rgb.map((c, i) => c * weight + ground[i] * (1 - weight));
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;

    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function readableOn(rgb) {
  return toHex(luminance(rgb) > 0.42 ? INK : PAPER);
}

const SCHEMES = ["light", "dark"];
const capitalize = (word) => word[0].toUpperCase() + word.slice(1);

/**
 * @param {Record<string, unknown>} theme the `theme` object from theme.json
 * @returns {Record<string, string>} custom properties to set on `<html>`
 */
export function themeCustomProperties(theme = {}) {
  const properties = {};

  for (const scheme of SCHEMES) {
    const ground = GROUND[scheme];
    const shade = scheme === "light" ? INK : PAPER;

    const accent = parseHex(theme[`accent${capitalize(scheme)}`]);

    if (accent) {
      properties[`--accent-${scheme}`] = toHex(accent);
      properties[`--accent-${scheme}-hover`] = toHex(mix(accent, shade, 0.82));
      properties[`--accent-${scheme}-on`] = readableOn(accent);
      properties[`--accent-${scheme}-surface`] = toHex(mix(accent, ground, 0.08));
      properties[`--accent-${scheme}-border`] = toHex(mix(accent, ground, 0.3));
    }

    const brand = parseHex(theme[`brand${capitalize(scheme)}`]);

    if (brand) {
      properties[`--brand-${scheme}`] = toHex(brand);
      properties[`--brand-${scheme}-on`] = readableOn(brand);
      properties[`--brand-${scheme}-muted`] = toHex(mix(brand, ground, 0.85));
      properties[`--brand-${scheme}-subtle`] = toHex(mix(brand, ground, 0.62));
    }
  }

  const radius = Number(theme.radius);

  if (theme.radius !== "" && theme.radius != null && Number.isFinite(radius) && radius >= 0) {
    properties["--radius-base"] = `${radius}px`;
  }

  return properties;
}

export function themeStyleAttribute(theme) {
  return Object.entries(themeCustomProperties(theme))
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}
