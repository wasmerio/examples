import { lifecycle } from '@/scripts/core/lifecycle';
export const showTodayCard = () => {
  const el = document.getElementById('todayCard');
  const topGroup = document.querySelector<HTMLElement>('.topGroup');
  lifecycle.listen(topGroup, 'mouseleave', () => el?.classList.remove('hide'));
};

export const initHomeCenter = () => {
  const container = document.getElementById('home_center');
  if (!container || container.dataset.initialized === 'true') return;
  const banners = [
    ...container.querySelectorAll<HTMLAnchorElement>(
      '.home-center-banner-item',
    ),
  ];
  const indicators = [
    ...container.querySelectorAll<HTMLElement>('.home-center-indicator'),
  ];
  const banner = container.querySelector<HTMLElement>('.home-center-banner');
  const titleLink = container.querySelector<HTMLAnchorElement>(
    '.home-center-title-link',
  );
  const description = container.querySelector<HTMLElement>(
    '.home-center-description',
  );
  const categoryBar = document.getElementById('category-bar');
  const profileCard = document.querySelector<HTMLElement>(
    '#aside-content .card-profile',
  );
  if (!banner || !titleLink || !banners.length) return;
  container.dataset.initialized = 'true';
  const { signal } = lifecycle;
  const mobile = window.matchMedia('(max-width: 768px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let scrollFrame = 0;
  let resizeFrame = 0;
  let autoplayTimer = 0;
  let inView = false;
  let hovered =
    matchMedia('(hover: hover)').matches && container.matches(':hover');
  let animations: Animation[] = [];
  const getCachedColor = (src: string) => {
    try {
      const cache = JSON.parse(localStorage.getItem('Solitude') || '{}') || {};
      const item = cache.postcolor?.[src];
      if (item && (!item.expiration || item.expiration > Date.now())) {
        return item.value;
      }
    } catch (error) {
      return null;
    }
    return null;
  };
  const cacheColor = (src: string, color: string) => {
    try {
      const cache = JSON.parse(localStorage.getItem('Solitude') || '{}') || {};
      cache.postcolor = cache.postcolor || {};
      cache.postcolor[src] = {
        value: color,
        expiration: Date.now() + 43200000,
      };
      localStorage.setItem('Solitude', JSON.stringify(cache));
    } catch (error) {
      // Color caching is optional; rendering must continue without storage.
    }
  };
  const rgbToThemeHex = ([r, g, b]: readonly number[]) =>
    `#${[r, g, b]
      .map((value) =>
        Math.floor(value * 0.8)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')}`;
  const getAverageColor = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Canvas is unavailable');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const color = [0, 0, 0];
    let count = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 128) continue;
      color[0] += pixels[index];
      color[1] += pixels[index + 1];
      color[2] += pixels[index + 2];
      count++;
    }
    return count ? color.map((value) => Math.round(value / count)) : null;
  };
  const normalizeHomeCenterColor = (value: string | undefined) => {
    const match = value?.match(/^#([0-9a-f]{6})$/i);
    if (!match) return value;
    const number = parseInt(match[1], 16);
    const rgb = [number >> 16, (number >> 8) & 0xff, number & 0xff];
    const brightness = Math.round(
      (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000,
    );
    if (brightness >= 125) return value;
    return `#${rgb
      .map((channel) =>
        Math.min(channel + 50, 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')}`;
  };
  const getReadableProfileTextColor = (value: string | undefined) => {
    const match = value?.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!match) return '';
    const hex =
      match[1].length === 3
        ? [...match[1]].map((channel) => channel.repeat(2)).join('')
        : match[1];
    const channels = [0, 2, 4].map(
      (offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255,
    );
    const luminance = channels
      .map((channel) =>
        channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4,
      )
      .reduce(
        (sum, channel, index) =>
          sum + channel * [0.2126, 0.7152, 0.0722][index],
        0,
      );
    const whiteContrast = 1.05 / (luminance + 0.05);
    const blackContrast = (luminance + 0.05) / 0.05;
    return whiteContrast >= blackContrast
      ? 'var(--efu-white)'
      : 'var(--efu-black)';
  };
  const applyItemColor = (index: number, color: string | null | undefined) => {
    if (!color || !banners[index]) return;
    const colorOp = `color-mix(in srgb, ${color} 14%, transparent)`;
    const colorDeep = `color-mix(in srgb, ${color} 87%, transparent)`;
    banners[index].style.setProperty('--home-center-theme', color);
    banners[index].style.setProperty('--home-center-theme-op', colorOp);
    banners[index].style.setProperty('--home-center-theme-op-deep', colorDeep);
    if (activeIndex === index) select(index);
  };
  const extractItemColor = (index: number, sourceImage: HTMLImageElement) => {
    if (banners[index].dataset.color) return;
    const src = sourceImage.currentSrc || sourceImage.src;
    if (!src) return;
    const cachedColor = getCachedColor(src);
    if (cachedColor) {
      applyItemColor(index, normalizeHomeCenterColor(cachedColor));
      return;
    }
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      if (signal.aborted || !container.isConnected) return;
      try {
        const dominantColor = window.ColorThief?.getColorSync(image);
        const rgb = dominantColor
          ? dominantColor.array()
          : getAverageColor(image);
        if (!rgb) return;
        const color = rgbToThemeHex(rgb);
        cacheColor(src, color);
        applyItemColor(index, normalizeHomeCenterColor(color));
      } catch (error) {
        // Canvas access can fail for image hosts without CORS support.
      }
    };
    image.onerror = () => {};
    image.src = src;
  };
  const select = (index: number) => {
    const selected = banners[index];
    if (!selected) return;
    const selectedStyle = getComputedStyle(selected);
    const color = selectedStyle.getPropertyValue('--home-center-theme').trim();
    const colorOp = selectedStyle
      .getPropertyValue('--home-center-theme-op')
      .trim();
    const colorDeep = selectedStyle
      .getPropertyValue('--home-center-theme-op-deep')
      .trim();
    activeIndex = index;
    banners.forEach((banner, bannerIndex) => {
      const isActive = bannerIndex === index;
      banner.classList.toggle('active', isActive);
      banner.setAttribute('aria-hidden', String(!isActive));
      banner.tabIndex = isActive ? 0 : -1;
    });
    indicators.forEach((indicator, indicatorIndex) => {
      const isActive = indicatorIndex === index;
      indicator.classList.toggle('active', isActive);
      indicator.setAttribute('aria-current', String(isActive));
    });
    titleLink.textContent = selected.dataset.title || '';
    titleLink.href = selected.href;
    if (description) {
      description.textContent = selected.dataset.description || '';
      description.hidden = !description.textContent;
    }
    container.style.setProperty('--current-theme', color);
    container.style.setProperty('--current-theme-op', colorOp);
    container.style.setProperty('--current-theme-op-deep', colorDeep);
    [categoryBar, profileCard].forEach((target) => {
      target?.style.setProperty('--current-banner-theme', color);
      target?.style.setProperty('--current-banner-theme-op', colorOp);
      target?.style.setProperty('--current-banner-theme-op-deep', colorDeep);
    });
    const profileTextColor = getReadableProfileTextColor(color);
    if (profileTextColor) {
      profileCard?.style.setProperty(
        '--profile-card-text-color',
        profileTextColor,
      );
    }
    const nextImage = banners[
      (index + 1) % banners.length
    ].querySelector<HTMLImageElement>('.home-center-cover-img');
    if (nextImage) nextImage.loading = 'eager';
  };
  const stopTransition = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    banners.forEach((item) => item.classList.remove('is-leaving'));
  };
  const schedulePlayback = () => {
    window.clearTimeout(autoplayTimer);
    if (
      signal.aborted ||
      banners.length < 2 ||
      mobile.matches ||
      reducedMotion.matches ||
      document.hidden ||
      !inView ||
      hovered ||
      container.contains(document.activeElement)
    )
      return;
    autoplayTimer = window.setTimeout(() => {
      changeSlide((activeIndex + 1) % banners.length, 1);
    }, 5000);
  };
  const changeSlide = (
    index: number,
    direction = index > activeIndex ? 1 : -1,
  ) => {
    const previous = banners[activeIndex];
    const selected = banners[index];
    if (!selected) return;
    const mobileLeft = mobile.matches ? banner.clientWidth * index : 0;
    stopTransition();
    select(index);
    if (mobile.matches) {
      banner.scrollTo({
        left: mobileLeft,
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
      });
    } else if (previous !== selected && !reducedMotion.matches) {
      previous.classList.add('is-leaving');
      const options = {
        duration: 350,
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      };
      const outgoing = previous.animate(
        [
          { transform: 'translateX(0)' },
          { transform: `translateX(${-direction * 100}%)` },
        ],
        options,
      );
      const incoming = selected.animate(
        [
          { transform: `translateX(${direction * 100}%)` },
          { transform: 'translateX(0)' },
        ],
        options,
      );
      animations = [outgoing, incoming];
      incoming.onfinish = stopTransition;
    }
    schedulePlayback();
  };
  indicators.forEach((indicator, index) => {
    lifecycle.listen(indicator, 'click', (event) => {
      event.preventDefault();
      changeSlide(index);
    });
  });
  lifecycle.listen(container, 'keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const focusedBanner = event.target === banners[activeIndex];
      const index = (activeIndex + direction + banners.length) % banners.length;
      changeSlide(index, direction);
      if (
        event.target instanceof HTMLElement &&
        event.target.matches('.home-center-indicator')
      ) {
        indicators[index]?.focus();
      } else if (focusedBanner) {
        banners[index].focus({ preventScroll: true });
      }
    } else if (event.key === ' ' && event.target instanceof HTMLAnchorElement) {
      event.preventDefault();
      event.target.click();
    }
  });
  lifecycle.listen(banner, 'scroll', () => {
    if (!mobile.matches) return;
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      if (!mobile.matches || !banner.clientWidth) return;
      select(Math.round(banner.scrollLeft / banner.clientWidth));
    });
  });
  lifecycle.listen(container, 'pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    schedulePlayback();
  });
  lifecycle.listen(container, 'pointerleave', () => {
    hovered = false;
    schedulePlayback();
  });
  lifecycle.listen(container, 'focusin', schedulePlayback);
  lifecycle.listen(container, 'focusout', (event) => {
    if (
      event.relatedTarget instanceof Node &&
      container.contains(event.relatedTarget)
    )
      return;
    schedulePlayback();
  });
  lifecycle.listen(document, 'visibilitychange', schedulePlayback);
  lifecycle.listen(reducedMotion, 'change', () => {
    stopTransition();
    schedulePlayback();
  });
  const alignSlides = () => {
    const profileHeight = profileCard?.getBoundingClientRect().height;
    if (profileHeight) {
      container.style.setProperty('--home-center-height', `${profileHeight}px`);
    } else {
      container.style.removeProperty('--home-center-height');
    }
    cancelAnimationFrame(resizeFrame);
    cancelAnimationFrame(scrollFrame);
    stopTransition();
    resizeFrame = requestAnimationFrame(() => {
      const left = mobile.matches ? banner.clientWidth * activeIndex : 0;
      banner.scrollTo({ left, behavior: 'instant' });
      schedulePlayback();
    });
  };
  lifecycle.listen(mobile, 'change', alignSlides);
  const resizeObserver = new ResizeObserver(alignSlides);
  resizeObserver.observe(banner);
  if (profileCard) resizeObserver.observe(profileCard);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    schedulePlayback();
  });
  intersectionObserver.observe(container);
  lifecycle.add(() => {
    window.clearTimeout(autoplayTimer);
    cancelAnimationFrame(scrollFrame);
    cancelAnimationFrame(resizeFrame);
    stopTransition();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    delete container.dataset.initialized;
  });
  select(0);
  banners.forEach((item, index) => {
    const configuredColor = item.dataset.color?.trim();
    if (configuredColor) {
      applyItemColor(index, configuredColor);
      return;
    }
    const image = item.querySelector<HTMLImageElement>(
      '.home-center-cover-img',
    );
    if (!image) return;
    if (image.complete && image.naturalWidth) {
      extractItemColor(index, image);
    } else {
      lifecycle.listen(image, 'load', () => extractItemColor(index, image), {
        once: true,
      });
    }
  });
};
