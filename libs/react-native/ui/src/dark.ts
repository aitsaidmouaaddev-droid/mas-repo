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
 * Palette: deep navy backgrounds, bright-blue primary, rose danger, emerald success.
 */
export const darkTheme: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: '#0C1222',
    surface: '#141B2D',
    surfaceElevated: '#1A2332',
    border: '#1E293B',
    text: '#E2E8F0',
    mutedText: '#94A3B8',
    onSurface: '#E2E8F0',
    primary: '#60A5FA',
    secondary: '#1A2332',
    accent: '#A78BFA',
    danger: '#FB7185',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#38BDF8',
    shadow: 'rgba(0, 0, 0, 0.5)',
    track: '#334155',
  },

  scales: {
    primary: {
      50: '#172554', 100: '#1E3A8A', 200: '#1E40AF', 300: '#1D4ED8', 400: '#2563EB',
      500: '#3B82F6', 600: '#60A5FA', 700: '#93C5FD', 800: '#BFDBFE', 900: '#DBEAFE',
    },
    neutral: {
      50: '#0F172A', 100: '#1E293B', 200: '#334155', 300: '#475569', 400: '#64748B',
      500: '#94A3B8', 600: '#CBD5E1', 700: '#E2E8F0', 800: '#F1F5F9', 900: '#F8FAFC',
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
      50: '#2E1065', 100: '#4C1D95', 200: '#5B21B6', 300: '#6D28D9', 400: '#7C3AED',
      500: '#8B5CF6', 600: '#A78BFA', 700: '#C4B5FD', 800: '#DDD6FE', 900: '#EDE9FE',
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
