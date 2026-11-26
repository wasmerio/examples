import { slugifyStr } from "./slugify";

/**
 * A valid CSS <custom-ident> for view-transition-name: an invalid one is
 * silently ignored by the browser.
 */
export const toTransitionName = (str: string): string => {
  const base = slugifyStr(str.replaceAll(".", "-"));
  let result = base
    .replace(
      /[^\x00-\x7F]/gu,
      c => "u" + c.codePointAt(0)!.toString(16).padStart(6, "0")
    )
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (/^\d/.test(result)) result = "p-" + result;
  if (!result) result = "post";
  return result;
};
