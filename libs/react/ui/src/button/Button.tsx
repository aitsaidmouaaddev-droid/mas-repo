import React from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import scss from './button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

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
