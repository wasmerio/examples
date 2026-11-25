
const initTheme = () => {
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  window.localStorage.setItem('theme', theme);
};

const handleToggleClick = () => {
  const element = document.documentElement;
  element.classList.toggle('dark');

  const isDark = element.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Initialize theme on page load
initTheme();

// Re-run initialization when document is shown again (view transitions)
document.addEventListener('astro:after-swap', initTheme);

// Setup click listener
document.addEventListener('astro:page-load', () => {
  document
    .getElementById('themeToggle')
    ?.addEventListener('click', handleToggleClick);
});
