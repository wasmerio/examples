import { render } from 'astro:content';
import type { PostEntry } from './posts';

const prodCache = new Map<string, Promise<number | undefined>>();
const entryCache = new WeakMap<PostEntry, Promise<number | undefined>>();

function readTime(post: PostEntry): Promise<number | undefined> {
  if (import.meta.env?.PROD) {
    let p = prodCache.get(post.id);
    if (!p) {
      p = render(post)
        .then(({ remarkPluginFrontmatter }) => {
          const t = remarkPluginFrontmatter?.readingTime;
          return typeof t === 'number' ? t : undefined;
        })
        .catch((err) => {
          prodCache.delete(post.id);
          throw err;
        });
      prodCache.set(post.id, p);
    }
    return p;
  }
  let p = entryCache.get(post);
  if (!p) {
    p = render(post)
      .then(({ remarkPluginFrontmatter }) => {
        const t = remarkPluginFrontmatter?.readingTime;
        return typeof t === 'number' ? t : undefined;
      })
      .catch((err) => {
        entryCache.delete(post);
        throw err;
      });
    entryCache.set(post, p);
  }
  return p;
}

/** 对每篇文章 render() 并取 remarkPluginFrontmatter.readingTime（分钟），顺序与输入一致。 */
export async function getReadingTimes(posts: PostEntry[]): Promise<Array<number | undefined>> {
  return Promise.all(posts.map(readTime));
}
