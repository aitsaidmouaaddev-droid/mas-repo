import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Input from '../input/Input';
import type { InputProps } from '../input/Input';
import scss from './inputField.module.scss';
import { withSkeleton } from '../skeletons/withSkeleton';
import InputFieldSkeleton from '../skeletons/InputFieldSkeleton';

/**
 * Props for the {@link InputField} component.
 *
 * Extends {@link InputProps} with label, hint, and error-text slots.
 *
 * @property label - Label text rendered above the input.
 * @property hint - Helper text rendered below the input when there is no error.
 * @property errorText - Error message displayed below the input; also sets the input error state.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 */
export interface InputFieldProps extends InputProps {
  label?: string;
  hint?: string;
  errorText?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
}


/**
 * A form field that composes {@link Input} with a label, hint text, and validation error display.
 *
 * @param props - {@link InputFieldProps}
 * @returns A labelled input with optional hint or error text.
 *
 * @example
 * ```tsx
 * <InputField
 *   label="Email"
 *   placeholder="you@example.com"
 *   hint="We'll never share your email."
 *   errorText={errors.email}
 * />
 * ```
 */
export default function InputField({
  label,
  hint,
  errorText,
  classOverride,
  styleOverride,
  testId,
  ...inputProps
}: InputFieldProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const hasError = Boolean(errorText);

  return (
    <div className={clsx(s.className.base)} style={s.style.base} data-testid={testId}>
      {label && (
        <label className={s.className.label} style={s.style.label}>
          {label}
        </label>
      )}
      <Input {...inputProps} error={hasError || inputProps.error} />
      {hasError ? (
        <span className={s.className.errorText} style={s.style.errorText}>
          {errorText}
        </span>
      ) : hint ? (
        <span className={s.className.hint} style={s.style.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export const InputFieldWithSkeleton = withSkeleton(InputField, InputFieldSkeleton);
