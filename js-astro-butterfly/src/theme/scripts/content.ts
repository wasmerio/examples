import photoswipeCss from 'photoswipe/style.css?url';
import { loadStyle } from './load-style';
import { toast } from './store';
import { initCodeBlocks } from './code';

/** Tabs: click + roving keyboard focus (Arrow keys / Home / End). */
function initTabs(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('[data-tabs]:not([data-ready])').forEach((tabs) => {
    tabs.dataset.ready = '';
    const list = tabs.querySelector<HTMLElement>(':scope > .tab-list')!;
    const buttons = [...list.querySelectorAll<HTMLButtonElement>(':scope > [role=tab]')];
    const select = (i: number, focus = false) => {
      buttons.forEach((b, j) => {
        const on = i === j;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(b.getAttribute('aria-controls')!);
        if (panel) panel.hidden = !on;
      });
      if (focus) buttons[i].focus();
    };
    list.addEventListener('click', (e) => {
      const b = (e.target as Element).closest<HTMLButtonElement>('[role=tab]');
      if (b) select(buttons.indexOf(b));
    });
    list.addEventListener('keydown', (e) => {
      const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (i < 0) return;
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: buttons.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select((next + buttons.length) % buttons.length, true);
    });
  });
}

/** Copy: append source attribution for long selections (Butterfly copy.copyright). */
function initCopyright() {
  document.addEventListener('copy', (e) => {
    const sel = document.getSelection()?.toString() ?? '';
    const article = document.querySelector('#article-container');
    if (!article || sel.length < 60 || !(e.target instanceof Node) || !article.contains(e.target)) return;
    if ((e.target as Element).closest?.('.expressive-code')) return;
    const author = document.querySelector('meta[name=author]')?.getAttribute('content') ?? '';
    e.clipboardData?.setData('text/plain', `${sel}\n\n作者: ${author}\n链接: ${location.href}\n来源: ${location.host}\n著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。`);
    e.preventDefault();
    toast('复制成功，转载请注明出处', 'info');
  });
}

/** Image lightbox (PhotoSwipe), loaded on demand. */
async function openLightbox(link: HTMLAnchorElement) {
  const container = link.closest('#article-container, .twikoo, #twikoo') ?? document.body;
  const links = [...container.querySelectorAll<HTMLAnchorElement>('a[data-pswp]')];
  const index = Math.max(0, links.indexOf(link));
  const [{ default: PhotoSwipe }] = await Promise.all([
    import('photoswipe'),
    loadStyle(photoswipeCss),
  ]);
  const dataSource = links.map((a) => {
    const img = a.querySelector('img');
    return {
      src: a.href,
      msrc: img?.currentSrc || img?.src,
      // The attributes hold the full size; natural size is whichever srcset candidate loaded.
      width: Number(img?.getAttribute('width')) || img?.naturalWidth || 1600,
      height: Number(img?.getAttribute('height')) || img?.naturalHeight || 1200,
      alt: img?.alt ?? '',
    };
  });
  const pswp = new PhotoSwipe({ dataSource, index, bgOpacity: 0.9, showHideAnimationType: 'fade', wheelToZoom: true });
  pswp.on('contentLoad', ({ content }) => {
    // natural size isn't known for lazy images that never loaded — fix it up once loaded
    const el = content.element as HTMLImageElement | undefined;
    if (el && !content.data.width) el.onload = () => pswp.refreshSlideContent(content.index);
  });
  pswp.init();
}

let globalsReady = false;

export function initContent() {
  if (!globalsReady) {
    globalsReady = true;
    initCopyright();
    document.addEventListener('click', (e) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-pswp]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      openLightbox(a).catch(() => window.open(a.href, '_blank'));
    });
  }
  // src is the full-size file; the browser shows a srcset candidate in the page.
  document.querySelectorAll<HTMLAnchorElement>('a[data-pswp]:not([href])').forEach((a) => {
    const img = a.querySelector('img');
    if (img) a.href = img.src;
  });
  initTabs(document);
  initCodeBlocks();
  const outdated = document.querySelector<HTMLElement>('[data-outdated]');
  if (outdated) {
    const days = Math.floor((Date.now() - Date.parse(outdated.dataset.outdated!)) / 86_400_000);
    if (days >= Number(outdated.dataset.limit)) {
      outdated.textContent = `文章最后更新于 ${days} 天前，其中的信息可能已经过时。`;
      outdated.hidden = false;
    }
  }
}

/** Make comment images open in the lightbox too. */
export function bindCommentImages(scope: Element) {
  scope.querySelectorAll<HTMLImageElement>('.tk-content img:not(.tk-owo-emotion)').forEach((img) => {
    if (img.closest('a')) return;
    const a = document.createElement('a');
    a.href = img.src;
    a.dataset.pswp = '';
    a.setAttribute('aria-label', img.alt || '查看评论图片');
    img.replaceWith(a);
    a.append(img);
  });
}
