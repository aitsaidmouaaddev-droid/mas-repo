import React, { useMemo } from 'react';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './progressBar.module.scss';

export type ProgressBarVariant = 'linear' | 'circular';

export interface ProgressBarProps {
  value?: number;
  isInfinite?: boolean;
  variant?: ProgressBarVariant;
  size?: number;
  strokeWidth?: number;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(v, 1));

export default function ProgressBar({
  value = 0,
  isInfinite = false,
  variant = 'linear',
  size = 56,
  strokeWidth = 6,
  classOverride,
  styleOverride,
  testId,
}: ProgressBarProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const v = clamp01(value);
  const pct = useMemo(() => Math.round(v * 100), [v]);

  if (variant === 'circular') {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - v);
    const indeterminateDash = `${Math.max(8, circumference * 0.25)} ${circumference}`;

    return (
      <div
        className={s.className.circleWrapper}
        style={{ ...s.style.circleWrapper, width: size, height: size }}
        data-testid={testId ?? 'progress-circle'}
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
    <div className={s.className.linearWrapper} style={s.style.linearWrapper} data-testid={testId}>
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
            style={{ ...s.style.fill, width: `${pct}%` }}
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
