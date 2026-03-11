/**
 * @module progressBar.style
 * Style factory and types for {@link ProgressBar}.
 *
 * @see {@link ProgressBar} — progress-bar/ProgressBar.tsx
 */
import type { TextStyle, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import type { StylesOverride } from '../useResultedStyle';
import type { ThemeTokens } from '@mas/shared/types';

/**
 * Structural style shape for the {@link ProgressBar} component.
 * Covers both linear and circular variants.
 */
export type ProgressBarShape = {
  // Linear
  linearWrapper: ViewStyle;
  track: ViewStyle;
  fill: ViewStyle;
  linearLabel: TextStyle;

  // Circular
  circleWrapper: ViewStyle;
  circleLabelContainer: ViewStyle;
  circleLabel: TextStyle;
};

/**
 * Creates themed styles for {@link ProgressBar}.
 *
 * @param theme - Active theme tokens.
 * @returns A {@link ProgressBarShape} ready for composition with {@link useResultedStyle}.
 */
export default function makeProgressBarStyles(theme: ThemeTokens): ProgressBarShape {
  return StyleSheet.create({
    // ----- Linear -----
    linearWrapper: {
      gap: 6,
    },
    track: {
      height: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.track,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
    },
    linearLabel: {
      fontSize: 12,
      opacity: 0.8,
      color: (theme.colors as any).text ?? theme.colors.primary,
      alignSelf: 'flex-start',
    },

    // ----- Circular -----
    circleWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleLabelContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: (theme.colors as any).text ?? theme.colors.primary,
    },
  });
}

export type ProgressBarStyles = StylesOverride<ProgressBarShape>;
