import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Radio from '../radio/Radio';
import scss from './radioGroup.module.scss';

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Props for the {@link RadioGroup} component.
 *
 * @property name - Shared HTML `name` attribute for every {@link Radio} in the group.
 * @property options - Array of selectable options to render.
 * @property value - The currently selected option value.
 * @property onChange - Callback fired when a different option is selected.
 * @property label - Accessible legend displayed above the group.
 * @property direction - Layout direction of the radio items. @default 'vertical'
 * @property classOverride - CSS-module class overrides.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Optional `data-testid` for the root element.
 * @property className - Additional CSS class applied to the root `<fieldset>`.
 */
export interface RadioGroupProps {
  name: string;
  options: RadioGroupOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  direction?: 'vertical' | 'horizontal';
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Renders a set of {@link Radio} buttons inside an accessible `<fieldset>` with vertical or horizontal layout.
 *
 * @param props - {@link RadioGroupProps}
 * @returns A `<fieldset>` containing a labelled group of radio options.
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   name="theme"
 *   options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
 *   value={theme}
 *   onChange={setTheme}
 * />
 * ```
 */
export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  direction = 'vertical',
  classOverride,
  styleOverride,
  testId,
  className,
}: RadioGroupProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <fieldset
      data-testid={testId}
      className={className}
      style={{ border: 'none', padding: 0, margin: 0 }}
    >
      {label && (
        <legend className={s.className.label} style={s.style.label}>
          {label}
        </legend>
      )}
      <div
        className={`${s.className.base} ${direction === 'horizontal' ? s.className.horizontal : ''}`}
        style={s.style.base}
        role="radiogroup"
        aria-label={label}
      >
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            value={opt.value}
            label={opt.label}
            selected={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            disabled={opt.disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}
