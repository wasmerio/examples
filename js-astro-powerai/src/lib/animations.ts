/**
 * Global Animation Configuration for Motion
 * Centralized animation variants and settings for the entire application
 */

import type { Transition, Variants } from "motion/react";

// ============================================
// TRANSITION CONFIGURATIONS
// ============================================

export const transitions: Record<string, Transition> = {
  // Smooth default transition
  smooth: {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  },

  // Fast transition for quick interactions
  fast: {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1],
  },

  // Bouncy transition for playful elements
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 20,
  },

  // Slow transition for dramatic reveals
  slow: {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
  },

  // Very slow for hero sections
  verySlow: {
    duration: 1.2,
    ease: [0.25, 0.1, 0.25, 1],
  },
};

// ============================================
// SCROLL REVEAL VARIANTS
// ============================================

export const scrollRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// ============================================
// FADE IN VARIANTS
// ============================================

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
};

export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const fadeInDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const fadeInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

export const fadeInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

// ============================================
// SCALE VARIANTS
// ============================================

export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
};

export const scaleUpVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.bouncy,
  },
};

// ============================================
// STAGGER VARIANTS (for lists/grids)
// ============================================

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// ============================================
// HOVER VARIANTS
// ============================================

export const hoverLiftVariants: Variants = {
  initial: {
    y: 0,
  },
  hover: {
    y: -8,
    transition: transitions.fast,
  },
};

export const hoverScaleVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: transitions.fast,
  },
};

export const hoverGlowVariants: Variants = {
  initial: {
    boxShadow: "0 0 0 rgba(154, 77, 254, 0)",
  },
  hover: {
    boxShadow: "0 0 30px rgba(154, 77, 254, 0.3)",
    transition: transitions.fast,
  },
};

export const hoverBorderVariants: Variants = {
  initial: {
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  hover: {
    borderColor: "rgba(154, 77, 254, 0.5)",
    transition: transitions.fast,
  },
};

// ============================================
// HERO ANIMATION VARIANTS
// ============================================

export const heroBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smooth,
      delay: 0.2,
    },
  },
};

export const heroTitleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smooth,
      delay: 0.4,
    },
  },
};

export const heroContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smooth,
      delay: 0.6,
    },
  },
};

export const heroButtonsVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smooth,
      delay: 0.8,
    },
  },
};

export const heroImageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...transitions.verySlow,
      delay: 1,
    },
  },
};

export const HeroShapeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...transitions.verySlow,
      delay: 1.2,
    },
  },
};

// ============================================
// CARD ANIMATION VARIANTS
// ============================================

export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  hover: {
    y: -8,
    transition: transitions.fast,
  },
};

// ============================================
// BUTTON ANIMATION VARIANTS
// ============================================

export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const buttonGlowVariants: Variants = {
  initial: {
    boxShadow: "0 0 0 rgba(154, 77, 254, 0)",
  },
  hover: {
    boxShadow: "0 0 20px rgba(154, 77, 254, 0.4)",
    transition: transitions.fast,
  },
  tap: {
    boxShadow: "0 0 10px rgba(154, 77, 254, 0.2)",
    transition: transitions.fast,
  },
};

// ============================================
// IMAGE ANIMATION VARIANTS
// ============================================

export const imageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
};

export const imageZoomVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.08,
    transition: transitions.fast,
  },
};

// ============================================
// TEXT ANIMATION VARIANTS
// ============================================

export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// ============================================
// SECTION HEADER VARIANTS
// ============================================

export const sectionHeaderVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// ============================================
// MODAL/DIALOG VARIANTS
// ============================================

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.fast,
  },
};

export const modalOverlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// ============================================
// LOADING/SPINNER VARIANTS
// ============================================

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const pulseVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================
// SPECIAL EFFECT VARIANTS
// ============================================

export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: "-1000px 0",
  },
  animate: {
    backgroundPosition: "1000px 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const floatVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const wiggleVariants: Variants = {
  initial: {
    rotate: 0,
  },
  hover: {
    rotate: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// ============================================
// VIEWPORT CONFIGURATIONS
// ============================================

export const defaultViewport = {
  once: true,
  margin: "-100px",
  amount: 0.2,
};

export const strictViewport = {
  once: true,
  margin: "-50px",
  amount: 0.5,
};

export const looseViewport = {
  once: true,
  margin: "-200px",
  amount: 0.1,
};
