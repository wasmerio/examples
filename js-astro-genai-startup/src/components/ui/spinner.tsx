import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin rounded-full border-2", {
  variants: {
    size: {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-2",
      lg: "h-12 w-12 border-3",
      xl: "h-16 w-16 border-4",
    },
    variant: {
      default: "border-primary border-t-transparent",
      secondary: "border-secondary border-t-transparent",
      white: "border-white border-t-transparent",
      gradient: "border-transparent border-t-purple-500",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
