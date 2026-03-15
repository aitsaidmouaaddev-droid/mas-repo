import type { ThemeTokens } from '@mas/shared/types';

export const lightTheme: ThemeTokens = {
  mode: 'light',
  colors: {
    background: '#F4F6F8',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    mutedText: '#64748B',
    onSurface: '#0F172A',
    primary: '#2563EB',
    secondary: '#EEF2FF',
    danger: '#DC2626',
    success: '#16A34A',
    shadow: 'rgba(15, 23, 42, 0.12)',
    track: '#CBD5E1',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 12, lg: 20, pill: 999 },
  typography: { title: 24, subtitle: 18, body: 16, caption: 12 },
};
