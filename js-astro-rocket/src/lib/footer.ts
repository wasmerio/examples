import { getFooterNavItems, footerLinkGroups, resolveNavItem } from '@/config/nav.config';
import { getPublishedPosts, collectTopTags, getTagUrl } from '@/lib/blog';
import { getVisibleProjects, getProjectUrl } from '@/lib/projects';
import { defaultLocale, t } from '@/i18n';
import type { FooterLinkGroup } from '@/components/layout/Footer.astro';

/**
 * The columns footer's default link groups, derived from what a site has.
 *
 * The alternative was a list someone types into config, which is how the
 * columns layout ended up rendering a logo and empty space: `linkGroups`
 * defaulted to `[]`, so anyone who found the layout and switched to it saw a
 * footer that looked broken. A default nobody configures has to fill itself.
 *
 * Each group is dropped when it has nothing in it, so the footer reports what
 * exists rather than what someone remembered to add. A new site with no posts
 * and no projects gets the site column alone, which renders as a simple
 * footer without anyone choosing a layout — and it fills out as the site
 * grows.
 *
 * Set `footerLinkGroups` in `nav.config.ts` to replace all of this.
 */

/** How many entries each derived group shows before it stops. */
const TOPICS_LIMIT = 6;
const PROJECTS_LIMIT = 5;

export async function getDerivedFooterGroups(
  locale: string = defaultLocale
): Promise<FooterLinkGroup[]> {
  const groups: FooterLinkGroup[] = [];

  // The site's own pages, from the footer nav a site already configures.
  const navLinks = getFooterNavItems(locale).map((item) => ({
    label: item.label,
    href: item.href,
    external: item.external,
  }));
  if (navLinks.length) {
    groups.push({ title: t('footer.groups.site', locale), links: navLinks });
  }

  // The most-used tags. Real pages, and they show the tagging off at the same
  // time — a footer full of a site's own subjects reads better than a footer
  // full of its section names twice over.
  const posts = await getPublishedPosts(locale);
  const topics = collectTopTags(posts, TOPICS_LIMIT).map((tag) => ({
    label: tag,
    href: getTagUrl(tag, locale),
  }));
  if (topics.length) {
    groups.push({ title: t('footer.groups.topics', locale), links: topics });
  }

  // Every visible project is listed; the ones marked `placeholder` have no
  // page, so they carry no href and render as text. Dropping them left a
  // column of two on the demo, and a demo where not everything is clickable
  // reads as a demo rather than as a mistake.
  // Projects that have a page come first, then the placeholders, each keeping
  // the site's own `order` within its group. Straight `order` put four
  // placeholders ahead of the second real project and the limit then cut it,
  // so a column meant for navigating led with the entries that do not.
  const allProjects = await getVisibleProjects(locale);
  const projects = [...allProjects]
    .sort((a, b) => Number(!!a.data.placeholder) - Number(!!b.data.placeholder))
    .slice(0, PROJECTS_LIMIT)
    .map((project) => ({
      label: project.data.title,
      href: project.data.placeholder ? undefined : getProjectUrl(project.id, locale),
    }));
  if (projects.length) {
    groups.push({ title: t('footer.groups.projects', locale), links: projects });
  }

  // Columns declared in config are appended to the derived ones, and go
  // through the same resolver as the nav so their labels translate and their
  // internal hrefs get the locale prefix.
  for (const group of footerLinkGroups) {
    const links = group.links.map((item) => {
      const resolved = resolveNavItem(item, locale);
      return { label: resolved.label, href: resolved.href, external: resolved.external };
    });
    if (!links.length) continue;
    groups.push({
      title: group.titleKey ? t(group.titleKey, locale) : group.title,
      links,
    });
  }

  return groups;
}
