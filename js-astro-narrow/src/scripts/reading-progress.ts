const progress = document.querySelector<HTMLElement>('[data-reading-progress]');

function updateProgress() {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  // A unitless 0..1 ratio: CSS scales the hairline on either axis from it.
  const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
  progress.style.setProperty('--reading-progress', ratio.toFixed(4));
}

updateProgress();
document.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
