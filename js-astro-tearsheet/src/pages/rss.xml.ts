// Members issues carry only their free part: remark-cut removed the rest before rendering,
// so entry.rendered.html already stops at the cut.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site, ui } from '../config';
import { getIssues, issueHref } from '../lib/issues';

export const GET: APIRoute = async (context) => {
  const issues = await getIssues();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: issues.map((issue) => ({
      title: `${issue.number}: ${issue.data.title}`,
      description: issue.data.dek,
      pubDate: issue.data.date,
      link: issueHref(issue),
      categories: issue.data.topics,
      content:
        (issue.rendered?.html ?? '') +
        (issue.cut.members
          ? `<p><a href="${new URL(issueHref(issue), context.site)}">${ui.cut.feed(issue.cut.membersWords.toLocaleString(site.locale))}</a></p>`
          : ''),
    })),
    customData: `<language>${site.locale}</language>`,
  });
};
