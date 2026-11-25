export function setupComposer(form: HTMLFormElement, signal: AbortSignal) {
  const input = form.querySelector<HTMLInputElement>('input[name="q"]')!;
  const panel = form.querySelector<HTMLElement>('[data-completion-panel]');
  if (!panel) return;
  const list = panel.querySelector<HTMLElement>('[data-completion-list]')!;
  const trigger = form.querySelector<HTMLButtonElement>(
    '[data-completion-toggle]',
  );
  const originals = [
    ...panel.querySelectorAll<HTMLButtonElement>('[data-completion-value]'),
  ].map((item) => item.cloneNode(true) as HTMLButtonElement);
  const posts: { title: string; url: string }[] = JSON.parse(
    document.body.dataset.postTitles ?? '[]',
  );
  const locales: string[] = JSON.parse(
    document.body.dataset.completionLocales ?? '[]',
  );
  let active = -1,
    completing = false,
    opening = false;
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-haspopup', 'listbox');
  input.setAttribute('aria-controls', panel.id);
  input.setAttribute('aria-expanded', 'false');
  const items = () => [
    ...panel.querySelectorAll<HTMLButtonElement>('[data-completion-value]'),
  ];
  const hide = () => {
    if (panel.matches(':popover-open')) panel.hidePopover();
    active = -1;
    input.removeAttribute('aria-activedescendant');
    input.setAttribute('aria-expanded', 'false');
    trigger?.setAttribute('aria-expanded', 'false');
  };
  const position = () => {
    const rect = form.getBoundingClientRect(),
      below = rect.bottom + 4,
      room = innerHeight - below - 12;
    panel.style.setProperty('--popover-width', `${rect.width}px`);
    panel.style.setProperty(
      '--completion-max-height',
      `${Math.max(80, Math.min(430, innerHeight * 0.55, room >= 120 ? room : rect.top - 16))}px`,
    );
    panel.style.setProperty(
      '--popover-x',
      `${Math.max(8, Math.min(rect.left, innerWidth - rect.width - 8))}px`,
    );
    panel.style.setProperty(
      '--popover-y',
      `${room >= 120 ? below : Math.max(8, rect.top - panel.getBoundingClientRect().height - 4)}px`,
    );
  };
  const show = () => {
    if (opening || !list.childElementCount) return;
    opening = true;
    try {
      if (!panel.matches(':popover-open')) panel.showPopover();
      position();
      input.setAttribute('aria-expanded', 'true');
      trigger?.setAttribute('aria-expanded', 'true');
    } finally {
      opening = false;
    }
  };
  const option = (value: string, title: string, source?: HTMLButtonElement) => {
    const item = source
      ? (source.cloneNode(true) as HTMLButtonElement)
      : document.createElement('button');
    item.type = 'button';
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
    item.dataset.completionValue = value;
    const text =
      item.querySelector('span') ??
      item.appendChild(document.createElement('span'));
    text.textContent = title;
    return item;
  };
  const render = (forceDefault = false) => {
    const value = input.value.trimStart();
    let entries: HTMLButtonElement[];
    if (!forceDefault && value.startsWith('@')) {
      const query = value.slice(1).toLocaleLowerCase();
      const source = originals.find((item) =>
        item.dataset.completionValue?.startsWith('@'),
      );
      entries = posts
        .filter((post) => post.title.toLocaleLowerCase().includes(query))
        .map((post) => option(`@${post.title}`, post.title, source));
    } else if (!forceDefault && value.startsWith('/')) {
      const [name, argument] = value.slice(1).toLowerCase().split(/\s+/);
      const source = originals.find(
        (item) => item.dataset.completionName === name,
      );
      if ((name === 'theme' || name === 'lang') && value.includes(' ')) {
        const choices =
          name === 'theme' ? ['light', 'dark', 'system'] : locales;
        entries = choices
          .filter((choice) => choice.toLowerCase().startsWith(argument ?? ''))
          .map((choice) =>
            option(`/${name} ${choice}`, `/${name} ${choice}`, source),
          );
      } else
        entries = originals
          .filter((item) => item.dataset.completionName?.startsWith(name))
          .map((item) => item.cloneNode(true) as HTMLButtonElement);
    } else
      entries = originals.map(
        (item) => item.cloneNode(true) as HTMLButtonElement,
      );
    active = -1;
    input.removeAttribute('aria-activedescendant');
    entries.forEach((item, index) => {
      item.id = `${panel.id}-option-${index}`;
    });
    list.replaceChildren(...entries);
    list.scrollTop = 0;
  };
  const complete = (item: HTMLButtonElement) => {
    completing = true;
    input.value = item.dataset.completionValue ?? '';
    hide();
    input.focus({ preventScroll: true });
    input.dispatchEvent(new Event('input', { bubbles: true }));
    completing = false;
  };
  panel.addEventListener(
    'click',
    (event) => {
      const item = (event.target as Element).closest<HTMLButtonElement>(
        '[data-completion-value]',
      );
      if (item) {
        event.preventDefault();
        complete(item);
      }
    },
    { signal },
  );
  panel.addEventListener(
    'pointerdown',
    (event) => {
      if ((event.target as Element).closest('[data-completion-value]'))
        event.preventDefault();
    },
    {
      signal,
    },
  );
  input.addEventListener(
    'input',
    () => {
      if (completing) return;
      if (/^\s*[/@]/.test(input.value)) {
        render();
        if (list.childElementCount) show();
        else hide();
      } else hide();
    },
    { signal },
  );
  input.addEventListener(
    'keydown',
    (event) => {
      if (!panel.matches(':popover-open') || event.isComposing) return;
      const options = items();
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        active =
          active < 0
            ? event.key === 'ArrowDown'
              ? 0
              : options.length - 1
            : (active + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
              options.length;
        options.forEach((item, index) =>
          item.setAttribute('aria-selected', String(index === active)),
        );
        input.setAttribute('aria-activedescendant', options[active].id);
        options[active].scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'Enter' && active >= 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
        complete(options[active]);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        hide();
      } else if (event.key === 'Tab') hide();
    },
    { signal },
  );
  trigger?.addEventListener(
    'click',
    () => {
      if (panel.matches(':popover-open')) hide();
      else {
        render(true);
        show();
        input.focus({ preventScroll: true });
      }
    },
    { signal },
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (!form.contains(event.target as Node)) hide();
    },
    { signal },
  );
  window.addEventListener(
    'resize',
    () => {
      if (panel.matches(':popover-open')) position();
    },
    { signal },
  );
  document.addEventListener(
    'scroll',
    () => {
      if (panel.matches(':popover-open')) position();
    },
    { signal, capture: true },
  );
  form.addEventListener('submit', hide, { signal });
  panel.addEventListener(
    'toggle',
    () => {
      const expanded = String(panel.matches(':popover-open'));
      input.setAttribute('aria-expanded', expanded);
      trigger?.setAttribute('aria-expanded', expanded);
    },
    { signal },
  );
  signal.addEventListener('abort', hide, { once: true });
}
