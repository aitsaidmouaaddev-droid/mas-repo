import { useState, useRef, useId, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { format, isValid, getHours, getMinutes, setHours, setMinutes } from 'date-fns';
import { FiCalendar, FiX } from 'react-icons/fi';
import Input from '../input/Input';
import { DateCalendar } from '../calendar/DateCalendar';
import { MultiSectionDigitalClock } from '../digital-clock/MultiSectionDigitalClock';
import { Popover } from '../popover/Popover';
import scss from '../date-picker/date-picker.module.scss';

export interface DateTimePickerFieldProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  hint?: string;
  errorText?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  displayFormat?: string;
  use12Hours?: boolean;
  minutesStep?: number;
  weekStartsOn?: 0 | 1;
  clearable?: boolean;
  variant?: 'auto' | 'desktop' | 'mobile';
  testId?: string;
  style?: CSSProperties;
  className?: string;
}

function isMobileDevice(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}

export function DateTimePickerField({
  value,
  onChange,
  label,
  hint,
  errorText,
  placeholder = 'DD/MM/YYYY HH:mm',
  disabled = false,
  minDate,
  maxDate,
  displayFormat = 'dd/MM/yyyy HH:mm',
  use12Hours = false,
  minutesStep = 1,
  weekStartsOn = 1,
  clearable = true,
  variant = 'auto',
  testId,
  style,
  className,
}: DateTimePickerFieldProps) {
  const id = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value ?? new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const useMobile = variant === 'mobile' || (variant === 'auto' && isMobileDevice());

  const displayValue = value && isValid(value) ? format(value, displayFormat) : '';
  const hasError = Boolean(errorText);

  const h = value ? getHours(value) : 0;
  const m = value ? getMinutes(value) : 0;
  const ampm: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';

  const handleDateSelect = (date: Date) => {
    const base = value ?? date;
    onChange?.(setMinutes(setHours(date, getHours(base)), getMinutes(base)));
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    const base = value ?? new Date();
    onChange?.(setMinutes(setHours(base, hours), minutes));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const pickerEl = (
    <div>
      <div className={scss.dateTimeWrap}>
        <DateCalendar
          value={value}
          onChange={handleDateSelect}
          month={month}
          onMonthChange={setMonth}
          minDate={minDate}
          maxDate={maxDate}
          weekStartsOn={weekStartsOn}
          view={view}
          onViewChange={setView}
        />
      </div>
      <div className={scss.timeSection}>
        <div className={scss.timeSectionLabel}>Time</div>
        <MultiSectionDigitalClock
          hours={h}
          minutes={m}
          ampm={ampm}
          onChange={handleTimeChange}
          use12Hours={use12Hours}
          minutesStep={minutesStep}
          disabled={disabled}
        />
      </div>
    </div>
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
          <button className={scss.clearBtn} onClick={handleClear} tabIndex={-1} aria-label="Clear">
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

      {!useMobile && (
        <Popover
          open={open}
          onClose={() => {
            setOpen(false);
            setView('days');
          }}
          anchorEl={anchorRef.current}
          placement="bottom-start"
        >
          {pickerEl}
        </Popover>
      )}

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
              {pickerEl}
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

export function DesktopDateTimePickerField(props: DateTimePickerFieldProps) {
  return <DateTimePickerField {...props} variant="desktop" />;
}

export function MobileDateTimePickerField(props: DateTimePickerFieldProps) {
  return <DateTimePickerField {...props} variant="mobile" />;
}

export interface StaticDateTimePickerFieldProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  use12Hours?: boolean;
  minutesStep?: number;
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: 0 | 1;
  disabled?: boolean;
  testId?: string;
}

export function StaticDateTimePickerField({
  value,
  onChange,
  label,
  use12Hours = false,
  minutesStep = 1,
  minDate,
  maxDate,
  weekStartsOn = 1,
  disabled,
  testId,
}: StaticDateTimePickerFieldProps) {
  const [month, setMonth] = useState(value ?? new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');

  const h = value ? getHours(value) : 0;
  const m = value ? getMinutes(value) : 0;
  const ampm: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';

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
        <div className={scss.dateTimeWrap}>
          <DateCalendar
            value={value}
            onChange={(d) => {
              const base = value ?? d;
              onChange?.(setMinutes(setHours(d, getHours(base)), getMinutes(base)));
            }}
            month={month}
            onMonthChange={setMonth}
            minDate={minDate}
            maxDate={maxDate}
            weekStartsOn={weekStartsOn}
            view={view}
            onViewChange={setView}
          />
        </div>
        <div className={scss.timeSection}>
          <div className={scss.timeSectionLabel}>Time</div>
          <MultiSectionDigitalClock
            hours={h}
            minutes={m}
            ampm={ampm}
            onChange={(hours, minutes) => {
              const base = value ?? new Date();
              onChange?.(setMinutes(setHours(base, hours), minutes));
            }}
            use12Hours={use12Hours}
            minutesStep={minutesStep}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
