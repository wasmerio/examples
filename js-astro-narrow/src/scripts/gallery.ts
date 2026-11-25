import SmartGallery, {
  type GalleryItemId,
  type GalleryItemInput,
  type GalleryLayout
} from 'smart-gallery';
import { siteConfig } from '../config/site';

type LightboxItem = { id: GalleryItemId; src: string; alt: string; caption: string };
type LayoutItem = GalleryItemInput & { id: GalleryItemId; src: string; aspectRatio: number };
type Layout = GalleryLayout;

const cfg = siteConfig.gallery as Record<string, any>;
const LAYOUTS: Layout[] = ['justified', 'masonry', 'grid'];
const DEFAULT_LAYOUT: Layout = LAYOUTS.includes(cfg.defaultLayout)
  ? cfg.defaultLayout
  : 'justified';

const LAYOUT_ICONS: Record<Layout, string> = {
  justified:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="5" rx="1"/><rect x="3" y="11" width="8" height="9" rx="1"/><rect x="13" y="11" width="8" height="9" rx="1"/></svg>',
  masonry:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="3" y="12" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/><rect x="14" y="16" width="7" height="5" rx="1"/></svg>',
  grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'
};

// ---------------------------------------------------------------- Lightbox ---
const galleries = new Map<string, LightboxItem[]>();
let currentGallery = '';
let currentIndex = 0;
let root: HTMLElement | null = null;
let restoreOverflow = '';

function createLightbox() {
  if (root) return root;
  root = document.querySelector<HTMLElement>('[data-lightbox-root]');
  if (!root) throw new Error('Gallery lightbox root is missing.');
  root.querySelector('[data-lb-close]')?.addEventListener('click', closeLightbox);
  root
    .querySelector('[data-lb-prev]')
    ?.addEventListener('click', () => showLightbox(currentIndex - 1));
  root
    .querySelector('[data-lb-next]')
    ?.addEventListener('click', () => showLightbox(currentIndex + 1));
  root.addEventListener('click', (event) => {
    if (event.target === root) closeLightbox();
  });
  return root;
}

function showLightbox(index: number) {
  const items = galleries.get(currentGallery) || [];
  if (!items.length) return;
  currentIndex = Math.max(0, Math.min(index, items.length - 1));
  const item = items[currentIndex];
  const lightbox = createLightbox();
  const image = lightbox.querySelector<HTMLImageElement>('[data-lb-image]');
  const caption = lightbox.querySelector<HTMLElement>('[data-lb-caption]');
  const previous = lightbox.querySelector<HTMLButtonElement>('[data-lb-prev]');
  const next = lightbox.querySelector<HTMLButtonElement>('[data-lb-next]');
  if (image) {
    image.src = item.src;
    image.alt = item.alt;
  }
  if (caption) {
    caption.textContent = item.caption;
    caption.hidden = !item.caption;
  }
  const single = items.length <= 1;
  if (previous) {
    previous.disabled = currentIndex === 0;
    previous.style.display = single ? 'none' : '';
  }
  if (next) {
    next.disabled = currentIndex === items.length - 1;
    next.style.display = single ? 'none' : '';
  }
}

function openLightbox(galleryId: string, itemId: GalleryItemId) {
  const index = galleries.get(galleryId)?.findIndex((item) => item.id === itemId) ?? -1;
  if (index < 0) return;
  currentGallery = galleryId;
  const lightbox = createLightbox();
  showLightbox(index);
  requestAnimationFrame(() => lightbox.classList.add('is-open'));
  restoreOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!root) return;
  root.classList.remove('is-open');
  document.documentElement.style.overflow = restoreOverflow;
}

