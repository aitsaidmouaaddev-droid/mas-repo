import React from 'react';
import type { CSSProperties } from 'react';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './logo.module.scss';

export interface LogoAnimation {
  scaleFrom?: number;
  scaleTo?: number;
  duration?: number;
}

export interface LogoProps {
  src: string;
  alt?: string;
  size?: number;
  animation?: LogoAnimation;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

const DEFAULT_ANIMATION: Required<LogoAnimation> = {
  scaleFrom: 1,
  scaleTo: 1.05,
  duration: 1200,
};

export default function Logo({
  src,
  alt = 'Logo',
  size = 120,
  animation,
  classOverride,
  styleOverride,
  testId,
}: LogoProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const anim = { ...DEFAULT_ANIMATION, ...animation };

  const cssVars: CSSProperties & Record<string, string> = {
    '--logo-scale-from': String(anim.scaleFrom),
    '--logo-scale-to': String(anim.scaleTo),
    '--logo-duration': `${anim.duration}ms`,
  };

  return (
    <div className={s.className.container} style={s.style.container} data-testid={testId}>
      <img
        className={s.className.image}
        style={{ ...s.style.image, width: size, height: size, ...cssVars }}
        src={src}
        alt={alt}
      />
    </div>
  );
}
