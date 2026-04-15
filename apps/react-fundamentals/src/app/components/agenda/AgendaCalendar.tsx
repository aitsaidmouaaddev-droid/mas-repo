import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { AgendaEvent } from '../../hooks/useAgendaNotifications';
import styles from './AgendaCalendar.module.scss';

interface Props {
  events: AgendaEvent[];
  onEventClick: (event: AgendaEvent) => void;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MAX_CHIPS = 2;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function colorClass(colorId?: string): string {
  if (!colorId) return '';
  const map: Record<string, string> = {
    '1': styles.color1,
    '2': styles.color2,
    '3': styles.color3,
    '4': styles.color4,
    '5': styles.color5,
    '6': styles.color6,
    '7': styles.color7,
    '8': styles.color8,
    '9': styles.color9,
    '10': styles.color10,
    '11': styles.color11,
  };
  return map[colorId] ?? '';
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function AgendaCalendar({ events, onEventClick }: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date>(today);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  // Build grid: first cell = Monday of the week containing the 1st of the month
  const firstOfMonth = new Date(year, month, 1);
  // getDay() returns 0=Sun..6=Sat; we want 0=Mon..6=Sun
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - startOffset);

  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }

  // Map events to their day buckets (by start date)
  const byDay = useMemo(() => {
    const map = new Map<string, AgendaEvent[]>();
    for (const ev of events) {
      const key = startOfDay(new Date(ev.start)).toISOString();
      const arr = map.get(key) ?? [];
      arr.push(ev);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  const selectedKey = startOfDay(selectedDay).toISOString();
  const selectedEvents = byDay.get(selectedKey) ?? [];

  const monthLabel = cursor.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className={styles.calendar}>
      {/* Month navigation */}
      <div className={styles.monthHeader}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Mois précédent"
        >
          <FiChevronLeft size={18} />
        </button>
        <h2 className={styles.monthTitle}>{monthLabel}</h2>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Mois suivant"
        >
          <FiChevronRight size={18} />
        </button>
      </div>

      {/* Weekday labels */}
      <div className={styles.weekdays}>
        {WEEKDAYS.map((d) => (
          <div key={d} className={styles.weekday}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className={styles.grid}>
        {cells.map((cell, idx) => {
          const isCurrentMonth = cell.getMonth() === month;
          const isToday = isSameDay(cell, today);
          const isSelected = isSameDay(cell, selectedDay);
          const cellKey = startOfDay(cell).toISOString();
          const dayEvents = byDay.get(cellKey) ?? [];

          return (
            <div
              key={idx}
              className={clsx(
                styles.cell,
                !isCurrentMonth && styles.cellOtherMonth,
                isToday && styles.cellToday,
                isSelected && styles.cellSelected,
              )}
              onClick={() => setSelectedDay(startOfDay(cell))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedDay(startOfDay(cell))}
              aria-label={cell.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            >
              {isToday ? (
                <span className={styles.todayBadge}>{cell.getDate()}</span>
              ) : (
                <span className={styles.dayNumber}>{cell.getDate()}</span>
              )}
              {dayEvents.slice(0, MAX_CHIPS).map((ev) => (
                <span
                  key={ev.id}
                  className={clsx(styles.eventChip, colorClass(ev.colorId))}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(ev);
                  }}
                  title={ev.summary}
                >
                  {ev.allDay ? '●' : formatTime(ev.start)} {ev.summary}
                </span>
              ))}
              {dayEvents.length > MAX_CHIPS && (
                <span className={styles.moreChip}>+{dayEvents.length - MAX_CHIPS} autres</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Day detail panel */}
      <div className={styles.dayPanel}>
        <h3 className={styles.dayPanelTitle}>
          {selectedDay.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        {selectedEvents.length === 0 ? (
          <p className={styles.noEvents}>Aucun événement ce jour.</p>
        ) : (
          <div className={styles.dayEventList}>
            {selectedEvents.map((ev) => (
              <div
                key={ev.id}
                className={styles.dayEvent}
                onClick={() => onEventClick(ev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onEventClick(ev)}
              >
                <span className={styles.dayEventTime}>
                  {ev.allDay ? 'Toute la journée' : formatTime(ev.start)}
                </span>
                <div>
                  <div className={styles.dayEventTitle}>{ev.summary}</div>
                  {ev.location && <div className={styles.dayEventLocation}>📍 {ev.location}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
