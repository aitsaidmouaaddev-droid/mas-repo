import React from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import scss from './button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the {@link Button} component, extending native button attributes.
 *
 * @property label - Text displayed inside the button
 * @property variant - Visual style of the button @default 'primary'
 * @property size - Predefined size affecting padding and font @default 'md'
 * @property startIcon - Icon rendered before the label
 * @property endIcon - Icon rendered after the label
 * @property iconSize - Explicit icon size in pixels; auto-derived from `size` when omitted
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Value for `data-testid`
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: IconType;
  endIcon?: IconType;
  iconSize?: number;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * A versatile button supporting multiple variants, sizes, and optional leading/trailing icons.
 *
 * @param props - {@link ButtonProps}
 * @returns The rendered `<button>` element
 *
 * @example
 * ```tsx
 * import { FiSave } from 'react-icons/fi';
 *
 * <Button label="Save" variant="primary" startIcon={FiSave} onClick={handleSave} />
 * ```
 */
export default function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  startIcon,
  endIcon,
  iconSize,
  classOverride,
  styleOverride,
  testId,
  className,
  children,
  ...rest
}: ButtonProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  const defaultIconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const resolvedIconSize = iconSize ?? defaultIconSize;

  return (
    <button
      className={clsx(
        s.className.base,
        s.className[variant],
        s.className[size],
        disabled && s.className.disabled,
        className,
      )}
      style={{
        ...s.style.base,
        ...s.style[variant],
        ...s.style[size],
        ...(disabled ? s.style.disabled : undefined),
      }}
      disabled={disabled}
      data-testid={testId}
      {...rest}
    >
      <span className={s.className.content} style={s.style.content}>
        {startIcon && <Icon type="vector" icon={startIcon} size={resolvedIconSize} />}
        {(label || children) && (
          <span className={s.className.label} style={s.style.label}>
            {label ?? children}
          </span>
        )}
        {endIcon && <Icon type="vector" icon={endIcon} size={resolvedIconSize} />}
      </span>
    </button>
  );
}
