/**
 * @module logo.style
 * Style factory, animation preset, and types for {@link Logo}.
 *
 * @see {@link Logo} — logo/Logo.tsx
 */
import type { StylesOverride, ThemeTokens } from '@mas/shared/types';
import type { ViewStyle, ImageStyle } from 'react-native';
import { StyleSheet } from 'react-native';

/**
 * Animation configuration for the breathing scale loop used by {@link Logo}.
 */
export interface LogoAnimationPreset {
  scaleFrom: number;
  scaleTo: number;
  duration: number;
}

export const defaultLogoAnimation: LogoAnimationPreset = {
  scaleFrom: 1,
  scaleTo: 1.05,
  duration: 1200,
};

/**
 * Structural style shape for the {@link Logo} component.
 */
export type LogoShape = {
  container: ViewStyle;
  image: ImageStyle;
};

/**
 * Creates themed styles for {@link Logo}.
 * Size is injected dynamically in the component rather than baked into these styles.
 *
 * @param theme - Active theme tokens.
 * @returns A {@link LogoShape} ready for composition with {@link useResultedStyle}.
 */
export default function makeLogoStyles(theme: ThemeTokens): LogoShape {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      // Styles thématiques (ex: une ombre ou un filtre)
      opacity: 1,
    },
  });
}

export type LogoStyles = StylesOverride<LogoShape>;
