import { useState, useCallback } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './timeline.module.scss';

/**
 * A collapsible sub-entry inside a {@link TimelineItem}.
 */
export interface TimelineSubItem {
  title: string;
  subtitle?: string;
  description?: string;
  bullets?: string[];
}

/**
 * A single entry in a {@link Timeline}.
 */
export interface TimelineItem {
  title: string;
  /** e.g. date range "2019 - Present" */
  subtitle?: string;
  /** e.g. "Company, City" */
  location?: string;
  description?: string;
  bullets?: string[];
  /** Collapsible sub-entries (e.g. missions within a consulting role) */
  subItems?: TimelineSubItem[];
}

/**
 * Props for the {@link Timeline} component.
 *
 * @property items - Array of timeline entries to display
 * @property className - Additional CSS class for the root element
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Value for `data-testid`
 */
export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * A vertical timeline for displaying resume, education, or experience entries.
 *
 * Renders a vertical line on the left with dots at each item and card-like
 * content blocks to the right.
 *
 * @param props - {@link TimelineProps}
 * @returns The rendered timeline element
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { title: 'Senior Developer', subtitle: '2021 - Present', location: 'Acme, Paris' },
 *     { title: 'Junior Developer', subtitle: '2019 - 2021', location: 'Startup, Lyon' },
 *   ]}
 * />
 * ```
 */
export default function Timeline({
  items,
  className,
  classOverride,
  styleOverride,
  testId,
}: TimelineProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});

  const toggleSub = useCallback((key: string) => {
    setOpenSubs((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <div
      className={clsx(s.className.timeline, className)}
      style={s.style.timeline}
      data-testid={testId}
    >
      <div className={s.className.line} style={s.style.line} />

      {items.map((entry, index) => (
        <div key={index} className={s.className.item} style={s.style.item}>
          <div className={s.className.dot} style={s.style.dot} />

          <h3 className={s.className.title} style={s.style.title}>
            {entry.title}
          </h3>

          {entry.subtitle && (
            <span className={s.className.subtitle} style={s.style.subtitle}>
              {entry.subtitle}
            </span>
          )}

          {entry.location && (
            <p className={s.className.location} style={s.style.location}>
              {entry.location}
            </p>
          )}

          {entry.description && (
            <p className={s.className.description} style={s.style.description}>
              {entry.description}
            </p>
          )}

          {entry.bullets && entry.bullets.length > 0 && (
            <ul className={s.className.bullets} style={s.style.bullets}>
              {entry.bullets.map((text, i) => (
                <li key={i} className={s.className.bullet} style={s.style.bullet}>
                  {text}
                </li>
              ))}
            </ul>
          )}

          {entry.subItems && entry.subItems.length > 0 && (
            <div className={s.className.subItems} style={s.style.subItems}>
              {entry.subItems.map((sub, si) => {
                const key = `${index}-${si}`;
                const isOpen = !!openSubs[key];
                return (
                  <div key={si} className={s.className.subItem} style={s.style.subItem}>
                    <button
                      type="button"
                      className={clsx(s.className.subToggle, isOpen && s.className.subToggleOpen)}
                      onClick={() => toggleSub(key)}
                      aria-expanded={isOpen}
                    >
                      <span className={s.className.subChevron} style={s.style.subChevron}>
                        {isOpen ? '\u25BE' : '\u25B8'}
                      </span>
                      {sub.title}
                      {sub.subtitle && (
                        <span className={s.className.subSubtitle} style={s.style.subSubtitle}>
                          {sub.subtitle}
                        </span>
                      )}
                    </button>

                    {isOpen && (
                      <div className={s.className.subContent} style={s.style.subContent}>
                        {sub.description && (
                          <p className={s.className.description} style={s.style.description}>
                            {sub.description}
                          </p>
                        )}
                        {sub.bullets && sub.bullets.length > 0 && (
                          <ul className={s.className.bullets} style={s.style.bullets}>
                            {sub.bullets.map((text, bi) => (
                              <li key={bi} className={s.className.bullet} style={s.style.bullet}>
                                {text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
