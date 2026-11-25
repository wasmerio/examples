// GENERATED from src/components/sections/BlogArticles.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Badge from '@/components/blog/Badge';
import PostMeta from '@/components/blog/PostMeta';
import blog from '@/content/pages/blog.json';
import { postUrl, type Post } from '@/lib/blog';

interface Props { posts: Post[]; }

export default function BlogArticles({ posts }: Props) {
  return (
    <>
      <section className="blog-articles" id="articles" data-fx="blog-tabs">
        <div className="ba-tabs" role="group" aria-label={blog.tabsLabel}>
          {blog.tabs.map((tab, index) => (
            <button key={index} type="button" className="ba-tab" data-tab={tab.value} aria-pressed={tab.value === '' ? 'true' : 'false'}>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="ba-list">
          {posts.map((post, index) => (
            <a key={index} className="ba-card" href={postUrl(post)} data-category={post.data.category}>
              <div className="ba-content">
                <Badge label={post.data.category} />
                <h3 className="t-h5">{post.data.title}</h3>
                <PostMeta date={post.data.date} readTime={post.data.readTime} />
              </div>
              <div className="ba-cover">
                <img src={post.data.cover} alt={post.data.coverAlt} width="307" height="317" loading="lazy" decoding="async" />
              </div>
            </a>
          ))}
          <div className="ba-empty" data-empty hidden={posts.length > 0}>
            <p className="t-body-m">{blog.empty}</p>
          </div>
        </div>
      </section>
    </>
  );
}
