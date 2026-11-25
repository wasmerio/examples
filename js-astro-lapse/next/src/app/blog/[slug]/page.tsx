// GENERATED from src/pages/blog/[slug].astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Base from '@/layouts/Base';
import ArticleTop from '@/components/sections/ArticleTop';
import ArticleBody from '@/components/sections/ArticleBody';
import BlogRow from '@/components/sections/BlogRow';
import blog from '@/content/pages/blog.json';
import { getPosts, type Post } from '@/lib/blog';

interface Props { post: Post; related: Post[]; }

async function getStaticPaths() {
  // Set to 4 for a full row of three on every post.
  const RELATED_LIMIT = 3;
  const posts = await getPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    // Related reading, as on the Framer site: the RELATED_LIMIT newest posts,
    // minus this one if it is among them (so the newest posts show two cards).
    props: { post, related: posts.slice(0, RELATED_LIMIT).filter((p) => p.id !== post.id) },
  }));
}

export async function generateStaticParams() {
  return (await getStaticPaths()).map((p) => p.params);
}


export default async function Slug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: requested } = await params;
  const { post, related } = ((await getStaticPaths()).find((p) => p.params.slug === requested)!.props) as any;


  return (
    <>
      <Base route={`/blog/${requested}/`} title={post.data.title + blog.meta.postTitleSuffix} description={post.data.excerpt} image={post.data.cover}>
        <ArticleTop post={post} />
        <ArticleBody post={post} />
        {related.length > 0 && (
          <section className="related">
            <h2 className="t-h2 balance">{blog.related}</h2>
            <BlogRow posts={related} />
          </section>
        )}
      </Base>
    </>
  );
}
