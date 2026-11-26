const codeLanguageLabels: Record<string, string> = {
  astro: 'Astro',
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  md: 'Markdown',
  mdx: 'MDX',
  sh: 'Shell',
  text: 'Text',
  ts: 'TypeScript',
  tsx: 'TSX',
  xml: 'XML',
  yaml: 'YAML',
  yml: 'YAML',
};

const visibleCodeLanguages = new Set(
  Object.keys(codeLanguageLabels).filter((language) => !['md', 'mdx', 'text'].includes(language)),
);

type TocHeadingTarget = {
  slug: string;
  element: HTMLElement;
};

const isHtmlAnchor = (element: Element): element is HTMLAnchorElement => element instanceof HTMLAnchorElement;

const isHtmlElement = (element: Element | null): element is HTMLElement => element instanceof HTMLElement;

const getTocLinks = () => Array.from(document.querySelectorAll('[data-toc-link]')).filter(isHtmlAnchor);

const getTocHeadingTargets = (tocLinks: HTMLAnchorElement[]): TocHeadingTarget[] =>
  Array.from(
    new Map(
      tocLinks.map((link) => {
        const slug = link.getAttribute('data-toc-link') ?? '';
        const target = slug ? document.getElementById(slug) : null;
        return [slug, target];
      }),
    ).entries(),
  )
    .map(([slug, element]) => ({ slug, element }))
    .filter((entry): entry is TocHeadingTarget => Boolean(entry.slug) && entry.element instanceof HTMLElement);

