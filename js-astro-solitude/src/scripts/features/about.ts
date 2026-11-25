import { lifecycle } from '@/scripts/core/lifecycle';
export const getAboutValue = (source: unknown, path: string): unknown => {
  if (!path) return source;
  return String(path)
    .split('.')
    .filter(Boolean)
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[key]
          : undefined,
      source,
    );
};

export const initAboutPage = () => {
  const aboutPage = document.getElementById('about-page');
  if (!aboutPage) return;
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const words = Array.from(
    aboutPage.querySelectorAll<HTMLElement>('[data-about-word]'),
  );
  if (words.length > 1 && !reduceMotion) {
    let wordIndex = 0;
    const rotateWord = () => {
      const previous = words[wordIndex];
      wordIndex = (wordIndex + 1) % words.length;
      const next = words[wordIndex];
      words.forEach((word) => {
        word.removeAttribute('data-show');
        word.removeAttribute('data-up');
      });
      previous.setAttribute('data-up', '');
      next.setAttribute('data-show', '');
    };
    const wordTimer = window.setInterval(rotateWord, 2000);
    lifecycle.add(() => window.clearInterval(wordTimer));
  }
  const canHover = window.matchMedia(
    '(hover: hover) and (pointer: fine)',
  ).matches;
  if (canHover && !reduceMotion) {
    aboutPage
      .querySelectorAll<HTMLElement>('.author-content-item')
      .forEach((card) => {
        let glow = card.querySelector(':scope > .about-pointer-glow');
        if (!glow) {
          glow = document.createElement('div');
          glow.className = 'about-pointer-glow';
          glow.setAttribute('aria-hidden', 'true');
          card.prepend(glow);
        }
        card.classList.add('about-glow-host');
        const updateGlowPosition = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--about-glow-x', `${x}%`);
          card.style.setProperty('--about-glow-y', `${y}%`);
        };
        const resetGlow = () => card.classList.remove('is-about-glow-active');
        lifecycle.listen(card, 'pointerenter', (event) => {
          updateGlowPosition(event);
          card.classList.add('is-about-glow-active');
        });
        lifecycle.listen(card, 'pointermove', updateGlowPosition);
        lifecycle.listen(card, 'pointerleave', resetGlow);
        lifecycle.listen(card, 'pointercancel', resetGlow);
        lifecycle.add(resetGlow);
      });
  }
  aboutPage
    .querySelectorAll<HTMLElement>('[data-about-stats]')
    .forEach(async (host) => {
      const configNode = host.querySelector<HTMLElement>(
        '[data-about-stats-config]',
      );
      if (!configNode?.textContent) return;
      let config: {
        source: { url: string; response_path: string };
        metrics?: { field: string }[];
      };
      try {
        config = JSON.parse(configNode.textContent);
      } catch {
        return;
      }
      const url = config?.source?.url?.trim?.();
      if (!url) return;
      const requestController = new AbortController();
      const abortRequest = () => requestController.abort();
      lifecycle.signal.addEventListener('abort', abortRequest, { once: true });
      const timeout = window.setTimeout(abortRequest, 5000);
      lifecycle.add(() => {
        window.clearTimeout(timeout);
        lifecycle.signal.removeEventListener('abort', abortRequest);
        requestController.abort();
      });
      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'omit',
          headers: { Accept: 'application/json' },
          signal: requestController.signal,
        });
        if (!response.ok) return;
        const payload = await response.json();
        const data = getAboutValue(payload, config.source.response_path);
        config.metrics?.forEach((metric) => {
          const rawValue = getAboutValue(data, metric.field);
          const value =
            typeof rawValue === 'number' ? rawValue : Number(rawValue);
          if (!Number.isFinite(value)) return;
          const output = Array.from(
            host.querySelectorAll<HTMLElement>('[data-about-metric]'),
          ).find((node) => node.dataset.aboutMetric === metric.field);
          if (output) output.textContent = value.toLocaleString();
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.debug('Solitude About statistics kept fallback values.');
        }
      } finally {
        window.clearTimeout(timeout);
        lifecycle.signal.removeEventListener('abort', abortRequest);
      }
    });
};
