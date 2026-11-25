// GENERATED from src/pages/blog/index.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Base from '@/layouts/Base';
import BlogHero from '@/components/sections/BlogHero';
import BlogArticles from '@/components/sections/BlogArticles';
import blog from '@/content/pages/blog.json';
import { getPosts, pickFeatured } from '@/lib/blog';

export default async function Index() {
  const posts = await getPosts();
  const featured = pickFeatured(posts);
  const rest = posts.filter((post) => post !== featured && !post.data.featured);

  return (
    <>
      <Base route="/blog/" title={blog.meta.title} description={blog.meta.description}>
        <BlogHero featured={featured} />
        <BlogArticles posts={rest} />
      </Base>
    </>
  );
}
