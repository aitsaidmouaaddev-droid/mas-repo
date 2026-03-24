/**
 * @module light
 * Light colour-mode token set for the `@mas/rn/ui` design system.
 *
 * ```ts
 * import { lightTheme } from '@mas/rn/ui';
 * ```
 *
 * @see {@link darkTheme} — Dark mode counterpart
 * @see {@link ThemeProvider} — Provider that switches between modes
 */
import type { ThemeTokens } from '@mas/shared/types';

/**
 * Complete {@link ThemeTokens} for light mode.
 *
 * Palette: soft zinc backgrounds, indigo primary, red danger, emerald success.
 */
export const lightTheme: ThemeTokens = {
  mode: 'light',
  colors: {
    background: '#F4F4F5',
    surface: '#FAFAFA',
    surfaceElevated: '#FFFFFF',
    border: '#D4D4D8',
    text: '#18181B',
    mutedText: '#71717A',
    onSurface: '#FAFAFA',
    primary: '#4F46E5',
    secondary: '#F4F4F5',
    accent: '#7C3AED',
    danger: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    info: '#0284C7',
    shadow: 'rgba(9, 9, 11, 0.08)',
    track: '#A1A1AA',
  },

  scales: {
    primary: {
      50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8',
      500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81',
    },
    neutral: {
      50: '#FAFAFA', 100: '#F4F4F5', 200: '#E4E4E7', 300: '#D4D4D8', 400: '#A1A1AA',
      500: '#71717A', 600: '#52525B', 700: '#3F3F46', 800: '#27272A', 900: '#18181B',
    },
    danger: {
      50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171',
      500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D',
    },
    success: {
      50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
      500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B',
    },
    warning: {
      50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24',
      500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F',
    },
    accent: {
      50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA',
      500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95',
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
