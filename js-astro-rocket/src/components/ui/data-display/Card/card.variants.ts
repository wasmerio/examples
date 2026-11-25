import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  ['rounded-xl', 'transition-all duration-200 ease-out'],
  {
    variants: {
      variant: {
        default: 'bg-card border border-brand-500/40 shadow-md hover:border-brand-500/80',
        solid: 'bg-secondary border border-transparent',
        outline: 'bg-transparent border-2 border-brand-500/40 shadow-md hover:border-brand-500/80',
        ghost: 'bg-transparent border border-transparent',
        elevated: 'bg-card border border-brand-500/40 shadow-lg hover:border-brand-500/80',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:border-brand-500 hover:shadow-md hover:-translate-y-0.5',
      },
    },
    compoundVariants: [
      // Tier-up rule: elevated cards already sit at shadow-lg at rest,
      // so hover should step UP to shadow-xl, not down to shadow-md.
      {
        variant: 'elevated',
        hover: true,
        class: 'hover:shadow-xl',
      },
    ],
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;
