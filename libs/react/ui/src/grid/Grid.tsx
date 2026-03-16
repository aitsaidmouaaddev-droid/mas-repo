import type { ReactNode } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './grid.module.scss';

/**
 * Props for the {@link Grid} component.
 *
 * @property children - Content to render inside the grid cells.
 * @property columns - Number of equal columns or a custom `grid-template-columns` string. @default 12
 * @property gap - Uniform gap between rows and columns in pixels. @default 16
 * @property rowGap - Explicit row gap; overrides `gap` for the row axis.
 * @property columnGap - Explicit column gap; overrides `gap` for the column axis.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 * @property className - Additional CSS class applied to the root element.
 */
export interface GridProps {
  children: ReactNode;
  columns?: number | string;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A CSS-grid layout container with configurable columns and spacing.
 *
 * @param props - {@link GridProps}
 * @returns A `<div>` element styled as a CSS grid.
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap={24}>
 *   <div>Cell 1</div>
 *   <div>Cell 2</div>
 *   <div>Cell 3</div>
 * </Grid>
 * ```
 */
export default function Grid({
  children,
  columns = 12,
  gap = 16,
  rowGap,
  columnGap,
  classOverride,
  styleOverride,
  testId,
  className,
}: GridProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const template = typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;

  return (
    <div
      className={clsx(s.className.base, className)}
      style={{
        ...s.style.base,
        gridTemplateColumns: template,
        gap: rowGap || columnGap ? undefined : gap,
        rowGap: rowGap ?? gap,
        columnGap: columnGap ?? gap,
      }}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
