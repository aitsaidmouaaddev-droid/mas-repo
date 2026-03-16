import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './toast.module.scss';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

const variantIcon: Record<ToastVariant, React.ElementType> = {
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  error: FiXCircle,
};

/**
 * Describes a single toast notification managed by {@link useToast}.
 *
 * @property id - Unique identifier for the toast
 * @property variant - Visual style indicating severity. @default 'info'
 * @property message - Text content displayed in the toast
 * @property duration - Auto-dismiss delay in milliseconds; `0` disables auto-dismiss. @default 4000
 */
export interface ToastMessage {
  id: string;
  variant?: ToastVariant;
  message: string;
  duration?: number;
}

/**
 * Props for the {@link ToastContainer} component.
 *
 * @property toasts - Array of active toast messages to render
 * @property onDismiss - Callback fired with the toast `id` to dismiss
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 */
export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * Portal-rendered container that stacks toast notifications.
 *
 * @param props - {@link ToastContainerProps}
 * @returns A portal-mounted div containing all active toast items
 *
 * @example
 * ```tsx
 * const { toasts, add, dismiss } = useToast();
 * <ToastContainer toasts={toasts} onDismiss={dismiss} />
 * ```
 */
export function ToastContainer({
  toasts,
  onDismiss,
  classOverride,
  styleOverride,
  testId,
}: ToastContainerProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return createPortal(
    <div className={s.className.container} style={s.style.container} data-testid={testId}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} s={s} />
      ))}
    </div>,
    document.body,
  );
}

function ToastItem({
  toast,
  onDismiss,
  s,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  s: ReturnType<typeof useStyles<typeof scss>>;
}) {
  const variant = toast.variant ?? 'info';
  const IconComp = variantIcon[variant];
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const dur = toast.duration ?? 4000;
    if (dur > 0) {
      timerRef.current = setTimeout(() => onDismiss(toast.id), dur);
    }
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div className={clsx(s.className.toast, s.className[variant])}>
      <span className={s.className.icon}>
        <IconComp size={18} />
      </span>
      <span className={s.className.message}>{toast.message}</span>
      <button
        type="button"
        className={s.className.close}
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss toast"
      >
        <FiX size={14} />
      </button>
    </div>
  );
}

// Simple hook for managing toast state
let toastCounter = 0;

/**
 * Hook for managing toast notification state. Provides methods to add and dismiss toasts.
 *
 * @returns An object containing the `toasts` array, `add` function, and `dismiss` function
 *
 * @example
 * ```tsx
 * const { toasts, add, dismiss } = useToast();
 * add({ variant: 'success', message: 'Saved!' });
 * ```
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const add = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = String(++toastCounter);
    setToasts((prev) => [...prev, { ...msg, id }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, add, dismiss };
}
