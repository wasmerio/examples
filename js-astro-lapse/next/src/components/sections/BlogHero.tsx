// GENERATED from src/components/sections/BlogHero.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Button from '@/components/ui/Button';
import Badge from '@/components/blog/Badge';
import PostMeta from '@/components/blog/PostMeta';
import blog from '@/content/pages/blog.json';
import { postUrl, type Post } from '@/lib/blog';

interface Props { featured?: Post; }

export default function BlogHero({ featured }: Props) {
  return (
    <>
      <section className="blog-hero">
        <div className="bh-head">
          <div className="bh-title">
            <p className="t-eyebrow">{blog.hero.eyebrow}</p>
            <h1 className="t-h1 balance">{blog.hero.heading}</h1>
          </div>
          <p className="bh-blurb t-body-m">{blog.hero.blurb}</p>
        </div>
        {featured && (
          <article className="bh-featured">
            <div className="bh-content">
              <div className="bh-top">
                <Badge label={featured.data.category} />
                <PostMeta date={featured.data.date} readTime={featured.data.readTime} />
              </div>
              <div className="bh-copy">
                <h2 className="t-h4">{featured.data.title}</h2>
                <p className="t-body-m">{featured.data.excerpt}</p>
                <Button href={postUrl(featured)} variant="primary">{blog.hero.read}</Button>
              </div>
            </div>
            <a className="bh-cover" href={postUrl(featured)} tabIndex={-1} aria-hidden="true">
              <img src={featured.data.cover} alt={featured.data.coverAlt} width="752" height="577" fetchPriority="high" />
            </a>
          </article>
        )}
      </section>
    </>
  );
}