const initArticleToc = () => {
  const mobileTocCurrent = document.querySelector('[data-mobile-toc-current]');
  const mobileTocDetails = document.querySelector('.docs-mobile-toc');
  const tocLinks = getTocLinks();
  const tocHeadingTargets = getTocHeadingTargets(tocLinks);

  const setCurrentTocHeading = (slug: string) => {
    tocLinks.forEach((link) => {
      const isCurrent = link.getAttribute('data-toc-link') === slug;
      link.classList.toggle('is-current', isCurrent);

      if (isCurrent) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (mobileTocCurrent instanceof HTMLElement) {
      const activeLink = tocLinks.find((link) => link.getAttribute('data-toc-link') === slug);
      mobileTocCurrent.textContent = activeLink?.textContent?.trim() ?? '';
    }
  };

  if (tocHeadingTargets.length > 0) {
    const updateCurrentHeading = () => {
      const scrollOffset = 140;
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (scrolledToBottom) {
        setCurrentTocHeading(tocHeadingTargets[tocHeadingTargets.length - 1].slug);
        return;
      }

      let activeHeading = tocHeadingTargets[0];

      tocHeadingTargets.forEach((entry) => {
        if (entry.element.getBoundingClientRect().top - scrollOffset <= 0) {
          activeHeading = entry;
        }
      });

      setCurrentTocHeading(activeHeading.slug);
    };

    updateCurrentHeading();
    document.addEventListener('scroll', updateCurrentHeading, { passive: true });
    window.addEventListener('resize', updateCurrentHeading);
  }

  if (mobileTocDetails instanceof HTMLDetailsElement) {
    mobileTocDetails.querySelectorAll('[data-toc-link]').forEach((link) => {
      link.addEventListener('click', () => {
        mobileTocDetails.open = false;
      });
    });
  }
};

const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

const copyIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <rect x="9" y="9" width="10" height="10" rx="2"></rect>
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
  </svg>
`;

const failedIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18"></path>
  </svg>
`;

const initCodeBlocks = () => {
  document.querySelectorAll('.astro-code').forEach((block) => {
    if (!(block instanceof HTMLElement) || block.parentElement?.classList.contains('code-block-shell')) return;

    const codeElement = block.querySelector('code');
    const codeText = codeElement?.textContent;
    if (!codeText) return;

    const language = (block.dataset.language ?? '').trim().toLowerCase();
    const languageLabel = codeLanguageLabels[language] ?? (language ? language.toUpperCase() : '');

    const shell = document.createElement('div');
    shell.className = 'code-block-shell';
    block.parentNode?.insertBefore(shell, block);
    shell.append(block);

    // The header sits on the shell, not the scrolling <pre>, so it stays put when long lines scroll.
    if (language && languageLabel && visibleCodeLanguages.has(language)) {
      const header = document.createElement('div');
      header.className = 'code-block-header';

      const languageTab = document.createElement('span');
      languageTab.className = 'code-block-language-tab';
      languageTab.textContent = languageLabel;

      header.append(languageTab);
      shell.append(header);
    } else {
      block.classList.add('astro-code-without-header');
    }

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'code-block-copy';
    copyButton.setAttribute('aria-label', 'Copy code');
    copyButton.setAttribute('title', 'Copy code');
    copyButton.innerHTML = copyIcon;

    let tooltipResetTimeout: number | undefined;
    const showCopyTooltip = (message: string, tone = 'success') => {
      copyButton.dataset.copyState = tone;
      copyButton.dataset.copyTooltip = message;

      if (tooltipResetTimeout) window.clearTimeout(tooltipResetTimeout);
      tooltipResetTimeout = window.setTimeout(() => {
        delete copyButton.dataset.copyState;
        delete copyButton.dataset.copyTooltip;
      }, 1600);
    };

    copyButton.addEventListener('click', async () => {
      try {
        await copyText(codeText);
        copyButton.setAttribute('aria-label', 'Copied');
        copyButton.setAttribute('title', 'Copied');
        showCopyTooltip('Copied');
        window.setTimeout(() => {
          copyButton.setAttribute('aria-label', 'Copy code');
          copyButton.setAttribute('title', 'Copy code');
        }, 1600);
      } catch {
        copyButton.innerHTML = failedIcon;
        copyButton.setAttribute('aria-label', 'Copy failed');
        copyButton.setAttribute('title', 'Copy failed');
        showCopyTooltip('Copy failed', 'error');
        window.setTimeout(() => {
          copyButton.innerHTML = copyIcon;
          copyButton.setAttribute('aria-label', 'Copy code');
          copyButton.setAttribute('title', 'Copy code');
        }, 1600);
      }
    });

    shell.append(copyButton);
  });
};

const initImageLightbox = () => {
  const articleRoot = document.querySelector('.docs-article');
  if (!(articleRoot instanceof HTMLElement)) return;

  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'docs-lightbox-overlay';
  lightboxOverlay.hidden = true;
  lightboxOverlay.setAttribute('aria-hidden', 'true');

  const lightboxBackdrop = document.createElement('button');
  lightboxBackdrop.type = 'button';
  lightboxBackdrop.className = 'docs-lightbox-backdrop';
  lightboxBackdrop.setAttribute('aria-label', 'Close expanded image');

  const lightboxDialog = document.createElement('div');
  lightboxDialog.className = 'docs-lightbox-dialog';
  lightboxDialog.setAttribute('role', 'dialog');
  lightboxDialog.setAttribute('aria-modal', 'true');
  lightboxDialog.setAttribute('aria-label', 'Expanded article image');
  lightboxDialog.tabIndex = -1;

  const lightboxFigure = document.createElement('figure');
  lightboxFigure.className = 'docs-lightbox-figure';

  const lightboxImage = document.createElement('img');
  lightboxImage.className = 'docs-lightbox-image';
  lightboxImage.alt = '';

  const lightboxCaption = document.createElement('figcaption');
  lightboxCaption.className = 'docs-lightbox-caption';
  lightboxCaption.hidden = true;

  lightboxFigure.append(lightboxImage, lightboxCaption);
  lightboxDialog.append(lightboxFigure);
  lightboxOverlay.append(lightboxBackdrop, lightboxDialog);
  document.body.append(lightboxOverlay);

  let lastTrigger: HTMLElement | null = null;
  const inertTargets = Array.from(document.body.children).filter((child) => child !== lightboxOverlay);

  const getFocusableElements = () =>
    Array.from(
      lightboxDialog.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element): element is HTMLElement => element instanceof HTMLElement);

  const setBackgroundInert = (isInert: boolean) => {
    inertTargets.forEach((target) => {
      if (!(target instanceof HTMLElement)) return;

      if (isInert) {
        target.dataset.lightboxPrevAriaHidden = target.getAttribute('aria-hidden') ?? '';
        target.inert = true;
        target.setAttribute('aria-hidden', 'true');
      } else {
        target.inert = false;
        const previousAriaHidden = target.dataset.lightboxPrevAriaHidden;

        if (previousAriaHidden) {
          target.setAttribute('aria-hidden', previousAriaHidden);
        } else {
          target.removeAttribute('aria-hidden');
        }

        delete target.dataset.lightboxPrevAriaHidden;
      }
    });
  };

  const closeLightbox = () => {
    lightboxOverlay.hidden = true;
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setBackgroundInert(false);
    lightboxImage.removeAttribute('src');
    lightboxImage.removeAttribute('srcset');
    if (lastTrigger instanceof HTMLElement) lastTrigger.focus();
    lastTrigger = null;
  };

  const openLightbox = (trigger: HTMLElement, image: HTMLImageElement) => {
    const source = image.currentSrc || image.src;
    if (!source) return;

    const alt = image.getAttribute('alt') ?? '';
    lastTrigger = trigger;
    lightboxImage.src = source;
    if (image.srcset) {
      lightboxImage.srcset = image.srcset;
      lightboxImage.sizes = '100vw';
    } else {
      lightboxImage.removeAttribute('srcset');
      lightboxImage.removeAttribute('sizes');
    }
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt;
    lightboxCaption.hidden = !alt;
    lightboxOverlay.hidden = false;
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setBackgroundInert(true);
    lightboxDialog.focus();
  };

  articleRoot.querySelectorAll('img').forEach((image) => {
    if (!(image instanceof HTMLImageElement)) return;
    if (image.closest('.docs-lightbox-overlay')) return;
    if (image.closest('a, button')) return;

    const media = image.closest('picture') ?? image;
    if (!isHtmlElement(media) || media.parentElement?.classList.contains('docs-lightbox-trigger')) return;

    image.dataset.lightboxImage = 'true';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'docs-lightbox-trigger';
    trigger.setAttribute('aria-label', `Expand image${image.alt ? `: ${image.alt}` : ''}`);

    const parent = media.parentNode;
    if (!parent) return;

    parent.insertBefore(trigger, media);
    trigger.append(media);
    trigger.addEventListener('click', () => openLightbox(trigger, image));
  });

  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxImage.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (event) => {
    if (event.target === lightboxOverlay) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (lightboxOverlay.hidden) return;

    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      lightboxDialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
};

const initHeadingAnchors = () => {
  document.querySelectorAll('.docs-article .prose :is(h2, h3)[id]').forEach((heading) => {
    if (heading.closest('.not-prose') || heading.querySelector('.heading-anchor')) return;

    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = `#${heading.id}`;
    anchor.textContent = '#';
    anchor.setAttribute('aria-label', `Link to ${heading.textContent?.trim() ?? 'this section'}`);
    heading.append(anchor);
  });
};

const initCopyPage = () => {
  const button = document.querySelector<HTMLButtonElement>('[data-copy-page]');
  const source = document.getElementById('page-markdown');
  if (!button || !(source instanceof HTMLScriptElement)) return;

  const label = button.querySelector('[data-copy-page-label]');
  let resetTimeout: number | undefined;

  button.addEventListener('click', async () => {
    try {
      await copyText(JSON.parse(source.textContent ?? '""') as string);
      button.toggleAttribute('data-copied', true);
      if (label) label.textContent = 'Copied';
    } catch {
      if (label) label.textContent = 'Copy failed';
    }

    window.clearTimeout(resetTimeout);
    resetTimeout = window.setTimeout(() => {
      button.removeAttribute('data-copied');
      if (label) label.textContent = 'Copy page';
    }, 1800);
  });
};

const initArticleEnhancements = () => {
  initArticleToc();
  initCodeBlocks();
  initImageLightbox();
  initHeadingAnchors();
  initCopyPage();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleEnhancements, { once: true });
} else {
  initArticleEnhancements();
}
