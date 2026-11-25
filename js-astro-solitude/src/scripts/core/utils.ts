/** Browser behavior preserved from Solitude Hugo; typed boundary: core/api.ts. */
import { Solitude } from '@/scripts/core/api';
export const utilsFn = {
  throttle: <A extends unknown[]>(
    func: (...args: A) => void,
    wait: number,
    { leading = true, trailing = true } = {},
  ) => {
    let timeout: ReturnType<typeof setTimeout> | number | undefined,
      previous = 0;
    const later = (context: unknown, args: A) => {
      timeout = previous = leading === false ? 0 : Date.now();
      func.apply(context, args);
    };
    return function (this: unknown, ...args: A) {
      const now = Date.now();
      if (!previous && leading === false) previous = now;
      const remaining = wait - (now - previous);
      if (remaining <= 0 || remaining > wait) {
        if (timeout) clearTimeout(timeout);
        later(this, args);
      } else if (!timeout && trailing !== false) {
        timeout = setTimeout(() => later(this, args), remaining);
      }
    };
  },
  fadeIn: (ele: HTMLElement, time: number) => {
    ele.style.display = 'block';
    ele.style.animation = `to_show ${time}s`;
  },
  fadeOut: (ele: HTMLElement, time: number) => {
    const resetStyles = () => {
      ele.style.display = 'none';
      ele.style.animation = '';
      ele.removeEventListener('animationend', resetStyles);
    };
    ele.addEventListener('animationend', resetStyles);
    ele.style.animation = `to_hide ${time}s`;
  },
  snackbarShow: (text: string, showAction = false, duration = 5000) => {
    if (window.Snackbar)
      window.Snackbar.show({ text, showAction, duration, pos: 'top-center' });
    else {
      const toast = document.createElement('div');
      toast.className = 'solitude-toast';
      toast.setAttribute('role', 'status');
      toast.textContent = text;
      document.body.append(toast);
      setTimeout(() => toast.remove(), duration);
    }
  },
  copy: async (text: string) => {
    const message = await navigator.clipboard
      .writeText(text)
      .then(() => Solitude.config.lang.copy.success)
      .catch(() => Solitude.config.lang.copy.error);
    Solitude.snackbarShow(message, false, 2000);
  },
  getEleTop: (ele: HTMLElement | null) => {
    if (!ele) return 0;
    let actualTop = ele.offsetTop;
    while (ele.offsetParent) {
      ele = ele.offsetParent as HTMLElement;
      actualTop += ele.offsetTop;
    }
    return actualTop;
  },
  siblings: (ele: Element, selector?: string) => {
    return [...(ele.parentElement?.children || [])].filter(
      (child) => child !== ele && (!selector || child.matches(selector)),
    );
  },
  randomNum: (length: number) => Math.floor(Math.random() * length),
  timeDiff: (timeObj: Date, today: Date) =>
    Math.floor((today.getTime() - timeObj.getTime()) / (1000 * 3600 * 24)),
  scrollToDest: (pos: number, time = 500) => {
    const currentPos = window.pageYOffset;
    const isNavFixed = document
      .getElementById('page-header')
      ?.classList.contains('nav-fixed');
    pos = currentPos > pos || isNavFixed ? pos - 70 : pos;
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: pos, behavior: 'smooth' });
      return;
    }
    const distance = pos - currentPos;
    let start = 0;
    const step = (currentTime: number) => {
      start ||= currentTime;
      const progress = currentTime - start;
      if (progress < time) {
        window.scrollTo(0, currentPos + (distance * progress) / time);
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    };
    window.requestAnimationFrame(step);
  },
  isMobile: () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ),
  isHidden: (e: HTMLElement) => e.offsetHeight === 0 && e.offsetWidth === 0,
  animateIn: (ele: HTMLElement, text: string) => {
    Object.assign(ele.style, { display: 'block', animation: text });
  },
  animateOut: (ele: HTMLElement, text: string) => {
    const resetAnimation = () => {
      ele.style.display = '';
      ele.style.animation = '';
      ele.removeEventListener('animationend', resetAnimation);
    };
    ele.addEventListener('animationend', resetAnimation);
    ele.style.animation = text;
  },
  wrap: (
    selector: Element,
    eleType: keyof HTMLElementTagNameMap,
    options: Record<string, string>,
  ) => {
    const createEle = document.createElement(eleType);
    Object.entries(options).forEach(([key, value]) =>
      createEle.setAttribute(key, value),
    );
    selector.parentNode?.insertBefore(createEle, selector);
    createEle.appendChild(selector);
  },
  lazyloadImg: () => {
    if (!window.LazyLoad) return;
    window.lazyLoadInstance?.destroy?.();
    window.lazyLoadInstance = new window.LazyLoad({
      elements_selector: 'img',
      threshold: 0,
      data_src: 'lazy-src',
      callback_error: (img: HTMLImageElement) =>
        (img.src = Solitude.config.lazyload.error),
    });
  },
  lightbox: function (selector: NodeListOf<HTMLImageElement>) {
    const lightboxType = Solitude.config.lightbox;
    if (lightboxType === 'fancybox' && !window.Fancybox) return;
    const options: Record<string, string> = {
      class: 'fancybox',
      'data-fancybox': 'gallery',
      'data-no-pjax': '',
    };
    if (lightboxType === 'mediumZoom') {
      window.mediumZoom &&
        window.mediumZoom(selector, { background: 'var(--efu-card-bg)' });
    } else if (lightboxType === 'fancybox') {
      selector.forEach((i) => {
        if (i.parentElement?.tagName !== 'A') {
          options.href = options['data-thumb'] = i.dataset.lazySrc || i.src;
          options['data-caption'] = i.title || i.alt || '';
          Solitude.wrap(i, 'a', options);
        }
      });
      if (!window.fancyboxRun) {
        // Astro replaces the body on navigation; keep delegation on the stable root.
        window.Fancybox!.bind(document.documentElement, '[data-fancybox]', {
          Hash: false,
          Carousel: {
            transition: 'slide',
            Thumbs: { showOnStart: false },
            Zoomable: { Panzoom: { maxScale: 4 } },
            Toolbar: {
              display: {
                left: ['counter'],
                middle: [],
                right: ['thumbs', 'close'],
              },
            },
            breakpoints: {
              '(min-width: 768px)': {
                Toolbar: {
                  display: {
                    left: ['counter'],
                    middle: [
                      'zoomIn',
                      'zoomOut',
                      'toggle1to1',
                      'rotateCCW',
                      'rotateCW',
                      'flipX',
                      'flipY',
                    ],
                    right: ['autoplay', 'thumbs', 'close'],
                  },
                },
              },
            },
          },
        });
        window.fancyboxRun = true;
      }
    }
  },
  diffDate: (d: string | number | Date, more = false): string | number => {
    const dateNow = new Date();
    const datePost = new Date(d);
    const dateDiff = +dateNow - +datePost;
    const minute = 60000;
    const hour = 3600000;
    const day = 86400000;
    const month = 2592000000;
    const { time } = Solitude.config.lang;
    const dayCount = Math.floor(dateDiff / day);
    if (!more) return dayCount;
    const minuteCount = Math.floor(dateDiff / minute);
    const hourCount = Math.floor(dateDiff / hour);
    const monthCount = Math.floor(dateDiff / month);
    if (monthCount > 12) return datePost.toISOString().slice(0, 10);
    if (monthCount >= 1) return `${monthCount} ${time.month}`;
    if (dayCount >= 1) return `${dayCount} ${time.day}`;
    if (hourCount >= 1) return `${hourCount} ${time.hour}`;
    if (minuteCount >= 1) return `${minuteCount} ${time.min}`;
    return time.just;
  },
  loadComment: (dom: Element, callback: () => void) => {
    const observerItem =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                callback();
                observerItem?.disconnect();
              }
            },
            { threshold: [0] },
          )
        : null;
    observerItem ? observerItem.observe(dom) : callback();
  },
  escapeHtml: (unsafe: string) =>
    unsafe.replace(
      /[&<"']/g,
      (m) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '"': '&quot;',
          "'": '&#039;',
        })[m] || m,
    ),
  owoBig: (owoSelector: { item: string; body: string }): void => {
    const execute = () => {
      if (
        typeof window.Solitude.owoBig === 'function' &&
        window.Solitude.owoBig !== utilsFn.owoBig
      ) {
        window.Solitude.owoBig(owoSelector);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', execute);
    } else {
      setTimeout(execute, 100);
    }
  },
};
export function installUtilities() {
  Object.assign(Solitude, utilsFn);
}
