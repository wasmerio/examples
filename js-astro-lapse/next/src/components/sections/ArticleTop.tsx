// GENERATED from src/components/sections/ArticleTop.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Badge from '@/components/blog/Badge';
import PostMeta from '@/components/blog/PostMeta';
import type { Post } from '@/lib/blog';

interface Props { post: Post; }

export default function ArticleTop({ post }: Props) {
  const { data } = post;

  return (
    <>
      <section className="article-top">
        <header className="at-header">
          <div className="at-meta">
            <Badge label={data.category} />
            <PostMeta date={data.date} readTime={data.readTime} />
          </div>

          <h1 id="article-title" className="t-h1">{data.title}</h1>
          <p className="t-body-m">{data.excerpt}</p>
        </header>
        <img className="at-cover" src={data.cover} alt={data.coverAlt} width="1160" height="400" fetchPriority="high" />
      </section>
    </>
  );
}
