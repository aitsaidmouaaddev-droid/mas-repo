/**
 * @module tabBar.style
 * Style factory and types for {@link TabBar}.
 *
 * @see {@link TabBar} — tab-bar/TabBar.tsx
 */
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { StylesOverride, ThemeTokens } from "@mas/shared/types";
import { IconStyles } from "../icon/icon.style"; // ✅ Pour piloter les icônes des onglets

/**
 * Structural style shape for the {@link TabBar} component.
 */
export type TabBarShape = {
  /** Outer floating container (pill-shaped, positioned absolutely). */
  container: ViewStyle;
  /** Touch-target for each individual tab. */
  item: ViewStyle;
  /** Inner wrapper stacking the icon and label. */
  itemContent: ViewStyle;
  /** Inactive tab label text. */
  label: TextStyle;
  /** Active tab label text. */
  labelActive: TextStyle;
  /** Icon style overrides forwarded to each tab's {@link Icon}. */
  icon: IconStyles;
};

/**
 * Creates themed styles for {@link TabBar}.
 *
 * @param theme - Active theme tokens.
 * @returns A {@link TabBarShape} ready for composition with {@link useResultedStyle}.
 */
export default function makeTabBarStyles(theme: ThemeTokens): TabBarShape {
  const flats = StyleSheet.create({
    container: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 24, // Un peu plus d'espace pour le look "floating"
      height: 40, // Hauteur standard pour les tab bars flottantes

      backgroundColor: theme.colors.background,
      borderColor: theme.colors.track,
      borderWidth: 1,

      borderRadius: 999,
      paddingVertical: 10,
      paddingHorizontal: 12,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      // Shadow pour l'effet flottant
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },

    item: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      borderRadius: 999,
    },

    itemContent: {
      alignItems: "center",
      justifyContent: "center",
      gap: 4, // Espace entre icône et texte
    },

    label: {
      fontSize: 12, // Tab labels sont souvent plus petits
      color: theme.colors.mutedText,
      fontWeight: "500",
    },

    labelActive: {
      color: theme.colors.primary,
      fontWeight: "700",
    },
  });

  return {
    ...flats,
    icon: {
      container: {
        // Style par défaut de l'icône dans la tab
      },
    },
  };
}

export type TabBarStyles = StylesOverride<TabBarShape>;
