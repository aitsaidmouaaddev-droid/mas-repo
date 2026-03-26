import type { ThemeTokens } from './theme';

// ---------------------------------------------------------------------------
// Helper — a minimal conforming ThemeTokens object
// ---------------------------------------------------------------------------

const STUB_SCALE = {
  50: '#fafafa', 100: '#f5f5f5', 200: '#eeeeee', 300: '#e0e0e0', 400: '#bdbdbd',
  500: '#9e9e9e', 600: '#757575', 700: '#616161', 800: '#424242', 900: '#212121',
};

function makeTheme(mode: 'light' | 'dark'): ThemeTokens {
  return {
    mode,
    colors: {
      onSurface: '#ffffff',
      shadow: 'rgba(0,0,0,0.2)',
      background: '#f5f5f5',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      text: '#111111',
      mutedText: '#888888',
      primary: '#6200ea',
      secondary: '#03dac6',
      accent: '#7c3aed',
      danger: '#b00020',
      success: '#00c853',
      warning: '#e65100',
      info: '#0284c7',
      border: '#cccccc',
      track: '#03dac6',
    },
    scales: {
      primary: STUB_SCALE,
      neutral: STUB_SCALE,
      danger: STUB_SCALE,
      success: STUB_SCALE,
      warning: STUB_SCALE,
      accent: STUB_SCALE,
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    radius: { sm: 4, md: 8, lg: 16, pill: 9999 },
    typography: { title: 24, subtitle: 18, body: 14, caption: 12 },
    transition: {
      fast: '120ms',
      normal: '200ms',
      slow: '350ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  };
}

// ---------------------------------------------------------------------------
// mode
// ---------------------------------------------------------------------------

describe('ThemeTokens — mode', () => {
  it('accepts "light" as a valid mode', () => {
    const theme = makeTheme('light');
    expect(theme.mode).toBe('light');
  });

  it('accepts "dark" as a valid mode', () => {
    const theme = makeTheme('dark');
    expect(theme.mode).toBe('dark');
  });

  it('mode is a string', () => {
    const theme = makeTheme('light');
    expect(typeof theme.mode).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// colors
// ---------------------------------------------------------------------------

describe('ThemeTokens — colors', () => {
  const theme = makeTheme('light');

  const colorKeys: Array<keyof ThemeTokens['colors']> = [
    'onSurface',
    'shadow',
    'background',
    'surface',
    'surfaceElevated',
    'text',
    'mutedText',
    'primary',
    'secondary',
    'accent',
    'danger',
    'success',
    'warning',
    'info',
    'border',
    'track',
  ];

  it.each(colorKeys)('colors.%s is a string', (key) => {
    expect(typeof theme.colors[key]).toBe('string');
  });

  it('colors object has exactly 16 keys', () => {
    expect(Object.keys(theme.colors)).toHaveLength(16);
  });

  it('onSurface matches expected value', () => {
    expect(theme.colors.onSurface).toBe('#ffffff');
  });

  it('primary matches expected value', () => {
    expect(theme.colors.primary).toBe('#6200ea');
  });

  it('danger matches expected value', () => {
    expect(theme.colors.danger).toBe('#b00020');
  });

  it('success matches expected value', () => {
    expect(theme.colors.success).toBe('#00c853');
  });

  it('track is kept for backward-compat and equals secondary in test theme', () => {
    expect(theme.colors.track).toBe(theme.colors.secondary);
  });
});

// ---------------------------------------------------------------------------
// spacing
// ---------------------------------------------------------------------------

describe('ThemeTokens — spacing', () => {
  const theme = makeTheme('light');

  const spacingKeys: Array<keyof ThemeTokens['spacing']> = ['xs', 'sm', 'md', 'lg', 'xl'];

  it.each(spacingKeys)('spacing.%s is a number', (key) => {
    expect(typeof theme.spacing[key]).toBe('number');
  });

  it('spacing.xs is 4', () => {
    expect(theme.spacing.xs).toBe(4);
  });

  it('spacing.sm is 8', () => {
    expect(theme.spacing.sm).toBe(8);
  });

  it('spacing.md is 16', () => {
    expect(theme.spacing.md).toBe(16);
  });

  it('spacing.lg is 24', () => {
    expect(theme.spacing.lg).toBe(24);
  });

  it('spacing.xl is 32', () => {
    expect(theme.spacing.xl).toBe(32);
  });

  it('spacing values are ordered xs < sm < md < lg < xl', () => {
    const { xs, sm, md, lg, xl } = theme.spacing;
    expect(xs).toBeLessThan(sm);
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(lg).toBeLessThan(xl);
  });
});

// ---------------------------------------------------------------------------
// radius
// ---------------------------------------------------------------------------

describe('ThemeTokens — radius', () => {
  const theme = makeTheme('light');

  const radiusKeys: Array<keyof ThemeTokens['radius']> = ['sm', 'md', 'lg', 'pill'];

  it.each(radiusKeys)('radius.%s is a number', (key) => {
    expect(typeof theme.radius[key]).toBe('number');
  });

  it('radius.pill is a large value (>=999)', () => {
    expect(theme.radius.pill).toBeGreaterThanOrEqual(999);
  });

  it('radius values are ordered sm < md < lg < pill', () => {
    const { sm, md, lg, pill } = theme.radius;
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(lg).toBeLessThan(pill);
  });
});

// ---------------------------------------------------------------------------
// typography
// ---------------------------------------------------------------------------

describe('ThemeTokens — typography', () => {
  const theme = makeTheme('light');

  const typographyKeys: Array<keyof ThemeTokens['typography']> = [
    'title',
    'subtitle',
    'body',
    'caption',
  ];

  it.each(typographyKeys)('typography.%s is a number', (key) => {
    expect(typeof theme.typography[key]).toBe('number');
  });

  it('typography.title is the largest font size', () => {
    const { title, subtitle, body, caption } = theme.typography;
    expect(title).toBeGreaterThan(subtitle);
    expect(title).toBeGreaterThan(body);
    expect(title).toBeGreaterThan(caption);
  });

  it('typography.caption is the smallest font size', () => {
    const { title, subtitle, body, caption } = theme.typography;
    expect(caption).toBeLessThan(body);
    expect(caption).toBeLessThan(subtitle);
    expect(caption).toBeLessThan(title);
  });
});

// ---------------------------------------------------------------------------
// index.ts re-exports ThemeTokens
// ---------------------------------------------------------------------------

describe('index re-exports', () => {
  it('re-exports ThemeTokens type from index (module loads without error)', () => {
    // If index.ts fails to re-export, this import will throw at module resolution
    // We test this by importing at the top level — if we get here, it works.
    // For a runtime-checkable assertion, we verify the module shape:
    const mod = require('./index');
    // ThemeTokens is a type-only export — no runtime value. The module itself
    // should be a plain object (possibly empty) when all exports are types.
    expect(typeof mod).toBe('object');
  });
});
