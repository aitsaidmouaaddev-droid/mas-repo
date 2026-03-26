import { useRef, useEffect } from 'react';
import scss from './digital-clock.module.scss';

export interface MultiSectionDigitalClockProps {
  /** Current hours (0–23 in 24h, 1–12 in 12h). */
  hours: number;
  /** Current minutes (0–59). */
  minutes: number;
  /** 'AM' | 'PM' when use12Hours=true. */
  ampm?: 'AM' | 'PM';
  onChange: (hours: number, minutes: number, ampm?: 'AM' | 'PM') => void;
  use12Hours?: boolean;
  /** Step between minute options. @default 1 */
  minutesStep?: number;
  minTime?: { hours: number; minutes: number };
  maxTime?: { hours: number; minutes: number };
  disabled?: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function MultiSectionDigitalClock({
  hours,
  minutes,
  ampm = 'AM',
  onChange,
  use12Hours = false,
  minutesStep = 1,
  disabled = false,
}: MultiSectionDigitalClockProps) {
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const ampmRef = useRef<HTMLDivElement>(null);

  const hourOptions = use12Hours
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);

  const minuteOptions = Array.from(
    { length: Math.ceil(60 / minutesStep) },
    (_, i) => i * minutesStep,
  );

  const displayHour = use12Hours ? (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours) : hours;

  const scrollToSelected = (ref: React.RefObject<HTMLDivElement | null>, idx: number) => {
    const container = ref.current;
    if (!container) return;
    const items = container.querySelectorAll('[data-item]');
    const item = items[idx] as HTMLElement;
    if (item) {
      container.scrollTo({ top: item.offsetTop - 92, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const hi = hourOptions.indexOf(displayHour);
    const mi = minuteOptions.indexOf(minutes);
    if (hi >= 0) scrollToSelected(hourRef, hi);
    if (mi >= 0) scrollToSelected(minRef, mi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setHours = (h: number) => {
    const actual = use12Hours ? (ampm === 'PM' ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h) : h;
    onChange(actual, minutes, ampm);
    const idx = hourOptions.indexOf(h);
    scrollToSelected(hourRef, idx);
  };

  const setMinutes = (m: number) => {
    onChange(hours, m, ampm);
    const idx = minuteOptions.indexOf(m);
    scrollToSelected(minRef, idx);
  };

  const setAmPm = (a: 'AM' | 'PM') => {
    const newHours =
      a === 'PM' ? (hours < 12 ? hours + 12 : hours) : hours >= 12 ? hours - 12 : hours;
    onChange(newHours, minutes, a);
    scrollToSelected(ampmRef, a === 'AM' ? 0 : 1);
  };

  return (
    <div className={scss.clockWrap}>
      {/* Hours column */}
      <div className={scss.column} ref={hourRef}>
        <div className={scss.clockPadding} />
        {hourOptions.map((h) => (
          <button
            key={h}
            data-item
            className={[scss.clockItem, h === displayHour ? scss.clockItemSelected : ''].join(' ')}
            onClick={() => setHours(h)}
            disabled={disabled}
          >
            {pad(h)}
          </button>
        ))}
        <div className={scss.clockPadding} />
      </div>

      <div className={scss.columnDivider} />

      {/* Minutes column */}
      <div className={scss.column} ref={minRef}>
        <div className={scss.clockPadding} />
        {minuteOptions.map((m) => (
          <button
            key={m}
            data-item
            className={[scss.clockItem, m === minutes ? scss.clockItemSelected : ''].join(' ')}
            onClick={() => setMinutes(m)}
            disabled={disabled}
          >
            {pad(m)}
          </button>
        ))}
        <div className={scss.clockPadding} />
      </div>

      {/* AM/PM column */}
      {use12Hours && (
        <>
          <div className={scss.columnDivider} />
          <div className={scss.column} ref={ampmRef}>
            <div className={scss.clockPadding} />
            {(['AM', 'PM'] as const).map((a) => (
              <button
                key={a}
                data-item
                className={[scss.clockItem, a === ampm ? scss.clockItemSelected : ''].join(' ')}
                onClick={() => setAmPm(a)}
                disabled={disabled}
              >
                {a}
              </button>
            ))}
            <div className={scss.clockPadding} />
          </div>
        </>
      )}
    </div>
  );
}
