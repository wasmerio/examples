export function resolveAssetUrl(path) {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/[^\/]+/);
    const base = (match && match[0] !== '') ? match[0] : '';
    const cleanBase = base.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
  }
  return `/${path.replace(/^\//, '')}`;
}

export function initDynamicImages() {
  const images = document.querySelectorAll('[data-dynamic-src]');
  images.forEach((img) => {
    const originalPath = img.dataset.dynamicSrc;
    if (originalPath) {
      img.src = resolveAssetUrl(originalPath);
      img.onerror = () => {
        if (img.dataset.fallback) {
          img.src = resolveAssetUrl(img.dataset.fallback);
        }
      };
    }
  });
}