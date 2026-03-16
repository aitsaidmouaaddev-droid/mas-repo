import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './divider.module.scss';

/**
 * Props for the {@link Divider} component.
 *
 * @property direction - Orientation of the divider line. @default 'horizontal'
 * @property label - Optional text displayed in the centre of a horizontal divider.
 * @property classOverride - SCSS class-name overrides keyed by slot.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Value forwarded to `data-testid` for testing.
 * @property className - Additional CSS class applied to the root element.
 */
export interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  label?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A visual separator that divides content horizontally or vertically.
 *
 * When a `label` is provided on a horizontal divider, it renders as a
 * centered text span between two lines instead of a plain `<hr>`.
 *
 * @param props - {@link DividerProps}
 * @returns The rendered divider element.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider direction="vertical" />
 * <Divider label="OR" />
 * ```
 */
export default function Divider({
  direction = 'horizontal',
  label,
  classOverride,
  styleOverride,
  testId,
  className,
}: DividerProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  if (label && direction === 'horizontal') {
    return (
      <div
        className={clsx(s.className.withLabel, className)}
        style={s.style.withLabel}
        data-testid={testId}
        role="separator"
      >
        <span className={s.className.label} style={s.style.label}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <hr
      className={clsx(s.className[direction], className)}
      style={s.style[direction]}
      data-testid={testId}
    />
  );
}
