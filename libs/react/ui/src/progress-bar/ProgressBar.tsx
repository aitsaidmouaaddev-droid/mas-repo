import { useMemo, useRef, useEffect, useState } from 'react';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './progressBar.module.scss';

export type ProgressBarVariant = 'linear' | 'circular';

/**
 * Props for the {@link ProgressBar} component.
 *
 * @property animate - Animate the bar from 0 to target value when it enters the viewport. @default true
 * @property value - Progress value between 0 and 1 (clamped). @default 0
 * @property isInfinite - Enables an indeterminate animation instead of a fixed value. @default false
 * @property variant - Visual style: `'linear'` bar or `'circular'` ring. @default 'linear'
 * @property size - Diameter of the circular variant in pixels. @default 56
 * @property strokeWidth - Stroke width of the circular variant in pixels. @default 6
 * @property classOverride - CSS-module class overrides.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Optional `data-testid` for the root element.
 */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  isInfinite?: boolean;
  animate?: boolean;
  variant?: ProgressBarVariant;
  size?: number;
  strokeWidth?: number;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(v, 1));

/**
 * Displays task completion as a linear bar or circular ring, with optional indeterminate mode.
 *
 * @param props - {@link ProgressBarProps}
 * @returns A linear track or SVG circle representing the current progress.
 *
 * @example
 * ```tsx
 * <ProgressBar value={0.65} variant="linear" />
 * <ProgressBar isInfinite variant="circular" />
 * ```
 */
export default function ProgressBar({
  value = 0,
  isInfinite = false,
  animate = true,
  variant = 'linear',
  size = 56,
  strokeWidth = 6,
  classOverride,
  styleOverride,
  testId,
  style,
  ...rest
}: ProgressBarProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const v = clamp01(value);
  const pct = useMemo(() => Math.round(v * 100), [v]);

  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!animate || isInfinite) return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Double rAF ensures the browser paints width:0 before transitioning to target
          requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, isInfinite]);

  // For animated bars, display 0 until visible then snap to target (CSS transition handles easing)
  const displayedPct = animate && !isInfinite ? (visible ? pct : 0) : pct;

  if (variant === 'circular') {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const displayedV = displayedPct / 100;
    const dashOffset = circumference * (1 - displayedV);
    const indeterminateDash = `${Math.max(8, circumference * 0.25)} ${circumference}`;

    return (
      <div
        ref={rootRef}
        className={s.className.circleWrapper}
        style={{ ...s.style.circleWrapper, width: size, height: size, ...style }}
        data-testid={testId ?? 'progress-circle'}
        {...rest}
      >
        <svg width={size} height={size} className={isInfinite ? s.className.circleSpin : undefined}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="var(--color-track, #cbd5e1)"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="var(--color-primary, #2563eb)"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={isInfinite ? indeterminateDash : `${circumference} ${circumference}`}
            strokeDashoffset={isInfinite ? 0 : dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={
              animate && !isInfinite
                ? { transition: 'stroke-dashoffset 0.8s ease-in-out' }
                : undefined
            }
          />
        </svg>
        {!isInfinite && (
          <div className={s.className.circleLabelContainer} style={s.style.circleLabelContainer}>
            <span className={s.className.circleLabel} style={s.style.circleLabel}>
              {pct}%
            </span>
          </div>
        )}
      </div>
    );
  }

  // Linear
  return (
    <div
      ref={rootRef}
      className={s.className.linearWrapper}
      style={{ ...s.style.linearWrapper, ...style }}
      data-testid={testId}
      {...rest}
    >
      <div className={s.className.track} style={s.style.track} data-testid="progress-track">
        {isInfinite ? (
          <div
            className={s.className.fillIndeterminate}
            style={s.style.fillIndeterminate}
            data-testid="progress-fill"
          />
        ) : (
          <div
            className={s.className.fill}
            style={{ ...s.style.fill, width: `${displayedPct}%` }}
            data-testid="progress-fill"
          />
        )}
      </div>
      {!isInfinite && (
        <span className={s.className.linearLabel} style={s.style.linearLabel}>
          {pct}%
        </span>
      )}
    </div>
  );
}
