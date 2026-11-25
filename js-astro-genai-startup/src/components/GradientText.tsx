import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className,
  from = "from-purple-600",
  via,
  to = "to-pink-600",
  animate = false,
}: GradientTextProps) {
  const gradientClass = via
    ? `bg-gradient-to-r ${from} ${via} ${to}`
    : `bg-gradient-to-r ${from} ${to}`;

  return (
    <span
      className={cn(
        gradientClass,
        "bg-clip-text text-transparent",
        animate && "animate-gradient bg-[length:200%_auto]",
        "dark:from-purple-400 dark:to-pink-400",
        className
      )}
    >
      {children}
    </span>
  );
}
