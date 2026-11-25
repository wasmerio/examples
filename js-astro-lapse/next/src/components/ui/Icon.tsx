// GENERATED from src/components/ui/Icon.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import check from '@/icons/check-svg';
import dotsNine from '@/icons/dots-nine-svg';
import plus from '@/icons/plus-svg';
import x from '@/icons/x-svg';
import quote from '@/icons/quote-svg';

interface Props { name: 'dots-nine' | 'check' | 'plus' | 'x' | 'quote'; size?: number; className?: string; }

export default function Icon({ name, size = 16, className: cls }: Props) {
  const icons: Record<string, string> = { check, 'dots-nine': dotsNine, plus, x, quote };
  const svg = (icons[name] ?? '').replace('<svg ', `<svg width="${size}" height="${size}" `);

  return (
    <>
      <span className={cx(['icon', cls])} dangerouslySetInnerHTML={{ __html: svg }} />
    </>
  );
}
