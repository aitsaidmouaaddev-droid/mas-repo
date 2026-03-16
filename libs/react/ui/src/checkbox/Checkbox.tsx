import { FiCheck } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './checkbox.module.scss';

/**
 * Props for the {@link Checkbox} component.
 *
 * @property checked - Whether the checkbox is currently selected. @default false
 * @property onChange - Callback fired when the checked state changes, receiving the new value.
 * @property label - Optional text label displayed next to the checkbox.
 * @property disabled - If `true`, the checkbox is non-interactive. @default false
 * @property classOverride - SCSS class-name overrides keyed by slot.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Value forwarded to `data-testid` for testing.
 * @property className - Additional CSS class applied to the root element.
 */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A styled checkbox control with an optional label.
 *
 * Renders a hidden native `<input type="checkbox">` paired with a visual box
 * indicator and an optional text label.
 *
 * @param props - {@link CheckboxProps}
 * @returns The rendered checkbox element.
 *
 * @example
 * ```tsx
 * <Checkbox checked={agreed} onChange={setAgreed} label="I agree" />
 * ```
 */
export default function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  classOverride,
  styleOverride,
  testId,
  className,
}: CheckboxProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  const handleClick = () => {
    if (!disabled) onChange?.(!checked);
  };

  return (
    <label
      className={clsx(
        s.className.base,
        checked && s.className.checked,
        disabled && s.className.disabled,
        className,
      )}
      data-testid={testId}
    >
      <input
        type="checkbox"
        className={s.className.hidden}
        checked={checked}
        disabled={disabled}
        onChange={() => handleClick()}
        tabIndex={0}
      />
      <span className={s.className.box} style={s.style.box}>
        {checked && <FiCheck size={14} />}
      </span>
      {label && (
        <span className={s.className.label} style={s.style.label}>
          {label}
        </span>
      )}
    </label>
  );
}
