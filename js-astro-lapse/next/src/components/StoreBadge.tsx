// GENERATED from src/components/StoreBadge.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { STORE } from '@/lib/links';

export default function StoreBadge() {
  const show = process.env.NEXT_PUBLIC_STORE_BADGE === 'true';

  return (
    <>
      {show && <a className="store t-body-s" href={STORE.href} target="_blank" rel="noreferrer">{STORE.label}</a>}
    </>
  );
}
