// GENERATED from src/components/ui/Button.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';

interface Props { href: string; variant?: 'primary' | 'ghost' | 'secondary'; className?: string; [key: string]: unknown; }

export default function Button({ href, variant = 'primary', className: cls, children, ...rest }: Props & { children?: React.ReactNode }) {
  return (
    <>
      <a href={href} className={cx(['btn', `btn--${variant}`, cls])} {...rest}>
        <span className="btn-glow-wrap" aria-hidden="true"><span className="btn-glow"></span></span>
        <span className="btn-surface" aria-hidden="true"></span>
        <span className="btn-label t-body-m">{children}</span>
      </a>
    </>
  );
}
