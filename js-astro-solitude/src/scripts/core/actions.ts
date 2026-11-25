export const initActionDelegation = (api: object) => {
  if (document.documentElement.dataset.solitudeActions === 'true') return;
  document.documentElement.dataset.solitudeActions = 'true';

  // ClientRouter handles links on document before the deferred theme runtime.
  // Cancel action-only links during capture, before it can start a page swap.
  // Keep action dispatch in the bubble phase so ordinary nested links still
  // reach ClientRouter (for example, a tag link inside a clickable post card).
  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('[data-solitude-prevent="true"]'))
        event.preventDefault();
    },
    true,
  );

  const dispatch = (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>('[data-solitude-action]');
    if (!element) return;
    const action: unknown = Reflect.get(
      api,
      element.dataset.solitudeAction ?? '',
    );
    if (typeof action !== 'function') return;

    if (element.dataset.solitudePrevent === 'true') event.preventDefault();
    if (element.dataset.solitudeStop === 'true') event.stopPropagation();

    let argument;
    if (element.dataset.solitudeTarget)
      argument = element.dataset.solitudeTarget;
    else if (element.dataset.solitudeUrl)
      argument = element.dataset.solitudeUrl;
    else if (element.dataset.solitudeValue)
      argument = element.dataset.solitudeValue;
    else if (element.dataset.solitudeEvent === 'true') argument = event;

    action.call(api, argument, event, element);
  };

  document.addEventListener('click', dispatch);
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>('[data-solitude-action]');
    if (!element || /^(A|BUTTON|INPUT)$/.test(element.tagName)) return;
    event.preventDefault();
    element.click();
  });

  document.addEventListener(
    'error',
    (event) => {
      const element = event.target;
      if (!(element instanceof HTMLElement)) return;
      if (element.matches('[data-solitude-hide-ads]')) {
        document
          .querySelectorAll<HTMLElement>('.google-ads-warp')
          .forEach((item) => {
            item.style.display = 'none';
          });
      }
      const fallback = element.dataset.solitudeFallback;
      if (fallback && element.getAttribute('src') !== fallback) {
        element.removeAttribute('data-solitude-fallback');
        element.setAttribute('src', fallback);
      }
    },
    true,
  );
};
