import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './switch.module.scss';

/**
 * Props for the {@link Switch} component.
 *
 * @property on - Whether the switch is toggled on. @default false
 * @property onChange - Callback fired with the new value when toggled
 * @property label - Accessible label text displayed next to the switch
 * @property disabled - Disables interaction when true. @default false
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 * @property className - Additional CSS class name
 */
export interface SwitchProps {
  on?: boolean;
  onChange?: (on: boolean) => void;
  label?: string;
  disabled?: boolean;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * Toggle switch with `role="switch"` accessibility semantics and optional label.
 *
 * @param props - {@link SwitchProps}
 * @returns A label element containing a hidden checkbox and a styled track/thumb
 *
 * @example
 * ```tsx
 * <Switch on={darkMode} onChange={setDarkMode} label="Dark mode" />
 * ```
 */
export default function Switch({
  on = false,
  onChange,
  label,
  disabled = false,
  classOverride,
  styleOverride,
  testId,
  className,
}: SwitchProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  const handleClick = () => {
    if (!disabled) onChange?.(!on);
  };

  return (
    <label
      className={clsx(
        s.className.base,
        on && s.className.on,
        disabled && s.className.disabled,
        className,
      )}
      data-testid={testId}
    >
      <input
        type="checkbox"
        className={s.className.hidden}
        checked={on}
        disabled={disabled}
        onChange={handleClick}
        role="switch"
        aria-checked={on}
        tabIndex={0}
      />
      <span className={s.className.track} style={s.style.track}>
        <span className={s.className.thumb} style={s.style.thumb} />
      </span>
      {label && (
        <span className={s.className.label} style={s.style.label}>
          {label}
        </span>
      )}
    </label>
  );
}