document.addEventListener('keydown', (event) => {
  if (!root || !root.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showLightbox(currentIndex - 1);
  if (event.key === 'ArrowRight') showLightbox(currentIndex + 1);
});

// ----------------------------------------------------------------- Gallery ---
function aspectRatioOf(img: HTMLImageElement | null, src: string): Promise<number> {
  return new Promise((resolve) => {
    const settle = (el: HTMLImageElement | null) => {
      const ratio =
        el && el.naturalWidth && el.naturalHeight ? el.naturalWidth / el.naturalHeight : 0;
      resolve(ratio > 0 ? ratio : 1.5);
    };
    if (img && img.complete && img.naturalWidth) return settle(img);
    const probe = img ?? new Image();
    if (!img) probe.src = src;
    probe.addEventListener('load', () => settle(probe), { once: true });
    probe.addEventListener('error', () => resolve(1.5), { once: true });
  });
}

function createInstance(host: HTMLElement, layout: Layout, items: LayoutItem[], galleryId: string) {
  const instance = new SmartGallery(host, {
    layout,
    gap: Number(cfg.gap) || 10,
    targetRowHeight: Number(cfg.targetRowHeight) || 220,
    lastRowBehavior: cfg.lastRowBehavior || 'center',
    columnWidth: Number(cfg.columnWidth) || 220,
    columns: cfg.columns ?? 'auto',
    virtualize: false,
    placeholderColor: 'var(--color-muted)',
    itemClassName: 'sg-item',
    onItemClick: ({ id }) => openLightbox(galleryId, id)
  });
  instance.setItems(items);
  return instance;
}

async function setupGallery(gallery: HTMLElement, groupIndex: number) {
  const figures = [...gallery.querySelectorAll<HTMLElement>('.image-figure')];
  const sources = figures
    .map((figure) => {
      const img = figure.querySelector<HTMLImageElement>('img');
      return {
        img,
        src: img?.currentSrc || img?.src || '',
        alt: img?.alt || '',
        caption: figure.querySelector('.image-caption')?.textContent?.trim() || ''
      };
    })
    .filter((source) => source.src);
  if (sources.length === 0) return;

  const galleryId = `gallery-${groupIndex}`;
  const galleryItems = sources.map(({ src, alt, caption }, index) => ({
    id: `${galleryId}-${index}`,
    src,
    alt,
    caption
  }));
  galleries.set(galleryId, galleryItems);

  const items: LayoutItem[] = await Promise.all(
    sources.map(async (source, index) => ({
      id: galleryItems[index].id,
      src: source.src,
      alt: source.alt,
      title: source.caption || undefined,
      aspectRatio: await aspectRatioOf(source.img, source.src)
    }))
  );

  let layout: Layout = DEFAULT_LAYOUT;
  let instance: SmartGallery | null = null;
  const host = document.createElement('div');

  const switcher = document.createElement('div');
  switcher.className = 'mb-3 flex justify-end gap-1';
  const buttons = LAYOUTS.map((value) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = value;
    button.setAttribute('aria-label', `${value} layout`);
    button.setAttribute('aria-pressed', String(value === layout));
    button.className =
      'grid h-8 w-8 place-items-center rounded-base border border-border text-fg-muted transition-colors hover:bg-hover hover:text-fg aria-pressed:border-accent aria-pressed:bg-accent-bg aria-pressed:text-accent-text';
    button.innerHTML = LAYOUT_ICONS[value];
    button.addEventListener('click', () => {
      if (value === layout || !instance) return;
      layout = value;
      instance.setOptions({ layout });
      buttons.forEach((entry) =>
        entry.setAttribute('aria-pressed', String(entry.dataset.layout === layout))
      );
    });
    button.dataset.layout = value;
    return button;
  });
  buttons.forEach((button) => switcher.appendChild(button));

  gallery.innerHTML = '';
  gallery.appendChild(switcher);
  gallery.appendChild(host);
  // Host 必须先进入 DOM，SmartGallery 才能在 setItems() 时获取正确宽度。
  instance = createInstance(host, layout, items, galleryId);
}

document.querySelectorAll<HTMLElement>('.markdown-gallery').forEach((gallery, index) => {
  void setupGallery(gallery, index);
});

document.querySelectorAll<HTMLElement>('.prose > .image-figure').forEach((figure, index) => {
  const img = figure.querySelector<HTMLImageElement>('img');
  if (!img) return;
  const galleryId = `single-${index}`;
  const itemId = `${galleryId}-0`;
  galleries.set(galleryId, [
    {
      id: itemId,
      src: img.currentSrc || img.src,
      alt: img.alt || '',
      caption: figure.querySelector('.image-caption')?.textContent?.trim() || ''
    }
  ]);
  const trigger = figure.querySelector<HTMLElement>('.image-container') || figure;
  trigger.addEventListener('click', () => openLightbox(galleryId, itemId));
});
