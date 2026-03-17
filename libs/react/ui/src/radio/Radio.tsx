import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './radio.module.scss';

/**
 * Props for the {@link Radio} component.
 *
 * @property selected - Whether this radio is currently selected. @default false
 * @property onChange - Callback fired when the radio is selected, receiving its `value`.
 * @property value - The value associated with this radio option.
 * @property label - Text label displayed next to the radio circle.
 * @property name - HTML `name` attribute for grouping radios.
 * @property disabled - Disables interaction and applies a muted style. @default false
 * @property classOverride - CSS-module class overrides.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Optional `data-testid` for the root element.
 * @property className - Additional CSS class applied to the root `<label>`.
 */
export interface RadioProps {
  selected?: boolean;
  onChange?: (value: string) => void;
  value: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A single radio input with an animated circle indicator and optional label.
 *
 * @param props - {@link RadioProps}
 * @returns A `<label>` wrapping a hidden radio input and a styled circle.
 *
 * @example
 * ```tsx
 * <Radio value="dark" label="Dark mode" selected={theme === 'dark'} onChange={setTheme} />
 * ```
 */
export default function Radio({
  selected = false,
  onChange,
  value,
  label,
  name,
  disabled = false,
  classOverride,
  styleOverride,
  testId,
  className,
}: RadioProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <label
      className={clsx(
        s.className.base,
        selected && s.className.selected,
        disabled && s.className.disabled,
        className,
      )}
      data-testid={testId}
    >
      <input
        type="radio"
        className={s.className.hidden}
        checked={selected}
        name={name}
        value={value}
        disabled={disabled}
        onChange={() => {
          if (!disabled) onChange?.(value);
        }}
        tabIndex={0}
      />
      <span className={s.className.circle} style={s.style.circle}>
        <span className={s.className.dot} style={s.style.dot} />
      </span>
      {label && (
        <span className={s.className.label} style={s.style.label}>
          {label}
        </span>
      )}
    </label>
  );
}
