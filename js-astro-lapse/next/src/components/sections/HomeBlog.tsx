// GENERATED from src/components/sections/HomeBlog.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import home from '@/content/pages/home.json';
import Button from '@/components/ui/Button';
import BlogRow from '@/components/sections/BlogRow';
import { getPosts } from '@/lib/blog';

export default async function HomeBlog() {
  const { blog } = home;
  const posts = (await getPosts()).slice(0, 3);

  return (
    <>
      <section className="blog">
        <div className="home-blog-title">
          <p className="t-eyebrow">{blog.eyebrow}</p>
          <h2 className="t-h2 balance">{blog.title}</h2>
          <Button href={blog.button.href}>{blog.button.label}</Button>
        </div>
        <BlogRow posts={posts} />
      </section>
    </>
  );
}
