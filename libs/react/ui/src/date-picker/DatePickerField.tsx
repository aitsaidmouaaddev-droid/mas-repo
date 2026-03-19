import { useState, useRef, useId, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { format, isValid } from 'date-fns';
import { FiCalendar, FiX } from 'react-icons/fi';
import Input from '../input/Input';
import { DateCalendar } from '../calendar/DateCalendar';
import { Popover } from '../popover/Popover';
import scss from './date-picker.module.scss';

export interface DatePickerFieldProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  hint?: string;
  errorText?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** Date format string (date-fns). @default 'dd/MM/yyyy' */
  displayFormat?: string;
  /** 'desktop' always uses popover; 'mobile' always uses bottom sheet; 'auto' detects. @default 'auto' */
  variant?: 'auto' | 'desktop' | 'mobile';
  weekStartsOn?: 0 | 1;
  clearable?: boolean;
  testId?: string;
  style?: CSSProperties;
  className?: string;
}

function isMobileDevice(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}

export function DatePickerField({
  value,
  onChange,
  label,
  hint,
  errorText,
  placeholder = 'DD/MM/YYYY',
  disabled = false,
  minDate,
  maxDate,
  displayFormat = 'dd/MM/yyyy',
  variant = 'auto',
  weekStartsOn = 1,
  clearable = true,
  testId,
  style,
  className,
}: DatePickerFieldProps) {
  const id = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value ?? new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');

  const useMobile = variant === 'mobile' || (variant === 'auto' && isMobileDevice());
  const displayValue = value && isValid(value) ? format(value, displayFormat) : '';
  const hasError = Boolean(errorText);

  const handleSelect = (date: Date) => {
    onChange?.(date);
    setOpen(false);
    setView('days');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const calendarEl = (
    <DateCalendar
      value={value}
      onChange={handleSelect}
      month={month}
      onMonthChange={setMonth}
      minDate={minDate}
      maxDate={maxDate}
      weekStartsOn={weekStartsOn}
      view={view}
      onViewChange={setView}
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
          placeholder={placeholder}
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
            aria-label="Clear date"
          >
            <FiX size={14} />
          </button>
        )}
        <span className={scss.calendarIcon}>
          <FiCalendar size={16} />
        </span>
      </div>

      {hasError ? (
        <span className={scss.errorText}>{errorText}</span>
      ) : hint ? (
        <span className={scss.hint}>{hint}</span>
      ) : null}

      {/* Desktop: popover */}
      {!useMobile && (
        <Popover
          open={open}
          onClose={() => {
            setOpen(false);
            setView('days');
          }}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          matchAnchorWidth
        >
          {calendarEl}
        </Popover>
      )}

      {/* Mobile: bottom sheet */}
      {useMobile &&
        open &&
        createPortal(
          <div
            className={scss.mobileModal}
            onClick={() => {
              setOpen(false);
              setView('days');
            }}
          >
            <div className={scss.mobileSheet} onClick={(e) => e.stopPropagation()}>
              <div className={scss.sheetHandle} />
              {calendarEl}
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
                  onClick={() => {
                    setOpen(false);
                    setView('days');
                  }}
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

/** Always uses a popover regardless of device. */
export function DesktopDatePickerField(props: DatePickerFieldProps) {
  return <DatePickerField {...props} variant="desktop" />;
}

/** Always uses a bottom-sheet modal regardless of device. */
export function MobileDatePickerField(props: DatePickerFieldProps) {
  return <DatePickerField {...props} variant="mobile" />;
}

/** Calendar is always visible — no input trigger. */
export interface StaticDatePickerFieldProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  hint?: string;
  errorText?: string;
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: 0 | 1;
  testId?: string;
}

export function StaticDatePickerField({
  value,
  onChange,
  label,
  hint,
  errorText,
  minDate,
  maxDate,
  weekStartsOn = 1,
  testId,
}: StaticDatePickerFieldProps) {
  const [month, setMonth] = useState(value ?? new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const hasError = Boolean(errorText);

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
        <DateCalendar
          value={value}
          onChange={(d) => onChange?.(d)}
          month={month}
          onMonthChange={setMonth}
          minDate={minDate}
          maxDate={maxDate}
          weekStartsOn={weekStartsOn}
          view={view}
          onViewChange={setView}
        />
      </div>
      {hasError ? (
        <div className={scss.errorText} style={{ marginTop: 4 }}>
          {errorText}
        </div>
      ) : hint ? (
        <div className={scss.hint} style={{ marginTop: 4 }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
