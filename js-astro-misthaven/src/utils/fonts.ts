import type { FontDefinition } from "@/types/fontConfig";

type FontSource = FontDefinition & { readonly src: string };

function getFontSources(fonts: readonly FontDefinition[]): FontSource[] {
  return fonts.filter((font): font is FontSource => Boolean(font.src?.trim()));
}

function cssFamilyName(family: string) {
  return family.includes(" ") ? JSON.stringify(family) : family;
}

export function getFontFamily(fonts: readonly FontDefinition[]) {
  return fonts.map(({ family }) => cssFamilyName(family)).join(", ");
}

export function getFontFaceCss(fonts: readonly FontDefinition[]) {
  return getFontSources(fonts)
    .map(
      ({ family, src }) =>
        `@font-face{font-family:${JSON.stringify(family)};src:url(${JSON.stringify(src)});font-weight:100 900;font-style:normal;font-display:swap}`,
    )
    .join("\n");
}

export function getFontPreconnects(fonts: readonly FontDefinition[]) {
  return [
    ...new Set(
      getFontSources(fonts)
        .map(({ src }) => {
          if (!/^https?:\/\//.test(src)) return null;
          return new URL(src).origin;
        })
        .filter((origin): origin is string => Boolean(origin)),
    ),
  ];
}
