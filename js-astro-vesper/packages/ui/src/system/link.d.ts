/**
 * The design system start page, with BASE_URL, when the pages are on
 * (`astro dev`, or a build with ASTRONOMIC_SYSTEM=1). `null` otherwise, and
 * when the site does not use `astronomicSystem()`: render no link.
 */
export declare const systemLink: string | null;

/** Every design system page (Overview, Foundations, Components, Sections), or `null` when the pages are off. */
export declare const systemLinks: { label: string; href: string }[] | null;
