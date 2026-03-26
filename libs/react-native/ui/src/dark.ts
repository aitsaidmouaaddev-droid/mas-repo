/**
 * @module dark
 * Dark colour-mode token set for the `@mas/rn/ui` design system.
 *
 * ```ts
 * import { darkTheme } from '@mas/rn/ui';
 * ```
 *
 * @see {@link lightTheme} — Light mode counterpart
 * @see {@link ThemeProvider} — Provider that switches between modes
 */
import type { ThemeTokens } from '@mas/shared/types';

/**
 * Complete {@link ThemeTokens} for dark mode.
 *
 * Palette: true black backgrounds, indigo primary, purple accent, rose danger.
 */
export const darkTheme: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: '#09090B',
    surface: '#131316',
    surfaceElevated: '#1C1C21',
    border: '#27272A',
    text: '#FAFAFA',
    mutedText: '#A1A1AA',
    onSurface: '#FAFAFA',
    primary: '#818CF8',
    secondary: '#1C1C21',
    accent: '#C084FC',
    danger: '#FB7185',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#38BDF8',
    shadow: 'rgba(0, 0, 0, 0.6)',
    track: '#3F3F46',
  },

  scales: {
    primary: {
      50: '#1E1B4B', 100: '#272462', 200: '#312E81', 300: '#3730A3', 400: '#4338CA',
      500: '#4F46E5', 600: '#6366F1', 700: '#818CF8', 800: '#A5B4FC', 900: '#C7D2FE',
    },
    neutral: {
      50: '#09090B', 100: '#18181B', 200: '#27272A', 300: '#3F3F46', 400: '#52525B',
      500: '#71717A', 600: '#A1A1AA', 700: '#D4D4D8', 800: '#E4E4E7', 900: '#FAFAFA',
    },
    danger: {
      50: '#4C0519', 100: '#881337', 200: '#9F1239', 300: '#BE123C', 400: '#E11D48',
      500: '#F43F5E', 600: '#FB7185', 700: '#FDA4AF', 800: '#FECDD3', 900: '#FFE4E6',
    },
    success: {
      50: '#022C22', 100: '#064E3B', 200: '#065F46', 300: '#047857', 400: '#059669',
      500: '#10B981', 600: '#34D399', 700: '#6EE7B7', 800: '#A7F3D0', 900: '#D1FAE5',
    },
    warning: {
      50: '#451A03', 100: '#78350F', 200: '#92400E', 300: '#B45309', 400: '#D97706',
      500: '#F59E0B', 600: '#FBBF24', 700: '#FCD34D', 800: '#FDE68A', 900: '#FEF3C7',
    },
    accent: {
      50: '#3B0764', 100: '#581C87', 200: '#6B21A8', 300: '#7E22CE', 400: '#9333EA',
      500: '#A855F7', 600: '#C084FC', 700: '#D8B4FE', 800: '#E9D5FF', 900: '#F3E8FF',
    },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 12, lg: 20, pill: 999 },
  typography: { title: 24, subtitle: 18, body: 16, caption: 12 },

  transition: {
    fast: '120ms',
    normal: '200ms',
    slow: '350ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },
};
