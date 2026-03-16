import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './badge.module.scss';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

/**
 * Props for the {@link Badge} component.
 *
 * @property label - Text content displayed inside the badge
 * @property variant - Color variant controlling the badge appearance @default 'primary'
 * @property dot - When true, renders as a small indicator dot without text @default false
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Value for `data-testid`
 * @property className - Additional CSS class for the root element
 */
export interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  dot?: boolean;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A small status descriptor rendered as a colored label or dot indicator.
 *
 * @param props - {@link BadgeProps}
 * @returns The rendered badge span element
 *
 * @example
 * ```tsx
 * <Badge label="New" variant="success" />
 * <Badge dot variant="error" />
 * ```
 */
export default function Badge({
  label,
  variant = 'primary',
  dot = false,
  classOverride,
  styleOverride,
  testId,
  className,
}: BadgeProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <span
      className={clsx(s.className.base, s.className[variant], dot && s.className.dot, className)}
      style={{ ...s.style.base, ...s.style[variant] }}
      data-testid={testId}
    >
      {!dot && label}
    </span>
  );
}
