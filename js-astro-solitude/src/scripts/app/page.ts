import { Solitude } from '@/scripts/core/api';
import { lifecycle } from '@/scripts/core/lifecycle';
import {
  initGalleryMasonry,
  initPostCoverTilt,
} from '@/scripts/features/media';
import {
  initAsideTagCloudOverflow,
  sidebarFn,
} from '@/scripts/features/navigation';
import { tabs } from '@/scripts/features/post';
import { initToc } from '@/scripts/features/post/toc';
import { scrollFn } from '@/scripts/features/scroll';
import {
  coverColor,
  initializeMusicPlayer,
  loadFeatureModules,
} from './features';

const initTooltip = () => {
  const tooltip =
    document.querySelector<HTMLElement>('.custom-tooltip') ||
    document.body.appendChild(
      Object.assign(document.createElement('div'), {
        className: 'custom-tooltip',
      }),
    );
  tooltip.style.opacity = '0';
  tooltip.style.backdropFilter = 'none';
  if (!window.matchMedia('(hover: hover)').matches) return;
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  document.querySelectorAll<HTMLElement>('[heotip]').forEach((element) => {
    if (element.dataset.tooltipInitialized === 'true') return;
    element.dataset.tooltipInitialized = 'true';
    lifecycle.listen(element, 'mouseenter', () => {
      tooltip.textContent = element.getAttribute('heotip');
      tooltip.style.left = '0';
      tooltip.style.top = '0';
      tooltip.style.backdropFilter = 'blur(10px)';
      tooltip.style.opacity = '1';
      const targetRect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const gap = 10;
      const maxLeft = window.innerWidth - tooltipRect.width - rootFontSize;
      const centeredLeft =
        targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      const left = Math.max(rootFontSize, Math.min(centeredLeft, maxLeft));
      const preferredTop =
        targetRect.top >= tooltipRect.height + gap
          ? targetRect.top - tooltipRect.height - gap
          : targetRect.bottom + gap;
      const maxTop = window.innerHeight - tooltipRect.height - rootFontSize;
      const top = Math.max(rootFontSize, Math.min(preferredTop, maxTop));
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    });
    lifecycle.listen(element, 'mouseleave', () => {
      tooltip.style.backdropFilter = 'none';
      tooltip.style.opacity = '0';
    });
  });
};
const initObserver = () => {
  const commentElement = document.getElementById('post-comment');
  const paginationElement = document.getElementById('pagination');
  const commentBarrageElement =
    document.querySelector<HTMLElement>('.comment-barrage');
  if (commentElement && paginationElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        paginationElement.classList.toggle('show-window', entry.isIntersecting);
        if (Solitude.config.comment?.commentBarrage && commentBarrageElement) {
          commentBarrageElement.style.bottom = entry.isIntersecting
            ? '-200px'
            : '';
        }
      });
    });
    observer.observe(commentElement);
    lifecycle.add(() => observer.disconnect());
  }
};
export async function refreshPage() {
  lifecycle.disposePage();
  const signal = lifecycle.signal;
  const { is_home, is_page, page, is_post } = Solitude.page;
  const { runtime, lazyload, lightbox, randomlink, covercolor, expire } =
    Solitude.config;
  const timeSelector = '.datetime, .webinfo-item time, .post-meta-date time';
  document.body.setAttribute('data-type', page);
  document.body.setAttribute(
    'data-right-menu',
    String(Boolean(Solitude.config.right_menu)),
  );
  await loadFeatureModules();
  if (signal.aborted) return;
  Solitude.changeTimeFormat(document.querySelectorAll(timeSelector));
  runtime && Solitude.addRuntime();
  [
    scrollFn,
    sidebarFn,
    initAsideTagCloudOverflow,
    initTooltip,
    () => Solitude.addPhotoFigcaption(),
    () => Solitude.setTimeState(),
    () => Solitude.tagPageActive(),
    () => Solitude.categoriesBarActive(),
    () => Solitude.listenToPageInputPress(),
    () => Solitude.musicScrubberBind(),
    () => Solitude.musicBind(),
    () => Solitude.addNavBackgroundInit(),
    initGalleryMasonry,
    () => Solitude.refreshWaterFall(),
  ].forEach((fn) => fn());
  lazyload.enable && Solitude.lazyloadImg();
  lightbox &&
    Solitude.lightbox(
      document.querySelectorAll<HTMLImageElement>(
        '.article-container img:not(.flink-avatar,.gallery-group img, .no-lightbox), #bber .bber-content-img img',
      ),
    );
  randomlink && Solitude.randomLinksList?.();
  Solitude.config.friend_links.async && Solitude.friendLinks?.init();
  if (is_post) {
    initPostCoverTilt();
  }
  Solitude.switchComments();
  initObserver();
  if (is_home) {
    const { initHomeCenter, showTodayCard } =
      await import('@/scripts/features/home');
    if (signal.aborted) return;
    showTodayCard();
    initHomeCenter();
    Solitude.homeTypeit();
  }
  typeof window.updatePostsBasedOnComments === 'function' &&
    window.updatePostsBasedOnComments();
  if (is_post || is_page) {
    if (document.querySelector('article pre')) {
      const { initializeCodeBlocks } =
        await import('@/scripts/features/post/code-highlight');
      if (signal.aborted) return;
      void initializeCodeBlocks(signal);
    }
    tabs.init();
  }
  if (is_post && expire?.enable) {
    tabs.expireAddListener();
  }
  if (covercolor.enable) coverColor();
  if (Solitude.page.toc) initToc();
  if (page === 'music') {
    initializeMusicPlayer();
    lifecycle.add(() => Solitude.musicPlayer?.destroy?.());
  }
  if (page === 'archives') {
    const { archivePageController, initArchivePage } =
      await import('@/scripts/features/archive');
    if (signal.aborted) return;
    initArchivePage();
    lifecycle.add(() => archivePageController.destroy());
  }
  if (document.getElementById('about-page')) {
    const { initAboutPage } = await import('@/scripts/features/about');
    if (!signal.aborted) initAboutPage();
  }
}
