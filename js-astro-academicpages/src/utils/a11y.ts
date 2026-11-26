/**
 * Announces a message to screen readers via a dedicated live region.
 */
export function announce(message: string): void {
  if (typeof document === 'undefined') return;

  let announcer = document.getElementById('a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }

  announcer.textContent = '';
  setTimeout(() => {
    if (announcer) announcer.textContent = message;
  }, 50);
}

/**
 * Copies text to the clipboard using the Clipboard API with a textarea fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);

      return true;
    } catch {
      // fallback if clipboard permission denied or document unfocused
    }
  }

  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    (
      document as unknown as Record<string, (cmd: string) => boolean>
    ).execCommand?.('copy');
    document.body.removeChild(textarea);

    return true;
  } catch {
    return false;
  }
}
