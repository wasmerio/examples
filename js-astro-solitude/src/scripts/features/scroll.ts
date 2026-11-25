import { Solitude } from '@/scripts/core/api';
import { lifecycle } from '@/scripts/core/lifecycle';
import { initThemeColor } from '@/scripts/features/theme';
export const scrollFn = () => {
  const $rightside = document.getElementById('rightside');
  const $header = document.getElementById('page-header');
  if (!$header) return;
  let initTop = window.scrollY || document.documentElement.scrollTop;
  const updateHeaderAndRightside = (isDown: boolean, currentTop: number) => {
    const isAtTop = currentTop <= 0;
    $header.classList.toggle('nav-at-top', isAtTop);
    if (!isAtTop) {
      $header.classList.toggle('nav-visible', !isDown);
      $header.classList.add('nav-fixed');
      if ($rightside) {
        $rightside.classList.add('is-visible');
      }
    } else {
      $header.classList.remove('nav-fixed', 'nav-visible');
      if ($rightside) {
        $rightside.classList.remove('is-visible');
      }
    }
  };
  const handleScroll = () => {
    initThemeColor();
    const currentTop = window.scrollY || document.documentElement.scrollTop;
    const isDown = currentTop > initTop;
    initTop = currentTop;
    updateHeaderAndRightside(isDown, currentTop);
  };
  let ticking = false;
  const onScroll = () => {
    const currentTop = window.scrollY || document.documentElement.scrollTop;
    if (currentTop <= 0) {
      initTop = 0;
      updateHeaderAndRightside(false, 0);
      return;
    }
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };
  lifecycle.listen(window, 'scroll', onScroll, { passive: true });
  updateHeaderAndRightside(false, initTop);
};

export const percent = () => {
  const docEl = document.documentElement;
  const body = document.body;
  const scrollPos = window.pageYOffset || docEl.scrollTop;
  const totalScrollableHeight =
    Math.max(
      body.scrollHeight,
      docEl.scrollHeight,
      body.offsetHeight,
      docEl.offsetHeight,
      body.clientHeight,
      docEl.clientHeight,
    ) - docEl.clientHeight;
  const scrolledPercent =
    totalScrollableHeight > 0
      ? Math.round((scrollPos / totalScrollableHeight) * 100)
      : 0;
  const navToTop = document.querySelector<HTMLElement>('#nav-totop');
  const percentDisplay = document.querySelector<HTMLElement>(
    '#nav-totop #percent',
  );
  const endTarget =
    document.getElementById('post-comment') ||
    document.getElementById('footer');
  const isNearEnd = endTarget
    ? window.scrollY + docEl.clientHeight >= endTarget.offsetTop
    : false;
  navToTop?.classList.toggle('long', isNearEnd || scrolledPercent > 90);
  if (percentDisplay)
    percentDisplay.textContent =
      isNearEnd || scrolledPercent > 90
        ? Solitude.config.lang.backtop
        : String(scrolledPercent);
  document
    .querySelectorAll<HTMLElement>('.needEndHide')
    .forEach((item) =>
      item.classList.toggle('hide', totalScrollableHeight - scrollPos < 100),
    );
};
