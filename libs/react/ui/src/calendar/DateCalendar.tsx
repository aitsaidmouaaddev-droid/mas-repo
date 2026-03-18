import { useRef, useEffect } from 'react';
import {
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  startOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  format,
  getYear,
  getMonth,
  setMonth,
  setYear,
  eachYearOfInterval,
} from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import scss from './calendar.module.scss';

export type CalendarSelectionMode = 'single' | 'range';
type CalendarView = 'days' | 'months' | 'years';

export interface DateCalendarProps {
  /** Currently selected date (single mode). */
  value?: Date | null;
  /** Called when user selects a date in single mode. */
  onChange?: (date: Date) => void;
  /** Range start (range mode). */
  rangeStart?: Date | null;
  /** Range end (range mode). */
  rangeEnd?: Date | null;
  /** Called when user clicks a date in range mode. */
  onRangeChange?: (date: Date) => void;
  /** Which month to display. */
  month: Date;
  /** Called when the displayed month changes. */
  onMonthChange: (month: Date) => void;
  selectionMode?: CalendarSelectionMode;
  minDate?: Date;
  maxDate?: Date;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: 0 | 1;
  /** Internal: controlled view state. */
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
}

const WEEK_DAYS_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const WEEK_DAYS_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function generateDayGrid(month: Date, weekStartsOn: 0 | 1): Date[][] {
  const first = startOfMonth(month);
  const start = startOfWeek(first, { weekStartsOn });
  const rows: Date[][] = [];
  let cur = start;
  for (let r = 0; r < 6; r++) {
    const week: Date[] = [];
    for (let c = 0; c < 7; c++) {
      week.push(cur);
      cur = addDays(cur, 1);
    }
    rows.push(week);
  }
  return rows;
}

