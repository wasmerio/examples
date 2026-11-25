// GENERATED from src/components/blog/Badge.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';

interface Props { label: string; variant?: 'surface' | 'white'; className?: string; }

export default function Badge({ label, variant = 'surface', className: cls }: Props) {
  return (
    <>
      <span className={cx(['badge', `badge--${variant}`, cls])}><span>{label}</span></span>
    </>
  );
}
