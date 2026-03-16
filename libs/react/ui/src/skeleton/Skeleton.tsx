import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './skeleton.module.scss';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

/**
 * Props for the {@link Skeleton} component.
 *
 * @property variant - Shape of the placeholder. @default 'text'
 * @property width - Explicit width (CSS value or number in px)
 * @property height - Explicit height (CSS value or number in px)
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 * @property className - Additional CSS class name
 */
export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Animated placeholder skeleton used to indicate loading content.
 *
 * @param props - {@link SkeletonProps}
 * @returns A decorative `aria-hidden` span element with the skeleton animation
 *
 * @example
 * ```tsx
 * <Skeleton variant="circular" width={48} height={48} />
 * ```
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  classOverride,
  styleOverride,
  testId,
  className,
}: SkeletonProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <span
      className={clsx(s.className.base, s.className[variant], className)}
      style={{ ...s.style.base, ...s.style[variant], width, height }}
      data-testid={testId}
      aria-hidden="true"
    />
  );
}
