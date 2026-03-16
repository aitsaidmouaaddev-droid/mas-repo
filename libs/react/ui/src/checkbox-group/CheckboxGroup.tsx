import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import Checkbox from '../checkbox/Checkbox';
import scss from './checkboxGroup.module.scss';

/**
 * Describes a single option rendered inside a {@link CheckboxGroup}.
 *
 * @property value - Unique value identifying this option.
 * @property label - Display text shown next to the checkbox.
 * @property disabled - If `true`, this individual option is non-interactive.
 */
export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Props for the {@link CheckboxGroup} component.
 *
 * @property options - Array of selectable options.
 * @property value - Currently selected option values. @default []
 * @property onChange - Callback fired with the updated selection array.
 * @property label - Accessible group label rendered as a `<legend>`.
 * @property direction - Layout direction of the checkboxes. @default 'vertical'
 * @property classOverride - SCSS class-name overrides keyed by slot.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Value forwarded to `data-testid` for testing.
 * @property className - Additional CSS class applied to the root `<fieldset>`.
 */
export interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  direction?: 'vertical' | 'horizontal';
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A group of {@link Checkbox} controls that manages a multi-select value array.
 *
 * Renders a `<fieldset>` with an optional legend and lays out individual
 * checkboxes either vertically or horizontally.
 *
 * @param props - {@link CheckboxGroupProps}
 * @returns The rendered checkbox group element.
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */
export default function CheckboxGroup({
  options,
  value = [],
  onChange,
  label,
  direction = 'vertical',
  classOverride,
  styleOverride,
  testId,
  className,
}: CheckboxGroupProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  const handleToggle = (optValue: string) => {
    const next = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue];
    onChange?.(next);
  };

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
        role="group"
        aria-label={label}
      >
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            label={opt.label}
            checked={value.includes(opt.value)}
            onChange={() => handleToggle(opt.value)}
            disabled={opt.disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}
