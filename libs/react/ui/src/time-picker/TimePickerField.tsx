import { useState, useRef, useId, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { format, isValid, getHours, getMinutes, setHours, setMinutes } from 'date-fns';
import { FiClock, FiX } from 'react-icons/fi';
import Input from '../input/Input';
import { MultiSectionDigitalClock } from '../digital-clock/MultiSectionDigitalClock';
import { Popover } from '../popover/Popover';
import scss from '../date-picker/date-picker.module.scss';

export interface TimePickerFieldProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  hint?: string;
  errorText?: string;
  placeholder?: string;
  disabled?: boolean;
  use12Hours?: boolean;
  minutesStep?: number;
  clearable?: boolean;
  variant?: 'auto' | 'desktop' | 'mobile';
  testId?: string;
  style?: CSSProperties;
  className?: string;
}

function isMobileDevice(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}

export function TimePickerField({
  value,
  onChange,
  label,
  hint,
  errorText,
  placeholder,
  disabled = false,
  use12Hours = false,
  minutesStep = 1,
  clearable = true,
  variant = 'auto',
  testId,
  style,
  className,
}: TimePickerFieldProps) {
  const id = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const useMobile = variant === 'mobile' || (variant === 'auto' && isMobileDevice());

  const displayFormat = use12Hours ? 'hh:mm aa' : 'HH:mm';
  const displayValue = value && isValid(value) ? format(value, displayFormat) : '';
  const hasError = Boolean(errorText);

  const h = value ? getHours(value) : 0;
  const m = value ? getMinutes(value) : 0;
  const ampm: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';

  const handleChange = (hours: number, minutes: number) => {
    const base = value ?? new Date();
    onChange?.(setMinutes(setHours(base, hours), minutes));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const clockEl = (
    <MultiSectionDigitalClock
      hours={h}
      minutes={m}
      ampm={ampm}
      onChange={handleChange}
      use12Hours={use12Hours}
      minutesStep={minutesStep}
      disabled={disabled}
    />
  );

  return (
    <div
      className={[scss.fieldWrap, className].filter(Boolean).join(' ')}
      style={style}
      data-testid={testId}
    >
      {label && (
        <label htmlFor={id} className={scss.label}>
          {label}
        </label>
      )}

      <div className={scss.triggerWrap} ref={anchorRef}>
        <Input
          id={id}
          value={displayValue}
          readOnly
          placeholder={placeholder ?? (use12Hours ? 'hh:mm AM' : 'HH:mm')}
          error={hasError}
          disabled={disabled}
          onClick={() => !disabled && setOpen(true)}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            paddingRight: clearable && value ? '64px' : '36px',
          }}
        />
        {clearable && value && !disabled && (
          <button
            className={scss.clearBtn}
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear time"
          >
            <FiX size={14} />
          </button>
        )}
        <span className={scss.calendarIcon}>
          <FiClock size={16} />
        </span>
      </div>

      {hasError ? (
        <span className={scss.errorText}>{errorText}</span>
      ) : hint ? (
        <span className={scss.hint}>{hint}</span>
      ) : null}

      {!useMobile && (
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorEl={anchorRef.current}
          placement="bottom-start"
        >
          {clockEl}
        </Popover>
      )}

      {useMobile &&
        open &&
        createPortal(
          <div className={scss.mobileModal} onClick={() => setOpen(false)}>
            <div className={scss.mobileSheet} onClick={(e) => e.stopPropagation()}>
              <div className={scss.sheetHandle} />
              {clockEl}
              <div className={scss.modalFooter}>
                <button
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: 'var(--font-sm)',
                  }}
                  onClick={() => setOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export function DesktopTimePickerField(props: TimePickerFieldProps) {
  return <TimePickerField {...props} variant="desktop" />;
}

export function MobileTimePickerField(props: TimePickerFieldProps) {
  return <TimePickerField {...props} variant="mobile" />;
}

export interface StaticTimePickerFieldProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  use12Hours?: boolean;
  minutesStep?: number;
  disabled?: boolean;
  testId?: string;
}

export function StaticTimePickerField({
  value,
  onChange,
  label,
  use12Hours = false,
  minutesStep = 1,
  disabled,
  testId,
}: StaticTimePickerFieldProps) {
  const h = value ? getHours(value) : 0;
  const m = value ? getMinutes(value) : 0;
  const ampm: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';

  const handleChange = (hours: number, minutes: number) => {
    const base = value ?? new Date();
    onChange?.(setMinutes(setHours(base, hours), minutes));
  };

  return (
    <div data-testid={testId}>
      {label && (
        <div className={scss.label} style={{ marginBottom: 8 }}>
          {label}
        </div>
      )}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'inline-block',
          background: 'var(--color-surface)',
        }}
      >
        <MultiSectionDigitalClock
          hours={h}
          minutes={m}
          ampm={ampm}
          onChange={handleChange}
          use12Hours={use12Hours}
          minutesStep={minutesStep}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
