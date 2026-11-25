// GENERATED from src/components/blog/PostMeta.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import blog from '@/content/pages/blog.json';
import { formatDate } from '@/lib/blog';

interface Props { date: Date; readTime: string; /** light = grey text, for cards on a photo */ tone?: 'dark' | 'light'; className?: string; }

export default function PostMeta({ date, readTime, tone = 'dark', className: cls }: Props) {
  return (
    <>
      <p className={cx(['post-meta t-eyebrow', tone === 'light' && 'post-meta--light', cls])}>
        <time dateTime={date.toISOString().slice(0, 10)}>{formatDate(date)}</time>
        <span aria-hidden="true">{blog.metaSeparator}</span>
        <span>{readTime}</span>
      </p>
    </>
  );
}
