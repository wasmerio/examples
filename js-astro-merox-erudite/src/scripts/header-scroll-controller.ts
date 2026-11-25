/**
 * Header scroll controller with shrink effect
 * Follows Astro best practices and modern JavaScript patterns
 */

interface HeaderState {
  ticking: boolean
  lastScrollY: number
  elements: {
    wrapper: HTMLElement | null
    inner: HTMLElement | null
  }
}

interface HeaderControllerConfig {
  scrollThreshold: number
  desktopBreakpoint: number
  headerIds: {
    wrapper: string
    inner: string
  }
}

/**
 * Initialize header scroll controller
 * @param config - Configuration object for the header controller
 */
export function initHeaderScrollController(config: HeaderControllerConfig): void {
  if (typeof window === 'undefined') return

  const { scrollThreshold, desktopBreakpoint, headerIds } = config

  // State management
  let state: HeaderState = {
    ticking: false,
    lastScrollY: 0,
    elements: {
      wrapper: null,
      inner: null,
    },
  }

  /**
   * Get header elements from DOM
   * @returns Elements object or null if not found
   */
  const getElements = (): { wrapper: HTMLElement; inner: HTMLElement } | null => {
    const wrapper = document.getElementById(headerIds.wrapper)
    const inner = document.getElementById(headerIds.inner)

    if (!wrapper || !inner) {
      return null
    }

    return { wrapper, inner }
  }

  /**
   * Check if current viewport is desktop size
   * @returns true if desktop, false otherwise
   */
  const isDesktop = (): boolean => {
    return window.innerWidth >= desktopBreakpoint
  }

  /**
   * Update header shrink state based on scroll position
   */
  const updateHeaderState = (): void => {
    const elements = getElements()
    if (!elements) {
      state.ticking = false
      return
    }

    const { wrapper, inner } = elements
    const currentScroll = window.scrollY
    const isScrolled = currentScroll > scrollThreshold
    const wasScrolled = state.lastScrollY > scrollThreshold

    // Reset shrink state on mobile/tablet
    if (!isDesktop()) {
      wrapper.classList.remove('shrink')
      inner.classList.remove('shrink')
      state.ticking = false
      state.lastScrollY = currentScroll
      return
    }

    // Apply shrink effect on desktop
    if (isScrolled && !wasScrolled) {
      wrapper.classList.add('shrink')
      inner.classList.add('shrink')
    } else if (!isScrolled && wasScrolled) {
      wrapper.classList.remove('shrink')
      inner.classList.remove('shrink')
    }

    state.lastScrollY = currentScroll
    state.ticking = false
  }

  /**
   * Throttled scroll handler using requestAnimationFrame
   */
  const handleScroll = (): void => {
    if (!state.ticking) {
      window.requestAnimationFrame(updateHeaderState)
      state.ticking = true
    }
  }

  /**
   * Initialize header controller
   */
  const init = (): void => {
    // Reset state
    state.ticking = false
    state.lastScrollY = window.scrollY
    const elements = getElements()
    state.elements = elements || { wrapper: null, inner: null }

    // Initial state update
    updateHeaderState()

    // Attach scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  /**
   * Cleanup header controller
   */
  const cleanup = (): void => {
    // Remove event listeners
    window.removeEventListener('scroll', handleScroll)

    // Reset shrink state
    const elements = getElements()
    if (elements) {
      elements.wrapper.classList.remove('shrink')
      elements.inner.classList.remove('shrink')
    }

    // Reset state
    state.ticking = false
    state.lastScrollY = 0
    state.elements = { wrapper: null, inner: null }
  }

  // Astro navigation event handlers
  document.addEventListener('astro:page-load', init)
  document.addEventListener('astro:after-swap', () => {
    cleanup()
    // Use requestAnimationFrame instead of setTimeout for better performance
    requestAnimationFrame(() => {
      requestAnimationFrame(init)
    })
  })
  document.addEventListener('astro:before-swap', cleanup)

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}

