const root = document.documentElement;

function initScrollDark(prose: HTMLElement) {
  const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = root.getAttribute('data-theme');
  let storedTheme: string | null = null;
  try {
    storedTheme = localStorage.getItem('theme');
  } catch {
    storedTheme = null;
  }
  if (
    initialTheme === 'dark' ||
    storedTheme === 'dark' ||
    (!initialTheme && !storedTheme && userPrefersDark)
  ) {
    return;
  }

  let darkActive = false;
  let userThemeOverride = false;
  let effectThemeWrites = 0;
  const enterAt = 0.2;
  const exitAt = 0.13;
  const navOffset = 52;
  const triggerEnterViewportRatio = 0.5;
  const triggerExitViewportRatio = 0.42;
  const triggerHeading = prose.querySelector<HTMLElement>('#scroll-dark-turns-on-here');
  let articleTop = 0;
  let proseHeight = 1;
  let triggerTop = 0;
  let triggerBottom = 0;
  let scrollFrame = 0;
  const hasUserChangedTheme = () => {
    if (userThemeOverride) return true;
    try {
      return localStorage.getItem('theme') !== storedTheme;
    } catch {
      return false;
    }
  };
  const setThemeFromEffect = (theme: string) => {
    effectThemeWrites += 1;
    root.setAttribute('data-theme', theme);
  };
  const restoreTheme = () => {
    if (hasUserChangedTheme()) return;
    if (initialTheme === 'light' || initialTheme === 'dark') {
      setThemeFromEffect(initialTheme);
      return;
    }
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setThemeFromEffect(storedTheme);
      return;
    }
    setThemeFromEffect(userPrefersDark ? 'dark' : 'light');
  };
  const observer = new MutationObserver(() => {
    if (effectThemeWrites > 0) {
      effectThemeWrites -= 1;
      return;
    }
    userThemeOverride = true;
    darkActive = false;
  });
  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  function measure() {
    articleTop = prose.getBoundingClientRect().top + window.scrollY;
    proseHeight = Math.max(prose.scrollHeight, 1);
    if (triggerHeading) {
      const triggerRect = triggerHeading.getBoundingClientRect();
      triggerTop = triggerRect.top + window.scrollY;
      triggerBottom = triggerTop + triggerHeading.offsetHeight;
    }
  }

  function update() {
    scrollFrame = 0;
    if (hasUserChangedTheme()) {
      darkActive = false;
      return;
    }

    const readerTop = window.scrollY + navOffset;
    const triggerEnterLine = window.scrollY + window.innerHeight * triggerEnterViewportRatio;
    const triggerExitLine = window.scrollY + window.innerHeight * triggerExitViewportRatio;
    const pct = Math.min(Math.max((readerTop - articleTop) / proseHeight, 0), 1);
    const shouldEnter = triggerHeading ? triggerEnterLine >= triggerBottom : pct >= enterAt;
    const shouldExit = triggerHeading ? triggerExitLine <= triggerTop : pct <= exitAt;

    if (shouldEnter && root.getAttribute('data-theme') !== 'dark') {
      darkActive = true;
      setThemeFromEffect('dark');
    } else if (shouldExit && darkActive) {
      darkActive = false;
      restoreTheme();
    }
  }

  function requestUpdate() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(update);
  }

  function refresh() {
    measure();
    requestUpdate();
  }

  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(prose);

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', refresh, { passive: true });
  measure();
  setTimeout(refresh, 60);
  update();
}

function initWhenReady(marker: HTMLElement) {
  const prose = document.querySelector<HTMLElement>('.prose');
  if (!prose) {
    window.requestAnimationFrame(() => initWhenReady(marker));
    return;
  }

  const variant = marker.dataset.variant;
  if (variant !== 'scroll-dark') return;
  if (document.body) document.body.dataset.sfEffect = variant;
  root.dataset.sfEffect = variant;

  initScrollDark(prose);
}

function initScrollFocus() {
  document.querySelectorAll<HTMLElement>('[data-scroll-focus]').forEach((marker) => {
    if (marker.dataset.ready === 'true') return;
    marker.dataset.ready = 'true';
    initWhenReady(marker);
  });
}

export function mountScrollFocus() {
  initScrollFocus();
}
