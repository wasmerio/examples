declare global {
  interface Window {
    __pageLoadFired?: boolean
  }
}

export function onPageLoad(init: () => void) {
  document.addEventListener('astro:page-load', init)
  if (window.__pageLoadFired) init()
}
