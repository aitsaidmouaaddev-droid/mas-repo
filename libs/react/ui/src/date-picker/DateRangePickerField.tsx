import { useState, useRef, useId, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { format, isValid, isBefore, startOfDay } from 'date-fns';
import { FiCalendar, FiX, FiArrowRight } from 'react-icons/fi';
import Input from '../input/Input';
import { DateCalendar } from '../calendar/DateCalendar';
import { Popover } from '../popover/Popover';
import scss from './date-picker.module.scss';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerFieldProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  startLabel?: string;
  endLabel?: string;
  hint?: string;
  errorText?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  displayFormat?: string;
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

export function DateRangePickerField({
  value = { start: null, end: null },
  onChange,
  startLabel = 'Start date',
  endLabel = 'End date',
  hint,
  errorText,
  disabled = false,
  minDate,
  maxDate,
  displayFormat = 'dd/MM/yyyy',
  weekStartsOn = 1,
  clearable = true,
  variant = 'auto',
  testId,
  style,
  className,
}: DateRangePickerFieldProps) {
  const startId = useId();
  const endId = useId();
  const startAnchorRef = useRef<HTMLDivElement>(null);
  const endAnchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<'start' | 'end' | null>(null);

  // Displayed months: start calendar and next month
  const [startMonth, setStartMonth] = useState(value.start ?? new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');

  // Selecting state: first click = start, second = end
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  const useMobile = variant === 'mobile' || (variant === 'auto' && isMobileDevice());
  const hasError = Boolean(errorText);

  const startDisplay =
    value.start && isValid(value.start) ? format(value.start, displayFormat) : '';
  const endDisplay = value.end && isValid(value.end) ? format(value.end, displayFormat) : '';

  const handleRangeClick = (date: Date) => {
    const d = startOfDay(date);
    if (selecting === 'start' || !value.start) {
      onChange?.({ start: d, end: null });
      setSelecting('end');
    } else {
      // If clicked before start, swap
      if (isBefore(d, value.start)) {
        onChange?.({ start: d, end: value.start });
      } else {
        onChange?.({ start: value.start, end: d });
      }
      setSelecting('start');
      setOpen(null);
      setView('days');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.({ start: null, end: null });
    setSelecting('start');
  };

  const anchorEl = open === 'start' ? startAnchorRef.current : endAnchorRef.current;

  const calendarEl = (
    <div>
      <DateCalendar
        selectionMode="range"
        rangeStart={value.start}
        rangeEnd={value.end}
        onRangeChange={handleRangeClick}
        month={startMonth}
        onMonthChange={setStartMonth}
        minDate={minDate}
        maxDate={maxDate}
        weekStartsOn={weekStartsOn}
        view={view}
        onViewChange={setView}
      />
      {selecting === 'end' && value.start && (
        <div
          style={{
            padding: '4px 12px 8px',
            fontSize: 'var(--font-caption)',
            color: 'var(--color-muted-text)',
          }}
        >
          Select end date
        </div>
      )}
    </div>
  );

  return (
    <div
      className={[scss.fieldWrap, className].filter(Boolean).join(' ')}
      style={style}
      data-testid={testId}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {/* Start field */}
        <div style={{ flex: 1 }}>
          {startLabel && (
            <label htmlFor={startId} className={scss.label}>
              {startLabel}
            </label>
          )}
          <div className={scss.triggerWrap} ref={startAnchorRef}>
            <Input
              id={startId}
              value={startDisplay}
              readOnly
              placeholder={displayFormat.toUpperCase()}
              error={hasError}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setOpen('start');
                  setSelecting('start');
                }
              }}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer', paddingRight: '36px' }}
            />
            <span className={scss.calendarIcon}>
              <FiCalendar size={16} />
            </span>
          </div>
        </div>

        <FiArrowRight
          size={16}
          style={{ color: 'var(--color-muted-text)', marginBottom: 10, flexShrink: 0 }}
        />

        {/* End field */}
        <div style={{ flex: 1 }}>
          {endLabel && (
            <label htmlFor={endId} className={scss.label}>
              {endLabel}
            </label>
          )}
          <div className={scss.triggerWrap} ref={endAnchorRef}>
            <Input
              id={endId}
              value={endDisplay}
              readOnly
              placeholder={displayFormat.toUpperCase()}
              error={hasError}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setOpen('end');
                  setSelecting(value.start ? 'end' : 'start');
                }
              }}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                paddingRight: clearable && (value.start || value.end) ? '64px' : '36px',
              }}
            />
            {clearable && (value.start || value.end) && !disabled && (
              <button
                className={scss.clearBtn}
                onClick={handleClear}
                tabIndex={-1}
                aria-label="Clear range"
              >
                <FiX size={14} />
              </button>
            )}
            <span className={scss.calendarIcon}>
              <FiCalendar size={16} />
            </span>
          </div>
        </div>
      </div>

      {hasError ? (
        <span className={scss.errorText}>{errorText}</span>
      ) : hint ? (
        <span className={scss.hint}>{hint}</span>
      ) : null}

      {!useMobile && (
        <Popover
          open={open !== null}
          onClose={() => {
            setOpen(null);
            setView('days');
          }}
          anchorEl={anchorEl}
          placement="bottom-start"
        >
          {calendarEl}
        </Popover>
      )}

      {useMobile &&
        open !== null &&
        createPortal(
          <div
            className={scss.mobileModal}
            onClick={() => {
              setOpen(null);
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
                    setOpen(null);
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
