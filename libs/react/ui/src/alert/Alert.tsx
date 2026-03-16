import React from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './alert.module.scss';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const variantIcon: Record<AlertVariant, React.ElementType> = {
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  error: FiXCircle,
};

/**
 * Props for the {@link Alert} component.
 *
 * @property variant - Visual style indicating severity @default 'info'
 * @property children - Alert message content
 * @property onClose - Callback fired when the dismiss button is clicked; omit to hide the button
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Value for `data-testid`
 * @property className - Additional CSS class for the root element
 */
export interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  onClose?: () => void;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Displays a contextual feedback message with an icon matching its variant.
 *
 * @param props - {@link AlertProps}
 * @returns The rendered alert element with `role="alert"`
 *
 * @example
 * ```tsx
 * <Alert variant="success" onClose={() => setVisible(false)}>
 *   Changes saved successfully.
 * </Alert>
 * ```
 */
export default function Alert({
  variant = 'info',
  children,
  onClose,
  classOverride,
  styleOverride,
  testId,
  className,
}: AlertProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const IconComp = variantIcon[variant];

  return (
    <div
      className={clsx(s.className.base, s.className[variant], className)}
      style={{ ...s.style.base, ...s.style[variant] }}
      role="alert"
      data-testid={testId}
    >
      <span className={s.className.icon} style={s.style.icon}>
        <IconComp size={18} />
      </span>
      <span className={s.className.message} style={s.style.message}>
        {children}
      </span>
      {onClose && (
        <button
          type="button"
          className={s.className.close}
          style={s.style.close}
          onClick={onClose}
          aria-label="Close alert"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
