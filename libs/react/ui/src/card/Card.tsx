import React from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './card.module.scss';

export interface CardProps {
  children: React.ReactNode;
  renderOverlay?: () => React.ReactNode;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  className?: string;
  testId?: string;
}

export default function Card({
  children,
  renderOverlay,
  classOverride,
  styleOverride,
  className,
  testId,
}: CardProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <div className={clsx(s.className.base, className)} style={s.style.base} data-testid={testId}>
      <div className={s.className.content} style={s.style.content}>
        {children}
      </div>
      {renderOverlay && (
        <div className={s.className.overlayLayer} style={s.style.overlayLayer}>
          {renderOverlay()}
        </div>
      )}
    </div>
  );
}
