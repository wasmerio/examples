/** localStorage helpers compatible with Butterfly's `{ value, expiry }` format. */
export function load<T = string>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return undefined;
    try {
      const o = JSON.parse(raw);
      if (o && typeof o === 'object' && 'value' in o) {
        if (o.expiry && Date.now() > o.expiry) {
          localStorage.removeItem(key);
          return undefined;
        }
        return o.value as T;
      }
      return o as T;
    } catch {
      return raw as T;
    }
  } catch {
    return undefined;
  }
}

/** @param ttlDays 0 = no expiry */
export function save(key: string, value: unknown, ttlDays = 0) {
  try {
    const expiry = ttlDays ? Date.now() + ttlDays * 86_400_000 : 0;
    localStorage.setItem(key, JSON.stringify({ value, expiry }));
  } catch {
    /* storage unavailable (private mode) — preference just won't persist */
  }
}

export function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'light' | 'dark';

/**
 * Toast (replaces Butterfly's snackbar). A single live region that follows the
 * theme; `type` picks the accent colour and icon. Styles: global.css `#toast`.
 */
export function toast(message: string, type: ToastType = 'success', duration = 2000) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<span class="toast-icon" aria-hidden="true"></span><span class="toast-text"></span>';
    document.body.append(el);
  }
  el.dataset.type = type;
  el.querySelector('.toast-text')!.textContent = message;
  el.classList.remove('is-visible');
  void el.offsetWidth; // restart the enter animation when toasts follow each other
  el.classList.add('is-visible');
  clearTimeout(Number(el.dataset.timer));
  el.dataset.timer = String(window.setTimeout(() => el!.classList.remove('is-visible'), duration));
}
