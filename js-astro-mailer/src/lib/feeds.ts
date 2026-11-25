import type { RSSFeedItem } from "@astrojs/rss";
import mdxRenderer from "@astrojs/mdx/server.js";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { render } from "astro:content";
import { siteConfig } from "@/config/site";
import { issueComponents } from "@/lib/issue-components";
import { issueHref, publishedIssues, type Issue } from "@/lib/issues";

const absoluteUrl = (path: string) => new URL(path, siteConfig.siteUrl).toString();

/**
 * One container for the whole build — creating it costs more than rendering an
 * item — and one rendered body per issue.
 *
 * MDX compiles to its own component type, so its renderer has to be registered
 * by hand; without it every `.mdx` issue silently ships as its excerpt.
 */
let containerPromise: Promise<AstroContainer> | undefined;
const renderedBodies = new Map<string, string>();

const getContainer = async () => {
  containerPromise ??= AstroContainer.create().then((container) => {
    container.addServerRenderer({ name: "astro:jsx", renderer: mdxRenderer });
    return container;
  });
  return containerPromise;
};

/**
 * Article HTML rewritten for somewhere that runs none of this site's code: root
 * relative images are dead in a reader app, and scripts never execute.
 */
const forFeed = (html: string) =>
  html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/(\s(?:src|href|poster)=")\/(?!\/)/g, `$1${siteConfig.siteUrl}/`)
    .replace(/(\ssrcset=")([^"]+)"/g, (_match, attribute: string, value: string) => {
      const rewritten = value.replace(/(^|,\s*)\/(?!\/)/g, `$1${siteConfig.siteUrl}/`);
      return `${attribute}${rewritten}"`;
    });

/**
 * An issue that cannot be rendered falls back to its excerpt rather than
 * failing the build, so one awkward file never costs you the whole feed.
 */
const renderBody = async (issue: Issue): Promise<string | undefined> => {
  const cached = renderedBodies.get(issue.id);
  if (cached !== undefined) return cached || undefined;

  try {
    const container = await getContainer();
    const { Content } = await render(issue);
    const html = forFeed(
      await container.renderToString(Content, { props: { components: issueComponents } }),
    );
    renderedBodies.set(issue.id, html);
    return html;
  } catch (error) {
    console.warn(`[rss] ${issue.id} could not be rendered; shipping its excerpt instead.`, error);
    renderedBodies.set(issue.id, "");
    return undefined;
  }
};

export const feedItems = async (issues: Issue[]): Promise<RSSFeedItem[]> =>
  Promise.all(
    publishedIssues(issues).map(async (issue) => ({
      title: `No. ${issue.data.issue} — ${issue.data.title}`,
      link: issueHref(issue),
      pubDate: issue.data.date,
      description: issue.data.excerpt,
      author: issue.data.author.name,
      categories: [issue.data.topic],
      content: siteConfig.rss.fullContent ? await renderBody(issue) : undefined,
      enclosure: {
        url: absoluteUrl(issue.data.cover.src.src),
        length: 0,
        type: `image/${(issue.data.cover.src.format ?? "jpeg").replace("jpg", "jpeg")}`,
      },
    })),
  );

/** `<language>` is not among the RSS 2.0 fields `@astrojs/rss` models. */
export const feedCustomData = `<language>${siteConfig.language}</language>`;
