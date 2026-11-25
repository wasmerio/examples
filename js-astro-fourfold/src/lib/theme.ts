export function initTheme() {
  const stored = localStorage.getItem('fourfold-theme');
  const theme = stored === 'light' || stored === 'dark' ? stored : 'system';
  document.documentElement.dataset.theme = theme;
}

export function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('fourfold-theme', next);
}
