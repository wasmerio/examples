/**
 * Animation and timing constants
 */
export const ANIMATION = {
  // Infinite scroll durations (in milliseconds)
  SCROLL_DURATION_DEFAULT: 40000,
  SCROLL_DURATION_SKILLS: 45000,
  
  // Fade in animation
  FADE_IN_DURATION: 500, // milliseconds
  FADE_IN_DELAY_STEP: 50, // milliseconds between each badge
  
  // Stagger delays
  STAGGER_DELAYS: {
    FIRST: 0.05,
    SECOND: 0.1,
    THIRD: 0.15,
    FOURTH: 0.2,
    FIFTH: 0.25,
    SIXTH: 0.3,
    SEVENTH: 0.35,
    EIGHTH: 0.4,
    NTH: 0.45,
  },
} as const

/**
 * Performance constants
 */
export const PERFORMANCE = {
  // Intersection Observer thresholds
  INTERSECTION_THRESHOLD: 0.1,
  INTERSECTION_ROOT_MARGIN: '50px',
  
  // Debounce delays
  SEARCH_DEBOUNCE: 150, // milliseconds
} as const

