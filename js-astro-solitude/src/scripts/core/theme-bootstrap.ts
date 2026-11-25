/** Serialized after TypeScript compilation to keep theme selection synchronous. */
export function applyInitialTheme(defaultMode: string) {
  let mode: unknown = defaultMode;
  try {
    const stored = JSON.parse(localStorage.getItem('theme') ?? 'null') as {
      value?: unknown;
      expiry?: number;
    } | null;
    if (stored?.value && (!stored.expiry || stored.expiry > Date.now())) {
      mode = stored.value;
    }
  } catch {
    // Storage may be unavailable or contain an invalid value.
  }
  if (mode === 'auto') {
    mode = matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  document.documentElement.dataset.theme = mode === 'dark' ? 'dark' : 'light';
}
