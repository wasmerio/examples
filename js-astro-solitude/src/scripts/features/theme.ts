import { Solitude } from '@/scripts/core/api';
import { lifecycle } from '@/scripts/core/lifecycle';
export function initThemeColor() {
  const currentTop = window.scrollY || document.documentElement.scrollTop;
  const themeColor =
    currentTop > 0
      ? '--efu-card-bg'
      : Solitude.page.is_post
        ? '--efu-main'
        : '--efu-background';
  applyThemeColor(
    getComputedStyle(document.documentElement).getPropertyValue(themeColor),
  );
}

Solitude.initThemeColor = initThemeColor;

export function applyThemeColor(color: string) {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const appleMobileWebAppMeta = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]',
  );
  themeColorMeta?.setAttribute('content', color);
  appleMobileWebAppMeta?.setAttribute('content', color);
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.style.backgroundColor = color;
  }
}

export const handleThemeChange = (mode: 'light' | 'dark') => {
  const themeChange = window.globalFn?.themeChange || {};
  Object.values(themeChange).forEach((fn) => fn(mode));
  lifecycle.emit('themeChange', { theme: mode });
};

export const themeActions = {
  switchDarkMode() {
    const isDarkMode =
      document.documentElement.getAttribute('data-theme') === 'dark';
    const newMode = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newMode);
    Solitude.saveToLocal.set('theme', newMode, 0.02);
    Solitude.snackbarShow(Solitude.config.lang.theme[newMode], false, 2000);
    if (Solitude.rightMenu) {
      Solitude.rightMenu.mode(!isDarkMode);
      Solitude.rightMenu.hideRightMenu();
    }
    handleThemeChange(newMode);
  },
};
