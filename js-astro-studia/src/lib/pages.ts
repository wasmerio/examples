import { getEntry, render } from 'astro:content';
import { SELF, shown } from '../consts.ts';

/*
 * The words the site prints, read from src/content/pages/. Templates hold the
 * layout; every sentence, label and link list a reader sees comes through
 * here. docs/Content.md, "Page text".
 */

/**
 * Load src/content/pages/<id>.md: its validated front matter, the rendered
 * Markdown body, and whether that body says anything at all. A missing file
 * fails the build naming the path, rather than rendering "undefined".
 */
export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing page content: src/content/pages/${id}.md`);
  const { Content } = await render(entry);
  const { data } = entry;
  /** One string out of a keyed group (`labels`, `more`, `intros`, …), required. */
  const text = (group: TextGroup, key: string) => need(data[group]?.[key], `${id}.${group}.${key}`);
  return {
    data,
    Content,
    hasBody: Boolean(entry.body?.trim()),
    text,
    /** The page's `title` and `description`, both required: spread it onto
        <Base {...page.meta()}>. */
    meta: () => ({
      title: need(data.title, `${id}.title`),
      description: need(data.description, `${id}.description`),
    }),
    /** `labels.<key>`: the short words a page places around its lists. */
    label: (key: string) => text('labels', key),
    /** `plurals.<key>`, picked for `count`; `{count}` shows `shown`, which
        defaults to the number itself (pass formatCount(n) for "1,234"). */
    plural: (key: string, count: number, shown: string | number = count) =>
      pluralize(need(data.plurals?.[key], `${id}.plurals.${key}`), count, shown),
  };
}

/** The front-matter groups that map a key to one string. */
type TextGroup = 'labels' | 'more' | 'intros' | 'statLabels' | 'linkLabels';

/** Fill `{key}` placeholders with computed values; an unknown key stays as typed. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in vars ? String(vars[key]) : placeholder,
  );
}

/** Pick the singular or plural form for `count`, and fill in `{count}` —
    with `shown`, when the number is displayed formatted. */
export function pluralize(
  forms: { one: string; other: string },
  count: number,
  shown: string | number = count,
) {
  return fill(count === 1 ? forms.one : forms.other, { count: shown });
}

/**
 * A field the page needs. The schema keeps every field optional because one
 * collection holds every page's shape, so a missing one is caught here, at
 * build time, naming the file and the field.
 */
export function need<T>(value: T | undefined, name: string): T {
  if (value === undefined) {
    throw new Error(`Missing page content field: ${name} (src/content/pages/)`);
  }
  return value;
}

/** Who the site is about, as text: the one place SELF's two halves are joined. */
export const selfName = `${SELF.first} ${SELF.last}`;

/**
 * The site-wide words in src/content/pages/site/site.md, with `{name}` filled
 * from SELF. Every page renders the nav and the head, so this is read on all of
 * them; Astro caches the entry, not the render.
 */
export async function siteText() {
  const { data } = await getPage('site/site');
  const vars = { name: selfName };
  return {
    title: fill(need(data.title, 'site/site.title'), vars),
    description: fill(need(data.description, 'site/site.description'), vars),
    brand: fill(need(data.brand, 'site/site.brand'), vars),
    brandPrompt: data.brandPrompt ?? '',
  };
}

/** The navigation rows in site/nav.md whose feature is on, in file order. */
export async function navLinks() {
  const { data } = await getPage('site/nav');
  return shown(need(data.links, 'site/nav.links')).map((link) => ({
    label: link.label,
    href: link.href,
    section: need(link.section, `site/nav.links[${link.label}].section`),
  }));
}
