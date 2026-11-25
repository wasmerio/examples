import { motion, useReducedMotion } from "framer-motion";

/**
 * React island: rotating conic “energy” border. Children render on a solid sci-fi plate.
 */
export default function AnimatedBorder({ children, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`relative isolate overflow-hidden rounded-sm p-[2px] ${className}`}>
      <motion.div
        className="pointer-events-none absolute -inset-[55%] opacity-95"
        style={{
          background:
            "conic-gradient(from 0deg, var(--sf-color-primary), var(--sf-color-secondary), var(--sf-color-primary))",
        }}
        animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: "linear" }
        }
      />
      <div className="relative h-full min-h-[4rem] w-full rounded-sm bg-[var(--sf-bg-deep)] text-sf-text">
        {children}
      </div>
    </div>
  );
}
