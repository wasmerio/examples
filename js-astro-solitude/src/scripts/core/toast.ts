interface ToastOptions {
  text: string;
  duration?: number;
  showAction?: boolean;
  actionText?: string;
  onActionClick?: (element: HTMLElement) => void;
  [key: string]: unknown;
}
export function showToast(options: ToastOptions) {
  const toast = document.createElement('div');
  toast.className = 'solitude-toast';
  toast.setAttribute('role', 'status');
  const text = document.createElement('span');
  text.textContent = options.text;
  toast.append(text);
  if (options.actionText && options.showAction !== false) {
    const action = document.createElement('button');
    action.type = 'button';
    action.textContent = options.actionText;
    action.addEventListener('click', () => {
      options.onActionClick?.(toast);
      toast.remove();
    });
    toast.append(action);
  }
  document.body.append(toast);
  setTimeout(() => toast.remove(), options.duration ?? 3000);
}
