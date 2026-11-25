import { Solitude } from '@/scripts/core/api';

const addCopyright = () => {
  if (!Solitude.config.copyright) return;
  const { limit, author, link, source, info } = Solitude.config.copyright;
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    const copyText = window.getSelection()?.toString() || '';
    const text =
      copyText.length > limit
        ? `${copyText}\n\n${author}\n${link}${window.location.href}\n${source}\n${info}`
        : copyText;
    e.clipboardData?.setData('text', text);
  });
};

let initialized = false;

export function initializeGlobalEvents() {
  if (initialized) return;
  initialized = true;
  addCopyright();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      Solitude.wasPageHidden = true;
    }
  });
  window.onkeydown = (e) => {
    const { code, ctrlKey, shiftKey } = e;
    if (
      code === 'F12' ||
      (ctrlKey && shiftKey && (code === 'KeyI' || code === 'KeyC'))
    ) {
      Solitude.snackbarShow(Solitude.config.lang.f12, false, 3000);
    }
    if (code === 'Escape') {
      Solitude.hideConsole();
    }
  };
  document.addEventListener('copy', () => {
    Solitude.snackbarShow(Solitude.config.lang.copy.success, false, 3000);
  });
}
