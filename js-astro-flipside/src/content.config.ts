import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// A calendar date. QUOTE dates in frontmatter (pubDate: "2026-07-13", as the
// demo posts do): a quoted value reaches this schema as a string and is
// round-trip checked, so a rolled-over date like "2026-02-30" (which
// new Date() shifts to Mar 2) or a garbage string fails the build instead of
// silently reordering the blog. An UNQUOTED yaml date is parsed to a Date by
// Astro's loader before Zod runs — js-yaml has already rolled an impossible
// one over by then and the original text is gone, so a Date input can only be
// accepted as-is (Astro can't override the "expected string" message on a
// string-only schema, so rejecting Date inputs would just confuse the common
// case). Net: quoting your dates buys validation; unquoted still works.
const calendarDate = z.union([z.string(), z.date()]).transform((v, ctx) => {
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) {
    ctx.addIssue({
      code: "custom",
      message: `not a valid date: ${JSON.stringify(v)}`,
    });
    return z.NEVER;
  }
  // A bare YYYY-MM-DD must name a real day. Anchored, so a full datetime with
  // an offset (which can legitimately land on a different UTC day) skips this.
  const ymd = typeof v === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (
    ymd &&
    (d.getUTCFullYear() !== +ymd[1] ||
      d.getUTCMonth() + 1 !== +ymd[2] ||
      d.getUTCDate() !== +ymd[3])
  ) {
    ctx.addIssue({
      code: "custom",
      message: `not a real calendar date: ${v}`,
    });
    return z.NEVER;
  }
  return d;
});

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1, "title cannot be empty"),
      // Optional: a post can omit it to drop the list-card blurb; the page's
      // meta description then falls back to SITE.description.
      description: z.string().optional(),
      pubDate: calendarDate,
      updatedDate: calendarDate.optional(),
      // A path relative to the post file (e.g. "./cover.jpg") — the image
      // ships through astro:assets (responsive srcset, webp, real
      // dimensions), same as relative images in the post body.
      heroImage: image().optional(),
      // Tags become /blog/tags/<tag>/ path segments, so #, ?, and / (URL
      // fragment/query/path-separator delimiters) would silently produce a
      // broken or wrong link rather than a build error — reject them here.
      // Each tag is trimmed first (so "music" and "music " can't survive as
      // two tags), which also turns a whitespace-only tag into "" and trips
      // the non-empty regex. The array-level transform then dedupes.
      tags: z
        .array(
          z
            .string()
            .transform((t) => t.trim())
            .pipe(
              z
                .string()
                .regex(
                  /^[^#?/]+$/,
                  "tags must be non-empty and can't contain #, ?, or / (breaks tag-page URLs)",
                ),
            ),
        )
        .default([])
        .transform((tags) => [...new Set(tags)]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
