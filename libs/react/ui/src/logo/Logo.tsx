import type { CSSProperties } from 'react';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './logo.module.scss';

/**
 * Configuration for the {@link Logo} hover/pulse animation.
 *
 * @property scaleFrom - Starting scale factor. @default 1
 * @property scaleTo - Ending scale factor. @default 1.05
 * @property duration - Animation duration in milliseconds. @default 1200
 */
export interface LogoAnimation {
  scaleFrom?: number;
  scaleTo?: number;
  duration?: number;
}

/**
 * Props for the {@link Logo} component.
 *
 * @property src - Image source URL.
 * @property alt - Accessible alt text for the logo image. @default 'Logo'
 * @property size - Width and height of the logo in pixels. @default 120
 * @property animation - Optional animation config; merged with sensible defaults.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
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

/**
 * Displays a logo image with an optional scale-pulse animation driven by CSS custom properties.
 *
 * @param props - {@link LogoProps}
 * @returns A container `<div>` with an animated `<img>` element.
 *
 * @example
 * ```tsx
 * <Logo src="/brand.svg" size={80} animation={{ scaleTo: 1.1 }} />
 * ```
 */
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
