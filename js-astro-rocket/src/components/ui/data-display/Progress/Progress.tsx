import { useId, type HTMLAttributes, type Ref, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { progressTrackVariants, progressBarVariants, type ProgressVariants } from './progress.variants';
import { t, defaultLocale, type Locale } from '@/i18n';

interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'ref'> {
  /**
   * Locale for the component's own screen-reader labels. A React island is
   * rendered in isolation and cannot see the page's locale, so a multi-locale
   * site passes it in; a single-locale site needs nothing.
   */
  locale?: Locale;
  ref?: Ref<HTMLDivElement>;
  value?: number;
  max?: number;
  variant?: ProgressVariants['variant'];
  size?: ProgressVariants['size'];
  showLabel?: boolean;
  /**
   * Accessible name for the bar. Only needed when there is no visible label:
   * with `showLabel` the children name the bar already.
   */
  label?: string;
  children?: ReactNode;
}

export function Progress({ locale = defaultLocale, ref, value, max = 100, variant = 'default', size = 'md', showLabel = false, label, className, children, ...rest }: ProgressProps) {
  const isIndeterminate = value === undefined;
  const percentage = isIndeterminate || max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  // See the note in Progress.astro: `aria-valuenow` alone is announced as a
  // bare number, so the bar needs a name from the visible label or a fallback.
  const labelId = useId();
  const hasVisibleLabel = showLabel && !isIndeterminate && children != null;
  const ariaLabel = label ?? (hasVisibleLabel ? undefined : t('common.progress', locale));
  const ariaLabelledBy = !label && hasVisibleLabel ? labelId : undefined;

  return (
    <div ref={ref} className={cn('w-full', className)} {...rest}>
      {showLabel && !isIndeterminate && (
        <div className="flex justify-between mb-1.5">
          <span id={labelId}>{children}</span>
          <span className="text-xs font-medium text-foreground-muted">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(progressTrackVariants({ size }))}
        role="progressbar"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuenow={isIndeterminate ? undefined : Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(progressBarVariants({ variant, indeterminate: isIndeterminate }))}
          style={!isIndeterminate ? { width: `${percentage}%` } : undefined}
        />
      </div>
    </div>
  );
}

export default Progress;
