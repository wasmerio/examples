let dispose: (() => void) | undefined;
document.addEventListener('astro:before-swap', () => dispose?.());
document.addEventListener('astro:page-load', () => {
  dispose?.();
  const dialog = document.querySelector<HTMLDialogElement>('#blog-status');
  const card = dialog?.querySelector<HTMLElement>('#statistics-detail');
  if (!dialog || !card) return;
  const controller = new AbortController(),
    { signal } = controller;
  const title = card.querySelector<HTMLElement>(
    '[data-statistics-detail-title]',
  )!;
  const content = card.querySelector<HTMLElement>(
    '[data-statistics-detail-content]',
  )!;
  let anchor: Element | undefined;
  let pointer: { x: number; y: number } | undefined;
  let timer: ReturnType<typeof setTimeout>;
  const hide = () => {
    clearTimeout(timer);
    if (card.matches(':popover-open')) card.hidePopover();
    anchor = undefined;
    pointer = undefined;
  };
  const position = () => {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect(),
      box = card.getBoundingClientRect();
    const viewport = document.documentElement;
    const x = pointer
      ? pointer.x + 14
      : rect.left + rect.width / 2 - box.width / 2;
    const y = pointer ? pointer.y + 14 : rect.bottom + 8;
    card.style.left = `${Math.max(8, Math.min(x, viewport.clientWidth - box.width - 8))}px`;
    card.style.top = `${Math.max(8, Math.min(y + box.height <= viewport.clientHeight - 8 ? y : (pointer?.y ?? rect.top) - box.height - 14, viewport.clientHeight - box.height - 8))}px`;
  };
  const show = (target: Element, event?: PointerEvent) => {
    clearTimeout(timer);
    pointer =
      event && event.pointerType !== 'touch'
        ? { x: event.clientX, y: event.clientY }
        : undefined;
    const template = document.getElementById(
      target.getAttribute('data-statistics-template')!,
    ) as HTMLTemplateElement | null;
    if (!template) {
      hide();
      return;
    }
    if (anchor === target && card.matches(':popover-open')) {
      position();
      return;
    }
    anchor = target;
    title.textContent = target.getAttribute('data-statistics-label');
    title.hidden = !title.textContent;
    content.replaceChildren(template.content.cloneNode(true));
    if (!card.matches(':popover-open')) card.showPopover();
    position();
  };
  const later = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (
        !card.matches(':hover') &&
        !card.contains(document.activeElement) &&
        !anchor?.matches(':hover, :focus-visible')
      )
        hide();
    }, 180);
  };
  for (const target of dialog.querySelectorAll<HTMLElement | SVGElement>(
    '[data-statistics-template]',
  )) {
    target.addEventListener(
      'pointerenter',
      (event) => show(target, event as PointerEvent),
      { signal },
    );
    target.addEventListener(
      'pointermove',
      (event) => show(target, event as PointerEvent),
      { signal },
    );
    target.addEventListener('pointerleave', later, { signal });
    target.addEventListener('focus', () => show(target), { signal });
    target.addEventListener('blur', later, { signal });
    // Heatmap cells can be opened by touch or keyboard without navigating.
    if (target.getAttribute('role') === 'button') {
      target.addEventListener('click', () => show(target), { signal });
      target.addEventListener(
        'keydown',
        (event) => {
          if (
            event instanceof KeyboardEvent &&
            (event.key === 'Enter' || event.key === ' ')
          ) {
            event.preventDefault();
            show(target);
          }
        },
        { signal },
      );
    }
  }
  card.addEventListener('pointerenter', () => clearTimeout(timer), { signal });
  card.addEventListener('pointerleave', later, { signal });
  card.addEventListener('focusout', later, { signal });
  dialog.querySelector('.publication-heatmap')?.addEventListener(
    'pointerover',
    (event) => {
      if ((event.target as Element).matches('rect[data-level="0"]')) hide();
    },
    { signal },
  );
  let pressedBackdrop = false;
  const onBackdrop = (event: MouseEvent) => {
    const rect = dialog.getBoundingClientRect();
    return (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    );
  };
  dialog.addEventListener(
    'pointerdown',
    (event) => {
      pressedBackdrop = onBackdrop(event);
    },
    { signal },
  );
  dialog.addEventListener(
    'click',
    (event) => {
      if (pressedBackdrop && onBackdrop(event)) dialog.close();
      pressedBackdrop = false;
    },
    { signal },
  );
  dialog.addEventListener(
    'pointercancel',
    () => {
      pressedBackdrop = false;
    },
    { signal },
  );
  dialog.addEventListener('close', hide, { signal });
  dialog.addEventListener(
    'scroll',
    (event) => {
      if (!card.contains(event.target as Node)) hide();
    },
    { signal, capture: true },
  );
  window.addEventListener('resize', hide, { signal });
  dialog.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && card.matches(':popover-open')) {
        event.preventDefault();
        hide();
      }
    },
    { signal },
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      const target = event.target as Node;
      if (!card.contains(target) && !anchor?.contains(target)) hide();
    },
    { signal },
  );
  dispose = () => {
    hide();
    controller.abort();
  };
});
