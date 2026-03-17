import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './typography.module.scss';
import { withSkeleton } from '../skeletons/withSkeleton';
import TypographySkeleton from '../skeletons/TypographySkeleton';

export type TypographyVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';
export type TypographyAlign = 'left' | 'center' | 'right';

const variantTag: Record<TypographyVariant, keyof React.JSX.IntrinsicElements> = {
  title: 'h1',
  subtitle: 'h2',
  body: 'p',
  caption: 'span',
  label: 'span',
};

/**
 * Props for the {@link Typography} component.
 *
 * @property variant - Typographic scale preset. @default 'body'
 * @property align - Text alignment
 * @property truncate - Clip overflow text with an ellipsis. @default false
 * @property as - Override the rendered HTML element (defaults to the variant's semantic tag)
 * @property children - Text or inline content to render
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 * @property className - Additional CSS class name
 */
export interface TypographyProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  variant?: TypographyVariant;
  align?: TypographyAlign;
  truncate?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * Semantic text element that maps typographic variants to appropriate HTML tags.
 *
 * @param props - {@link TypographyProps}
 * @returns The rendered text element (e.g. `h1`, `p`, `span`) based on variant
 *
 * @example
 * ```tsx
 * <Typography variant="title">Welcome</Typography>
 * <Typography variant="caption" align="center" truncate>Long text…</Typography>
 * ```
 */
export default function Typography({
  variant = 'body',
  align,
  truncate = false,
  as,
  children,
  classOverride,
  styleOverride,
  testId,
  className,
  style,
  ...rest
}: TypographyProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const Tag = (as ?? variantTag[variant]) as React.ElementType;

  return (
    <Tag
      className={clsx(
        s.className.base,
        s.className[variant],
        truncate && s.className.truncate,
        align === 'center' && s.className.center,
        align === 'right' && s.className.right,
        className,
      )}
      style={{
        ...s.style.base,
        ...s.style[variant],
        ...(truncate ? s.style.truncate : undefined),
        ...style,
      }}
      data-testid={testId}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const TypographyWithSkeleton = withSkeleton(Typography, TypographySkeleton);
