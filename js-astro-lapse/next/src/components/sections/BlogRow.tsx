// GENERATED from src/components/sections/BlogRow.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import { sx } from '@/lib/sx';
import Badge from '@/components/blog/Badge';
import PostMeta from '@/components/blog/PostMeta';
import { postUrl, type Post } from '@/lib/blog';

interface Props { posts: Post[]; className?: string; }

export default function BlogRow({ posts, className: cls }: Props) {
  return (
    <>
      <div className={cx(['blog-row', cls])} data-fx="blog-accordion" style={sx(`--cards: ${posts.length}`)}>
        {posts.map((post, i) => (
          <a key={i} className="bp-card" href={postUrl(post)} data-card>
            <img
              className="bp-cover"
              src={post.data.cover}
              alt={post.data.coverAlt}
              width="530"
              height="440"
              loading="lazy"
              decoding="async"
            />
            <div className="bp-panel" data-panel>
              <div className="bp-copy" data-copy>
                <Badge label={post.data.category} variant="white" />
                <h3 className="bp-title t-h4">{post.data.title}</h3>
                <PostMeta date={post.data.date} readTime={post.data.readTime} tone="light" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
