import React, { forwardRef } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Icon from '../icon/Icon';
import scss from './input.module.scss';

/** Predefined size variants for the {@link Input} component. */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Props for the {@link Input} component.
 *
 * Extends native `<input>` attributes (except `size`, replaced by `inputSize`).
 *
 * @property inputSize - Size variant of the input. @default 'md'
 * @property error - Whether the input is in an error state. @default false
 * @property startIcon - `react-icons` icon rendered before the input text.
 * @property endIcon - `react-icons` icon rendered after the input text.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  error?: boolean;
  startIcon?: IconType;
  endIcon?: IconType;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * A styled text input with optional leading/trailing icons and size variants.
 *
 * @param props - {@link InputProps}
 * @returns A decorated `<input>` element wrapped in a styled container.
 *
 * @example
 * ```tsx
 * import { FiSearch } from 'react-icons/fi';
 *
 * <Input placeholder="Search…" startIcon={FiSearch} inputSize="lg" />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    inputSize = 'md',
    error = false,
    disabled = false,
    startIcon,
    endIcon,
    classOverride,
    styleOverride,
    testId,
    className,
    ...rest
  },
  ref,
) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <div
      className={clsx(
        s.className.base,
        inputSize !== 'md' && s.className[inputSize],
        error && s.className.error,
        disabled && s.className.disabled,
        className,
      )}
      style={{
        ...s.style.base,
        ...(error ? s.style.error : undefined),
        ...(disabled ? s.style.disabled : undefined),
      }}
    >
      {startIcon && (
        <span className={s.className.icon} style={s.style.icon}>
          <Icon type="vector" icon={startIcon} size={16} />
        </span>
      )}
      <input
        ref={ref}
        className={s.className.input}
        style={s.style.input}
        disabled={disabled}
        data-testid={testId}
        {...rest}
      />
      {endIcon && (
        <span className={s.className.icon} style={s.style.icon}>
          <Icon type="vector" icon={endIcon} size={16} />
        </span>
      )}
    </div>
  );
});

export default Input;
