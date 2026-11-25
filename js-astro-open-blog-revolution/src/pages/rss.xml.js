import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();


import { CONFIG } from "@config";

export async function GET(context) {
    const allPosts = await getCollection('posts');

    const blog = allPosts
      .filter(post => post.data.status == 'published')
      .sort((a, b) => a.data.pubDate > b.data.pubDate ? -1 : 1);

    let site = context.site?.toString() || import.meta.env.SITE;

    if (!site) {
        console.warn("RSS Warning: No 'site' configured. Defaulting to localhost.");
        site = "http://localhost:4321"; 
    }

    const base = import.meta.env.BASE_URL || '/';

    // Remove trailing slash from site
    const cleanSite = site.replace(/\/$/, '');
    // Remove leading slash from base
    const cleanBase = base.replace(/^\//, '');
    // Remove trailing slash from base (to ensure consistency)
    const cleanerBase = cleanBase.replace(/\/$/, '');

    // Result: https://user.github.io/repo-name
    const fullUrl = `${cleanSite}/${cleanerBase}`;

    return rss({
        // `<title>` field in output xml
        title: CONFIG.TITLE,
        // `<description>` field in output xml
        description: CONFIG.DESCRIPTION,
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#site
        site: fullUrl,
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            content: sanitizeHtml(parser.render(post.body), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
              }),
            // Compute RSS link from post `id`
            // This example assumes all posts are rendered as `/blog/[id]` routes
            link: `${post.id}/`,
          })),
        // (optional) inject custom xml
        customData: `<language>${CONFIG.LANG}</language>`,
    });
}