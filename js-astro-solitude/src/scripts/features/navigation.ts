import { Solitude } from '@/scripts/core/api';
import { lifecycle } from '@/scripts/core/lifecycle';
export const sidebarFn = () => {
  const $toggleMenu = document.getElementById('toggle-menu');
  const $mobileSidebarMenus = document.getElementById('sidebar-menus');
  const $menuMask = document.getElementById('menu-mask');
  const $body = document.body;
  if (!$toggleMenu || !$mobileSidebarMenus || !$menuMask) return;
  const toggleMobileSidebar = (isOpen: boolean) => {
    $body.style.overflow = isOpen ? 'hidden' : '';
    Solitude[isOpen ? 'fadeIn' : 'fadeOut']($menuMask, 0.5);
    $mobileSidebarMenus.classList.toggle('open', isOpen);
  };
  const closeMobileSidebar = () => {
    if ($mobileSidebarMenus.classList.contains('open')) {
      toggleMobileSidebar(false);
    }
  };
  if (!$toggleMenu || !$mobileSidebarMenus || !$menuMask) return;
  lifecycle.listen($toggleMenu, 'click', (event) => {
    event.preventDefault();
    toggleMobileSidebar(true);
  });
  lifecycle.listen($menuMask, 'click', closeMobileSidebar);
  let resizeFrame = 0;
  lifecycle.listen(window, 'resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      if (
        Solitude.isHidden($toggleMenu) &&
        $mobileSidebarMenus.classList.contains('open')
      ) {
        closeMobileSidebar();
      }
    });
  });
  lifecycle.add(() => cancelAnimationFrame(resizeFrame));
};

export const initAsideTagCloudOverflow = () => {
  const tagClouds = [
    ...document.querySelectorAll<HTMLElement>('#aside-content .card-tag-cloud'),
  ];
  if (!tagClouds.length) return;
  const frames = new Set<number>();
  const updateOverflowState = (tagCloud: Element) => {
    tagCloud.classList.toggle(
      'is-overflowing',
      !tagCloud.classList.contains('all-tags') &&
        tagCloud.scrollHeight > tagCloud.clientHeight,
    );
  };
  const scheduleUpdate = (tagCloud: Element) => {
    const frame = requestAnimationFrame(() => {
      frames.delete(frame);
      updateOverflowState(tagCloud);
    });
    frames.add(frame);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => scheduleUpdate(entry.target));
  });
  tagClouds.forEach((tagCloud: Element) => {
    resizeObserver.observe(tagCloud);
    scheduleUpdate(tagCloud);
  });
  lifecycle.add(() => {
    resizeObserver.disconnect();
    frames.forEach(cancelAnimationFrame);
  });
};

