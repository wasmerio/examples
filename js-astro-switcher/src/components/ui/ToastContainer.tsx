/**
 * ToastContainer Component
 * 
 * A container component for managing multiple toast notifications.
 * 
 * Architecture Decision: This is a React component because it needs:
 * 1. State management for multiple toasts
 * 2. Dynamic rendering of toast list
 * 3. Lifecycle management (add/remove toasts)
 * 
 * Usage:
 * - Add <ToastContainer /> to your layout
 * - Use toast() function to show toasts programmatically
 */

import { useState, useEffect } from 'react';
import Toast from './Toast';

// Define ToastProps here to avoid runtime import issues
export interface ToastProps {
  id?: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem extends ToastProps {
  id: string;
}

let toastIdCounter = 0;
const toastListeners: Array<(toasts: ToastItem[]) => void> = [];
let toasts: ToastItem[] = [];

function notifyListeners() {
  toastListeners.forEach(listener => listener([...toasts]));
}

export function toast(props: Omit<ToastProps, 'id'>) {
  const id = `toast-${++toastIdCounter}`;
  const newToast: ToastItem = { ...props, id };
  toasts = [...toasts, newToast];
  notifyListeners();
  
  return id;
}

export function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  notifyListeners();
}

export default function ToastContainer() {
  const [toastList, setToastList] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Set up the real toast function and process any queued toasts
    if (typeof window !== 'undefined') {
      (window as any).__realToast = toast;
      // Process any toasts that were queued before this component loaded
      if ((window as any).__processToastQueue) {
        (window as any).__processToastQueue();
      }
    }

    const listener = (newToasts: ToastItem[]) => {
      setToastList(newToasts);
    };
    toastListeners.push(listener);
    setToastList([...toasts]);
    
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toastList.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
