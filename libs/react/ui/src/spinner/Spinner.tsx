import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './spinner.module.scss';

export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Props for the {@link Spinner} component.
 *
 * @property size - Spinner diameter preset. @default 'md'
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 * @property className - Additional CSS class name
 */
export interface SpinnerProps {
  size?: SpinnerSize;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Rotating loading spinner with accessible `role="status"` semantics.
 *
 * @param props - {@link SpinnerProps}
 * @returns A span element with a CSS spinning animation
 *
 * @example
 * ```tsx
 * <Spinner size="lg" />
 * ```
 */
export default function Spinner({
  size = 'md',
  classOverride,
  styleOverride,
  testId,
  className,
}: SpinnerProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <span
      className={clsx(s.className.base, s.className[size], className)}
      style={{ ...s.style.base, ...s.style[size] }}
      role="status"
      aria-label="Loading"
      data-testid={testId}
    />
  );
}