export function DateCalendar({
  value,
  onChange,
  rangeStart,
  rangeEnd,
  onRangeChange,
  month,
  onMonthChange,
  selectionMode = 'single',
  minDate,
  maxDate,
  weekStartsOn = 1,
  view = 'days',
  onViewChange,
}: DateCalendarProps) {
  const yearGridRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (view === 'years' && selectedYearRef.current && yearGridRef.current) {
      selectedYearRef.current.scrollIntoView({ block: 'center' });
    }
  }, [view]);

  const currentYear = getYear(month);
  const weekDays = weekStartsOn === 1 ? WEEK_DAYS_MON : WEEK_DAYS_SUN;
  const grid = generateDayGrid(month, weekStartsOn);

  const isDisabled = (d: Date) => {
    if (minDate && isBefore(d, minDate)) return true;
    if (maxDate && isAfter(d, maxDate)) return true;
    return false;
  };

  const getDayClass = (d: Date) => {
    const classes = [scss.dayCell];
    if (!isSameMonth(d, month)) classes.push(scss.dayCellOtherMonth);
    if (isToday(d)) classes.push(scss.dayCellToday);

    if (selectionMode === 'single') {
      if (value && isSameDay(d, value)) classes.push(scss.dayCellSelected);
    } else {
      const hasStart = rangeStart && isSameDay(d, rangeStart);
      const hasEnd = rangeEnd && isSameDay(d, rangeEnd);
      const inRange = rangeStart && rangeEnd && isAfter(d, rangeStart) && isBefore(d, rangeEnd);
      if (hasStart && rangeEnd) classes.push(scss.dayCellRangeStart);
      else if (hasEnd) classes.push(scss.dayCellRangeEnd);
      else if (hasStart) classes.push(scss.dayCellSelected);
      if (inRange) classes.push(scss.dayCellInRange);
    }
    return classes.join(' ');
  };

  const handleDay = (d: Date) => {
    if (isDisabled(d)) return;
    if (selectionMode === 'range') onRangeChange?.(d);
    else onChange?.(d);
  };

  const yearMin = minDate ? getYear(minDate) : currentYear - 100;
  const yearMax = maxDate ? getYear(maxDate) : currentYear + 20;
  const years = eachYearOfInterval({
    start: new Date(yearMin, 0),
    end: new Date(yearMax, 0),
  }).map((d) => getYear(d));

  // ── Days view ────────────────────────────────────────────────────────────────
  if (view === 'days') {
    return (
      <div className={scss.calendarWrap}>
        <div className={scss.header}>
          <button
            className={scss.navBtn}
            onClick={() => onMonthChange(subMonths(month, 1))}
            disabled={minDate ? !isAfter(startOfMonth(month), startOfMonth(minDate)) : false}
            aria-label="Previous month"
          >
            <FiChevronLeft size={16} />
          </button>
          <div className={scss.headerLabel}>
            <button className={scss.headerBtn} onClick={() => onViewChange?.('months')}>
              {format(month, 'MMMM')}
            </button>
            <button className={scss.headerBtn} onClick={() => onViewChange?.('years')}>
              {currentYear}
            </button>
          </div>
          <button
            className={scss.navBtn}
            onClick={() => onMonthChange(addMonths(month, 1))}
            disabled={maxDate ? !isBefore(startOfMonth(month), startOfMonth(maxDate)) : false}
            aria-label="Next month"
          >
            <FiChevronRight size={16} />
          </button>
        </div>

        <div className={scss.weekRow}>
          {weekDays.map((d) => (
            <div key={d} className={scss.weekDay}>
              {d}
            </div>
          ))}
        </div>
        <div className={scss.daysGrid}>
          {grid.flat().map((d, i) => (
            <button
              key={i}
              className={getDayClass(d)}
              onClick={() => handleDay(d)}
              disabled={isDisabled(d)}
              aria-label={format(d, 'PPP')}
              tabIndex={0}
            >
              {format(d, 'd')}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Months view ──────────────────────────────────────────────────────────────
  if (view === 'months') {
    return (
      <div className={scss.calendarWrap}>
        <div className={scss.header}>
          <button
            className={scss.navBtn}
            onClick={() => onMonthChange(setYear(month, currentYear - 1))}
            aria-label="Previous year"
          >
            <FiChevronLeft size={16} />
          </button>
          <button className={scss.headerBtn} onClick={() => onViewChange?.('years')}>
            {currentYear}
          </button>
          <button
            className={scss.navBtn}
            onClick={() => onMonthChange(setYear(month, currentYear + 1))}
            aria-label="Next year"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
        <div className={scss.monthGrid}>
          {MONTHS_SHORT.map((name, idx) => {
            const isSelected = value
              ? getYear(value) === currentYear && getMonth(value) === idx
              : false;
            const isCur = idx === new Date().getMonth() && currentYear === new Date().getFullYear();
            const disabled = (() => {
              if (minDate && isBefore(new Date(currentYear, idx, 28), startOfMonth(minDate)))
                return true;
              if (maxDate && isAfter(new Date(currentYear, idx, 1), maxDate)) return true;
              return false;
            })();
            return (
              <button
                key={name}
                className={[
                  scss.monthCell,
                  isSelected ? scss.monthCellSelected : '',
                  isCur && !isSelected ? scss.monthCellCurrent : '',
                ].join(' ')}
                disabled={disabled}
                onClick={() => {
                  onMonthChange(setMonth(month, idx));
                  onViewChange?.('days');
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Years view ───────────────────────────────────────────────────────────────
  return (
    <div className={scss.calendarWrap}>
      <div className={scss.header}>
        <span
          style={{
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: 'var(--color-text)',
            padding: '0 8px',
          }}
        >
          Select year
        </span>
      </div>
      <div className={scss.yearGrid} ref={yearGridRef}>
        {years.map((y) => {
          const isSelected = value ? getYear(value) === y : currentYear === y;
          const isCur = y === new Date().getFullYear();
          return (
            <button
              key={y}
              ref={isSelected ? selectedYearRef : undefined}
              className={[
                scss.yearCell,
                isSelected ? scss.yearCellSelected : '',
                isCur && !isSelected ? scss.yearCellCurrent : '',
              ].join(' ')}
              onClick={() => {
                onMonthChange(setYear(month, y));
                onViewChange?.('months');
              }}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
}
