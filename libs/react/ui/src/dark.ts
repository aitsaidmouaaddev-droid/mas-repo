import type { ThemeTokens } from '@mas/shared/types';

export const darkTheme: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: '#0B1220',
    surface: '#111827',
    border: '#1F2937',
    text: '#F1F5F9',
    mutedText: '#94A3B8',
    onSurface: '#F1F5F9',
    primary: '#3B82F6',
    secondary: '#1E293B',
    danger: '#F87171',
    success: '#34D399',
    shadow: 'rgba(0, 0, 0, 0.6)',
    track: '#334155',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 6, md: 12, lg: 20, pill: 999 },
  typography: { title: 24, subtitle: 18, body: 16, caption: 12 },
};
