export const THEME_STORAGE_KEY = 'theme';
export const THEME_META_ID = 'theme-color-meta';

/** mobile status bar mode */
export function updateThemeColorMeta(isDark: boolean): void {
  const meta = document.getElementById(THEME_META_ID);
  if (meta) {
    meta.setAttribute('content', isDark ? '#000000' : '#FFFFFF');
  }
}

export function toggleTheme(): string {
  const noTransition = document.createElement('style');
  noTransition.textContent = '*,*::before,*::after{transition:none!important}';
  document.head.appendChild(noTransition);

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'default-dark';
  const isDark = currentTheme.endsWith('-dark');
  const newTheme = isDark
    ? currentTheme.replace('-dark', '-light')
    : currentTheme.replace('-light', '-dark');

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);

  requestAnimationFrame(() => {
    updateThemeColorMeta(!isDark);

    requestAnimationFrame(() => {
      document.head.removeChild(noTransition);
    });
  });

  return newTheme;
}
