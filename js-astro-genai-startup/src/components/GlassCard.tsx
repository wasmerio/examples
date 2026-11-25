import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
}

export function GlassCard({
  children,
  className,
  blur = "md",
}: GlassCardProps) {
  const blurAmount = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  }[blur];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/20",
        "bg-white/10 dark:bg-black/10",
        blurAmount,
        "shadow-xl",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-br before:from-white/20 before:to-transparent",
        "before:opacity-50",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
