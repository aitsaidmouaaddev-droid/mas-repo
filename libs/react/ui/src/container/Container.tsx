import type { ReactNode } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './container.module.scss';

/**
 * Props for the {@link Container} component.
 *
 * @property children - Content rendered inside the container.
 * @property maxWidth - Maximum width breakpoint. @default 'lg'
 * @property classOverride - SCSS class-name overrides keyed by slot.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Value forwarded to `data-testid` for testing.
 * @property className - Additional CSS class applied to the root element.
 */
export interface ContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A responsive wrapper that constrains content to a maximum width.
 *
 * Centers its children horizontally and applies one of the predefined
 * width breakpoints (`sm`, `md`, `lg`, `xl`, or `fluid`).
 *
 * @param props - {@link ContainerProps}
 * @returns The rendered container element.
 *
 * @example
 * ```tsx
 * <Container maxWidth="md">
 *   <p>Centered content</p>
 * </Container>
 * ```
 */
export default function Container({
  children,
  maxWidth = 'lg',
  classOverride,
  styleOverride,
  testId,
  className,
}: ContainerProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <div
      className={clsx(s.className.base, s.className[maxWidth], className)}
      style={s.style.base}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
