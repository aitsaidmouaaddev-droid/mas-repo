/**
 * @module icon.style
 * Style factory and types for {@link Icon}.
 *
 * @see {@link Icon} — icon/Icon.tsx
 */
import type { StylesOverride } from '../useResultedStyle';
import type { ThemeTokens } from '@mas/shared/types';
import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

/**
 * Structural style shape for the {@link Icon} component.
 */
export type IconShape = {
  /** Container View wrapping the icon renderer. */
  container: ViewStyle;
  /** Style properties for vector icons (Ionicons / custom renderer). */
  vectorIcon: {
    color: string;
  };
  /** Style properties for SVG icon components. */
  svgIcon: {
    fill: string;
    stroke?: string;
  };
};

/**
 * Creates themed styles for {@link Icon}.
 *
 * @param theme - Active theme tokens.
 * @returns An {@link IconShape} ready for composition with {@link useResultedStyle}.
 */
export default function makeIconStyles(theme: ThemeTokens): IconShape {
  // Styles standards gérés par StyleSheet
  const flatStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return {
    ...flatStyles,
    vectorIcon: {
      color: theme.colors.text,
    },
    svgIcon: {
      fill: theme.colors.text,
    },
  };
}

export type IconStyles = StylesOverride<IconShape>;
