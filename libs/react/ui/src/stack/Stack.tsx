import type { ReactNode } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './stack.module.scss';

/**
 * Props for the {@link Stack} layout component.
 *
 * @property children - Elements to arrange in the stack
 * @property direction - Layout axis. @default 'vertical'
 * @property gap - Spacing between children (CSS value or number in px). @default 8
 * @property align - Cross-axis alignment. @default 'stretch'
 * @property wrap - Whether children can wrap to the next line. @default false
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 * @property className - Additional CSS class name
 */
export interface StackProps {
  children: ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: number | string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Flexbox layout primitive that arranges children vertically or horizontally with consistent spacing.
 *
 * @param props - {@link StackProps}
 * @returns A flex container div with the configured layout
 *
 * @example
 * ```tsx
 * <Stack direction="horizontal" gap={16} align="center">
 *   <Avatar />
 *   <Typography>Jane Doe</Typography>
 * </Stack>
 * ```
 */
export default function Stack({
  children,
  direction = 'vertical',
  gap = 8,
  align = 'stretch',
  wrap = false,
  classOverride,
  styleOverride,
  testId,
  className,
}: StackProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <div
      className={clsx(
        s.className.base,
        s.className[direction],
        s.className[align],
        wrap && s.className.wrap,
        className,
      )}
      style={{ ...s.style.base, gap }}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
