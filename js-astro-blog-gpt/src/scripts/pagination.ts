import { navigate } from 'astro:transitions/client';

export function setupPagination(signal: AbortSignal) {
  document
    .querySelectorAll<HTMLFormElement>('[data-page-jump]')
    .forEach((form) => {
      const button = form.querySelector<HTMLButtonElement>('[data-page-edit]');
      const input = form.querySelector<HTMLInputElement>('[data-page-input]');
      if (!button || !input) return;
      const current = Number(form.dataset.currentPage);
      const total = Number(form.dataset.totalPages);
      let editing = false;
      let navigating = false;

      const cancel = (restoreFocus = false) => {
        editing = false;
        input.hidden = true;
        button.hidden = false;
        input.value = String(current);
        input.setCustomValidity('');
        if (restoreFocus) button.focus();
      };
      const commit = (reportError: boolean) => {
        if (!editing || navigating) return;
        const value = input.value.trim();
        const page = Number(value);
        if (
          !/^\d+$/.test(value) ||
          !Number.isSafeInteger(page) ||
          page < 1 ||
          page > total
        ) {
          if (reportError) {
            input.setCustomValidity(
              (form.dataset.rangeMessage ?? '').replace(
                '{pages}',
                String(total),
              ),
            );
            input.reportValidity();
          } else cancel();
          return;
        }
        if (page === current) {
          cancel(reportError);
          return;
        }
        navigating = true;
        const target =
          page === 1
            ? form.dataset.firstPage!
            : `${form.dataset.pagePrefix}${page}/`;
        void navigate(target).catch(() => window.location.assign(target));
      };

      button.addEventListener(
        'click',
        () => {
          editing = true;
          button.hidden = true;
          input.hidden = false;
          input.focus();
          input.select();
        },
        { signal },
      );
      form.addEventListener(
        'submit',
        (event) => {
          event.preventDefault();
          commit(true);
        },
        { signal },
      );
      input.addEventListener('input', () => input.setCustomValidity(''), {
        signal,
      });
      input.addEventListener(
        'keydown',
        (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            cancel(true);
          } else if (event.key === 'Enter') {
            event.preventDefault();
            commit(true);
          }
        },
        { signal },
      );
      input.addEventListener('blur', () => commit(false), { signal });
    });
}
