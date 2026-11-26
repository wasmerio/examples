/**
 * ScrollReveal Component
 * 
 * Animation component that reveals content on scroll using Framer Motion.
 * 
 * Architecture Decision: This uses Framer Motion (React) for smooth animations.
 * However, this is an OPTIONAL enhancement - the core theme system doesn't depend on it.
 * 
 * If you don't want Framer Motion, you can:
 * 1. Remove this component
 * 2. Use CSS animations with motion tokens instead
 * 3. Use a different animation library
 * 
 * The theme system itself is completely independent of this component.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  scale?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  distance = 50,
  duration = 0.8,
  scale = false,
}: ScrollRevealProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      x:
        direction === "left" ? distance : direction === "right" ? -distance : 0,
      scale: scale ? 0.9 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        mass: 1,
        delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
