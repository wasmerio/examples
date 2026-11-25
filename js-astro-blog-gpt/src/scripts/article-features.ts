import { t } from '../lib/i18n';
import photoSwipeStyles from 'photoswipe/style.css?url';
let dispose: (() => void) | undefined;
let mermaidModule: Promise<typeof import('mermaid')> | undefined;
let lightboxStyles: Promise<void> | undefined;
function loadLightboxStyles() {
  if (!document.querySelector('link[data-bloggpt-lightbox-styles]'))
    lightboxStyles = undefined;
  return (lightboxStyles ??= new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.bloggptLightboxStyles = '';
    link.href = photoSwipeStyles;
    link.onload = () => resolve();
    link.onerror = () => {
      link.remove();
      lightboxStyles = undefined;
      reject(new Error('Unable to load PhotoSwipe styles'));
    };
    document.head.append(link);
  }));
}
let diagramId = 0;
document.addEventListener('astro:before-swap', () => dispose?.());
document.addEventListener('astro:page-load', () => {
  dispose?.();
  const bodies = [
    ...document.querySelectorAll<HTMLElement>('.article-content'),
  ];
  if (!bodies.length) return;
  const controller = new AbortController();
  const { signal } = controller;
  const cleanups: (() => void)[] = [];
  const ui = t(document.body.dataset.locale ?? 'en');
  {
    const diagrams: {
      host: HTMLElement;
      source: string;
      canvas: HTMLElement;
      error: HTMLElement;
      visible: boolean;
    }[] = [];
    for (const body of bodies.filter(
      (body) =>
        (body.dataset.mermaid ?? document.body.dataset.mermaid) === 'true',
    ))
      for (const code of body.querySelectorAll<HTMLElement>(
        'pre[data-language="mermaid"] code, pre > code.language-mermaid',
      )) {
        const block =
          code.closest<HTMLElement>('.expressive-code') ??
          code.closest<HTMLElement>('pre');
        if (!block) continue;
        const host = document.createElement('figure');
        host.className = 'mermaid-figure';
        const anchor = code.closest<HTMLElement>('pre[data-search-paragraph]');
        if (anchor) {
          host.id = anchor.id;
          host.dataset.searchParagraph = '';
        }
        const canvas = document.createElement('div');
        canvas.className = 'mermaid-canvas';
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', ui.diagram);
        const source = document.createElement('details');
        source.className = 'mermaid-source';
        const summary = document.createElement('summary');
        summary.textContent = ui.diagramSource;
        source.append(summary);
        const pre = document.createElement('pre');
        const lines = code.querySelectorAll('.ec-line .code');
        pre.textContent = lines.length
          ? [...lines].map((line) => line.textContent ?? '').join('\n')
          : (code.textContent ?? '');
        source.append(pre);
        const error = document.createElement('p');
        error.className = 'mermaid-error';
        error.hidden = true;
        error.setAttribute('role', 'status');
        host.append(canvas, source, error);
        // Keep shared Expressive Code assets if this is the first code block.
        const resources = [...block.children].filter((element) =>
          ['LINK', 'SCRIPT'].includes(element.tagName),
        );
        block.replaceWith(...resources, host);
        diagrams.push({
          host,
          source: pre.textContent,
          canvas,
          error,
          visible: false,
        });
      }
    let queue = Promise.resolve();
    const render = (diagram: (typeof diagrams)[number]) => {
      queue = queue.then(async () => {
        if (signal.aborted || !diagram.host.isConnected) return;
        try {
          mermaidModule ??= import('mermaid');
          const { default: mermaid } = await mermaidModule;
          if (signal.aborted) return;
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme:
              document.documentElement.dataset.theme === 'dark'
                ? 'dark'
                : 'default',
            fontFamily: 'system-ui, sans-serif',
            htmlLabels: false,
            suppressErrorRendering: true,
          });
          const { svg } = await mermaid.render(
            `bloggpt-diagram-${++diagramId}`,
            diagram.source,
          );
          if (signal.aborted || !diagram.host.isConnected) return;
          diagram.canvas.innerHTML = svg;
          diagram.error.hidden = true;
        } catch {
          if (signal.aborted) return;
          diagram.error.textContent = ui.diagramError;
          diagram.error.hidden = false;
          diagram.host.querySelector('details')?.setAttribute('open', '');
        }
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const diagram = diagrams.find((item) => item.host === entry.target);
            if (diagram) {
              diagram.visible = true;
              render(diagram);
            }
            observer.unobserve(entry.target);
          }
      },
      { rootMargin: '200px' },
    );
    for (const diagram of diagrams) observer.observe(diagram.host);
    const themeObserver = new MutationObserver(() => {
      for (const diagram of diagrams) if (diagram.visible) render(diagram);
    });
    if (diagrams.length)
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    cleanups.push(() => {
      observer.disconnect();
      themeObserver.disconnect();
    });
  }
  {
    const images: HTMLImageElement[] = [];
    let lightbox: import('photoswipe').default | undefined;
    for (const body of bodies.filter(
      (body) =>
        (body.dataset.lightbox ?? document.body.dataset.lightbox) === 'true',
    ))
      for (const image of body.querySelectorAll<HTMLImageElement>(
        'img:not([data-no-lightbox])',
      )) {
        if (image.closest('a,button')) continue;
        const anchor = document.createElement('a');
        anchor.className = 'lightbox-image';
        anchor.href = image.currentSrc || image.src;
        anchor.setAttribute(
          'aria-label',
          `${ui.viewImage}${image.alt ? `: ${image.alt}` : ''}`,
        );
        image.before(anchor);
        anchor.append(image);
        images.push(image);
        anchor.addEventListener(
          'click',
          async (event) => {
            if (
              event.button !== 0 ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            event.preventDefault();
            try {
              await image.decode();
              const [{ default: PhotoSwipe }] = await Promise.all([
                import('photoswipe'),
                loadLightboxStyles(),
              ]);
              if (signal.aborted) return;
              const available = images.filter(
                (item) => item.complete && item.naturalWidth > 0,
              );
              const index = available.indexOf(image);
              if (index < 0) return;
              lightbox?.destroy();
              lightbox = new PhotoSwipe({
                index,
                dataSource: available.map((item) => ({
                  src: item.currentSrc || item.src,
                  width: item.naturalWidth,
                  height: item.naturalHeight,
                  alt: item.alt,
                })),
                closeTitle: ui.close,
                zoomTitle: ui.zoomImage,
                arrowPrevTitle: ui.previous,
                arrowNextTitle: ui.next,
                errorMsg: ui.imageError,
                bgOpacity: 0.92,
                showHideAnimationType: matchMedia(
                  '(prefers-reduced-motion: reduce)',
                ).matches
                  ? 'none'
                  : 'fade',
              });
              lightbox.init();
            } catch {
              if (!signal.aborted) location.assign(anchor.href);
            }
          },
          { signal },
        );
      }
    cleanups.push(() => lightbox?.destroy());
  }
  dispose = () => {
    controller.abort();
    for (const cleanup of cleanups) cleanup();
  };
});