export const navigationActions = {
  randomPost() {
    const posts = Solitude.config.random_posts || [];
    if (!posts.length) return;
    Solitude.navigate(posts[Solitude.randomNum(posts.length)]);
  },
  noop() {},
  navigateTo(url: string) {
    Solitude.navigate(url);
  },
  openExternal(url: string) {
    if (url) window.open(url, '_blank', 'noopener');
  },
  toggleTargetClass(
    target: string | undefined,
    _event: Event | undefined,
    element: HTMLElement | undefined,
  ) {
    const selector = target || element?.dataset.solitudeTarget;
    if (!selector) return;
    const className = element?.dataset.solitudeClass || 'show';
    document.querySelector(selector)?.classList.toggle(className);
  },
  setTargetClass(
    target: string | undefined,
    _event: Event | undefined,
    element: HTMLElement | undefined,
  ) {
    const selector = target || element?.dataset.solitudeTarget;
    if (!selector) return;
    const className = element?.dataset.solitudeClass || 'show';
    const enabled = element?.dataset.solitudeEnabled !== 'false';
    document
      .querySelectorAll(selector)
      .forEach((item) => item.classList.toggle(className, enabled));
  },
  runConfiguredAction(command: string) {
    const source = String(command || '')
      .trim()
      .replace(/;$/, '');
    const call = source.match(/^(?:Solitude\.)?([A-Za-z_$][\w$]*)\(\)$/);
    const action: unknown = call ? Reflect.get(Solitude, call[1]) : undefined;
    if (typeof action === 'function') {
      action.call(Solitude);
    } else {
      const navigation = source.match(
        /^(?:pjax\.loadUrl|Solitude\.navigate)\((['"])(.*?)\1\)$/,
      );
      if (navigation) Solitude.navigate(navigation[2]);
    }
    Solitude.hideRightMenu?.();
  },
  scrollTo(elementId: string) {
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scroll({ top: targetPosition, behavior: 'smooth' });
    }
  },
  hideTodayCard: () =>
    document.getElementById('todayCard')?.classList.add('hide'),
  toTop: () => Solitude.scrollToDest(0),
  tagPageActive() {
    const decodedPath = decodeURIComponent(window.location.pathname);
    const isTagPage = /\/tags\/.*?\//.test(decodedPath);
    if (isTagPage) {
      const tag = decodedPath.split('/').slice(-2, -1)[0];
      const tagElement = document.getElementById(tag);
      if (tagElement) {
        document.querySelectorAll('a.select').forEach((link) => {
          link.classList.remove('select');
        });
        tagElement.classList.add('select');
      }
    }
  },
  categoriesBarActive() {
    const categoryBar = document.querySelector<HTMLElement>('#category-bar');
    const currentPath = decodeURIComponent(window.location.pathname);
    const isHomePage = currentPath === Solitude.config.root;
    if (categoryBar) {
      const categoryItems =
        categoryBar.querySelectorAll<HTMLElement>('.category-bar-item');
      categoryItems.forEach((item) => item.classList.remove('select'));
      const activeItemId = isHomePage
        ? 'category-bar-home'
        : currentPath.split('/').slice(-2, -1)[0];
      const activeItem = document.getElementById(activeItemId);
      if (activeItem) {
        activeItem.classList.add('select');
      }
    }
  },
  scrollCategoryBarToRight() {
    const scrollBar = document.getElementById('category-bar-items');
    const nextElement = document.getElementById('category-bar-next');
    if (scrollBar) {
      const isScrollBarAtEnd = () =>
        scrollBar.scrollLeft + scrollBar.clientWidth >=
        scrollBar.scrollWidth - 8;
      const scroll = () => {
        scrollBar.scroll({
          left: isScrollBarAtEnd() ? 0 : scrollBar.clientWidth,
          behavior: 'smooth',
        });
      };
      if (scrollBar.dataset.solitudeScrollBound !== 'true') {
        scrollBar.dataset.solitudeScrollBound = 'true';
        lifecycle.add(() => clearTimeout(Solitude.timeoutId));
        lifecycle.listen(
          scrollBar,
          'scroll',
          () => {
            clearTimeout(Solitude.timeoutId);
            Solitude.timeoutId = setTimeout(() => {
              if (nextElement) {
                nextElement.style.transform = isScrollBarAtEnd()
                  ? 'rotate(180deg)'
                  : '';
              }
            }, 150);
          },
          { passive: true },
        );
      }
      scroll();
    }
  },
  openAllTags() {
    document
      .querySelectorAll<HTMLElement>('.card-allinfo .card-tag-cloud')
      .forEach((tagCloudElement) => tagCloudElement.classList.add('all-tags'));
    document.getElementById('more-tags-btn')?.remove();
  },
  listenToPageInputPress() {
    const toGroup = document.querySelector<HTMLElement>('.toPageGroup');
    const pageText = document.querySelector<HTMLInputElement>('#toPageText');
    if (!pageText) return;
    const pageButton =
      document.querySelector<HTMLAnchorElement>('#toPageButton');
    if (!pageButton) return;
    const pageNumbers = document.querySelectorAll<HTMLElement>('.page-number');
    const lastPageNumber = +(
      pageNumbers[pageNumbers.length - 1]?.textContent || 1
    );
    if (lastPageNumber === 1) {
      if (toGroup) toGroup.style.display = 'none';
      return;
    }
    lifecycle.listen(pageText, 'keydown', (event) => {
      if (event.key === 'Enter') {
        Solitude.toPage();
        Solitude.navigate(pageButton.href);
      }
    });
    lifecycle.listen(pageText, 'input', () => {
      pageText.value = pageText.value.replace(/[^0-9]/g, '');
      if (pageText.value === '0') pageText.value = '';
      pageButton.classList.toggle(
        'haveValue',
        pageText.value !== '' && pageText.value !== '0',
      );
      if (+pageText.value > lastPageNumber) {
        pageText.value = String(lastPageNumber);
      }
    });
  },
  toPage() {
    const pageNumbers = document.querySelectorAll<HTMLElement>('.page-number');
    const maxPageNumber = parseInt(
      pageNumbers[pageNumbers.length - 1].innerHTML,
    );
    const inputElement =
      document.querySelector<HTMLInputElement>('#toPageText');
    const button = document.querySelector<HTMLAnchorElement>('#toPageButton');
    if (!inputElement || !button) return;
    const inputPageNumber = parseInt(inputElement.value);
    button.href =
      !isNaN(inputPageNumber) &&
      inputPageNumber <= maxPageNumber &&
      inputPageNumber > 1
        ? window.location.href.replace(/\/page\/\d+\/$/, '/') +
          'page/' +
          inputPageNumber +
          '/'
        : '/';
  },
};
