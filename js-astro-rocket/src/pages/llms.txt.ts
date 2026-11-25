import type { APIRoute } from 'astro';
import siteConfig from '@/config/site.config';
import { defaultLocale } from '@/i18n';
import { getPublishedPosts, getPostUrl, getRssUrl } from '@/lib/blog';
import { getVisibleProjects, getProjectUrl } from '@/lib/projects';
import { getNavItems } from '@/config/nav.config';

/**
 * /llms.txt
 *
 * A plain-Markdown map of this site for large language models, following the
 * proposal at https://llmstxt.org. Where robots.txt tells a crawler *whether*
 * it may read the site, llms.txt tells a model *what the site is and which
 * pages matter* — in one short, token-cheap file.
 *
 * Why it's worth having: when someone asks an assistant a question this site
 * could answer, the model has a clean, citable summary instead of guessing
 * from scattered marketing copy.
 *
 * Everything here is generated at build time from `site.config.ts`, the nav
 * config and the content collections, so it describes *your* site and never
 * drifts out of sync with the real pages. There is nothing to keep updated by
 * hand.
 *
 * The Pages list used to be five hardcoded lines and had already drifted: it
 * named Home, About, Projects, Blog and Contact while the nav also carried
 * Services, and it never mentioned the components page at all — so an
 * assistant asked about this theme had no way to learn that the page
 * documenting every component exists. It now comes from `getNavItems`, so it
 * follows whatever nav a site configures.
 *
 * External nav entries are left out: this file is a map of *this* site, and a
 * link to somewhere else is not part of it.
 *
 * Multi-language sites: the default locale is listed, since llms.txt is meant
 * to stay short. Translated pages remain discoverable through the sitemap and
 * the hreflang tags the theme already emits.
 */

/**
 * The components page ships with the theme but is not in the nav, so it has to
 * be named here. A site that deletes it drops out of this glob, and the link
 * goes with it rather than becoming a 404 in a file meant to be authoritative.
 */
const componentsPage = import.meta.glob('/src/pages/components.astro');
const hasComponentsPage = Object.keys(componentsPage).length > 0;

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || siteConfig.url).replace(/\/$/, '');

  const posts = await getPublishedPosts(defaultLocale);
  const projects = await getVisibleProjects(defaultLocale);

  const line = (title: string, url: string, description?: string) =>
    description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`;

  const postLines = [...posts]
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
    .map((post) => line(post.data.title, `${base}${getPostUrl(post.id, defaultLocale)}`, post.data.description))
    .join('\n');

  const projectLines = [...projects]
    .sort((a, b) => a.data.order - b.data.order)
    .map((project) =>
      line(project.data.title, `${base}${getProjectUrl(project.id, defaultLocale)}`, project.data.description)
    )
    .join('\n');

  const pageLines = getNavItems(defaultLocale)
    .filter((item) => !item.external)
    .map((item) => line(item.label, `${base}${item.href}`));

  if (hasComponentsPage) {
    pageLines.push(
      line(
        'Components',
        `${base}/components`,
        'Every component in the theme, rendered, with its props and variants'
      )
    );
  }

  const sections = [
    `# ${siteConfig.name}`,
    ``,
    `> ${siteConfig.description}`,
    ``,
    `## Pages`,
    ``,
    ...pageLines,
  ];

  if (projectLines) {
    sections.push(``, `## Projects`, ``, projectLines);
  }

  if (postLines) {
    sections.push(``, `## Blog posts`, ``, postLines);
  }

  sections.push(
    ``,
    `## More`,
    ``,
    line('Sitemap', `${base}/sitemap-index.xml`),
    line('RSS feed', `${base}${getRssUrl(defaultLocale)}`),
    ``,
    `---`,
    ``,
    `Contact: ${siteConfig.email}`,
    ``
  );

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
