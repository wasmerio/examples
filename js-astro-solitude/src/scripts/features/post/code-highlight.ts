import { Solitude } from '@/scripts/core/api';

export async function initializeCodeBlocks(signal: AbortSignal) {
  const config = Solitude.config.highlight;
  if (!config?.enable) return;
  const labels = Solitude.config.lang.code;
  document
    .querySelectorAll<HTMLPreElement>('article pre:not(.chartjs-src)')
    .forEach((pre) => {
      if (pre.closest('[data-code-block]')) return;
      const code = pre.querySelector('code');
      const source = code?.textContent ?? pre.textContent ?? '';
      const language =
        pre.dataset.language ||
        code?.className.replace('language-', '') ||
        'text';
      const block = document.createElement('figure');
      block.className = 'solitude-code code-block';
      block.toggleAttribute('data-code-block', true);
      block.dataset.language = language;
      block.dataset.codeLightTheme = config.themes.light;
      block.dataset.codeDarkTheme = config.themes.dark;
      block.classList.toggle(
        'code-block--line-numbers',
        config.line_numbers !== false,
      );
      const maxHeight = Math.max(0, Number(config.max_height) || 0);
      block.style.setProperty('--code-block-max-height', `${maxHeight}px`);
      for (const theme of ['light', 'dark']) {
        const background = pre.style.getPropertyValue(`--shiki-${theme}-bg`);
        if (background)
          block.style.setProperty(`--code-block-${theme}-theme-bg`, background);
      }
      const toolbar = document.createElement('figcaption');
      toolbar.className = 'code-block__toolbar';
      const label = document.createElement('span');
      label.className = 'code-block__language';
      label.textContent = language;
      toolbar.append(label);
      if (config.copy !== false) {
        const copy = document.createElement('button');
        copy.className = 'code-block__copy';
        copy.type = 'button';
        copy.dataset.codeCopy = '';
        copy.textContent = labels.copy;
        copy.setAttribute('aria-label', labels.copy);
        copy.setAttribute('aria-live', 'polite');
        let resetTimer: ReturnType<typeof setTimeout> | undefined;
        Solitude.onPageCleanup(() => clearTimeout(resetTimer));
        copy.addEventListener(
          'click',
          async () => {
            try {
              await navigator.clipboard.writeText(source);
              if (signal.aborted) return;
              copy.dataset.copyState = 'success';
              copy.textContent = labels.copied;
              copy.setAttribute('aria-label', labels.copied);
            } catch {
              if (signal.aborted) return;
              copy.dataset.copyState = 'error';
              copy.textContent = labels.copy;
              copy.setAttribute('aria-label', labels.copy);
              Solitude.snackbarShow(
                Solitude.config.lang.copy.error,
                false,
                2000,
              );
            }
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
              delete copy.dataset.copyState;
              copy.textContent = labels.copy;
              copy.setAttribute('aria-label', labels.copy);
            }, 2000);
          },
          { signal },
        );
        toolbar.append(copy);
      }
      const viewport = document.createElement('div');
      viewport.className = 'code-block__viewport';
      const expand = document.createElement('button');
      expand.className = 'code-block__expand';
      expand.type = 'button';
      expand.dataset.codeExpand = '';
      expand.textContent = labels.expand;
      expand.hidden = true;
      expand.setAttribute('aria-expanded', 'false');
      expand.addEventListener(
        'click',
        () => {
          block.classList.add('is-expanded');
          expand.setAttribute('aria-expanded', 'true');
          expand.hidden = true;
        },
        { signal },
      );
      pre.replaceWith(block);
      pre.classList.add('shiki');
      pre.tabIndex = 0;
      viewport.append(pre);
      block.append(toolbar, viewport, expand);
      const measure = () => {
        if (signal.aborted || !block.isConnected) return;
        const collapsible = maxHeight > 0 && viewport.scrollHeight > maxHeight;
        block.classList.toggle('is-collapsible', collapsible);
        expand.hidden = !collapsible || block.classList.contains('is-expanded');
      };
      const frame = requestAnimationFrame(measure);
      Solitude.onPageCleanup(() => cancelAnimationFrame(frame));
      void document.fonts.ready.then(measure);
    });
}
