// GENERATED from src/components/sections/ArticleBody.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import type { Post } from '@/lib/blog';

interface Props { post: Post; }

export default function ArticleBody({ post }: Props) {
  const { author } = post.data;

  return (
    <>
      <section className="article-body">
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.rendered?.html ?? '' }} />
        <footer className="ab-author">
          <img src={author.avatar} alt={author.avatarAlt} width="32" height="32" loading="lazy" />
          <div className="ab-name">
            <p className="ab-label">{author.name}</p>
            <p className="t-eyebrow">{author.role}</p>
          </div>
        </footer>
      </section>
    </>
  );
}
