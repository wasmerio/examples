import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { markdownToHtml } from 'satteri';
import Slugger from 'github-slugger';

/**
 * Hand-written. The Next counterpart of getPosts() in the Astro build's
 * src/lib/blog.ts (the generator splices the rest of that file in as
 * lib/blog.ts). Reads the same Markdown files (src/content/blog/*.md) and
 * returns the same shape as Astro's content collection entries
 * ({ id, data, body, rendered: { html } }), with the defaults from
 * src/content.config.ts. The Markdown is rendered by satteri, the renderer
 * Astro uses, with the same options (GitHub-flavoured, no smart quotes, ids on
 * headings), so the article HTML is byte-identical.
 */
export interface PostData {
  title: string;
  category: string;
  date: Date;
  readTime: string;
  excerpt: string;
  featured: boolean;
  cover: string;
  coverAlt: string;
  author: { name: string; role: string; avatar: string; avatarAlt: string };
}
export interface Post { id: string; data: PostData; body: string; rendered: { html: string } }

const DIR = join(process.cwd(), 'src', 'content', 'blog');

const headingIds = () => {
  const slugger = new Slugger();
  return {
    name: 'heading-ids',
    element: {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      visit(node: any, ctx: any) {
        if (typeof node.properties?.id !== 'string') ctx.setProperty(node, 'id', slugger.slug(ctx.textContent(node)));
      },
    },
  };
};

async function load(): Promise<Post[]> {
  const posts = await Promise.all(
    readdirSync(DIR)
      .filter((f) => f.endsWith('.md'))
      .map(async (f) => {
        const { data, content } = matter(readFileSync(join(DIR, f), 'utf8'));
        const { html } = await markdownToHtml(content, { hastPlugins: [headingIds()], features: { gfm: true, smartPunctuation: false } });
        const post: PostData = {
          title: data.title,
          category: data.category,
          date: new Date(data.date),
          readTime: data.readTime,
          excerpt: data.excerpt,
          featured: data.featured ?? false,
          cover: data.cover,
          coverAlt: data.coverAlt ?? '',
          author: { ...data.author, avatarAlt: data.author?.avatarAlt ?? '' },
        };
        return { id: f.replace(/\.md$/, ''), data: post, body: content, rendered: { html } };
      }),
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

let cache: Promise<Post[]> | undefined;
/** Every post, newest first (the Framer lists all sort by Date, descending). */
export function getPosts(): Promise<Post[]> {
  cache ??= load();
  return cache.then((posts) => [...posts]);
}
