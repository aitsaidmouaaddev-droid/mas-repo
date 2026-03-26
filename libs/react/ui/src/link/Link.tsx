import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './link.module.scss';

/**
 * Props for the {@link Link} component.
 *
 * Extends native `<a>` attributes with a disabled state and style overrides.
 *
 * @property disabled - When `true`, prevents navigation and dims the link. @default false
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * A styled anchor element that supports a disabled state and theming overrides.
 *
 * @param props - {@link LinkProps}
 * @returns An `<a>` element with accessible disabled handling.
 *
 * @example
 * ```tsx
 * <Link href="/about">About Us</Link>
 * ```
 */
export default function Link({
  disabled = false,
  classOverride,
  styleOverride,
  testId,
  className,
  children,
  ...rest
}: LinkProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <a
      className={clsx(s.className.base, disabled && s.className.disabled, className)}
      style={{ ...s.style.base, ...(disabled ? s.style.disabled : undefined) }}
      data-testid={testId}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
