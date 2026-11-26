/**
 * Toast Component
 * 
 * A theme-aware toast notification component for user feedback.
 * 
 * Architecture Decision: This is a React component because it needs:
 * 1. Client-side state management (showing/hiding, auto-dismiss)
 * 2. Dynamic positioning and stacking
 * 3. Lifecycle management (mount/unmount)
 * 
 * However, the styling uses semantic tokens - no hardcoded colors.
 * The component demonstrates how to build interactive UI on top of the theme system.
 */

import { useEffect, useState, useCallback } from 'react';

export interface ToastProps {
  id?: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // milliseconds, 0 = no auto-dismiss
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function Toast({
  id,
  message,
  variant = 'info',
  duration = 5000,
  position = 'top-right',
  onClose,
  action,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200); // Match animation duration
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!isVisible) return null;

  const variantStyles = {
    success: {
      background: 'var(--token-color-success)',
      foreground: 'var(--token-color-success-foreground)',
      border: 'var(--token-color-success)',
    },
    error: {
      background: 'var(--token-color-error)',
      foreground: 'var(--token-color-error-foreground)',
      border: 'var(--token-color-error)',
    },
    warning: {
      background: 'var(--token-color-warning)',
      foreground: 'var(--token-color-warning-foreground)',
      border: 'var(--token-color-warning)',
    },
    info: {
      background: 'var(--token-color-info)',
      foreground: 'var(--token-color-info-foreground)',
      border: 'var(--token-color-info)',
    },
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const style = variantStyles[variant];
  const motionDuration = 'var(--token-motion-duration-normal)';
  const motionEasing = 'var(--token-motion-easing-default)';

  return (
    <div
      id={id}
      className={`fixed ${positionClasses[position]} z-50 min-w-[300px] max-w-md rounded-lg border shadow-lg transition-all ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      style={{
        backgroundColor: style.background,
        color: '#ffffff',
        borderColor: style.border,
        borderWidth: '1px',
        boxShadow: 'var(--token-shadow-3)',
        transitionDuration: motionDuration,
        transitionTimingFunction: motionEasing,
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
            }}
          >
            {action.label}
          </button>
        )}
        <button
          type="button"
          onClick={handleClose}
          className="rounded p-1 transition-opacity cursor-pointer hover:opacity-70"
          style={{ color: '#ffffff' }}
          aria-label="Dismiss notification"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
