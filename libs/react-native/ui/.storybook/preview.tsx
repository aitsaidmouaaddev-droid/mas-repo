import React from 'react';
import { View, Button, Platform, StyleSheet } from 'react-native';
import ThemeProvider, { useTheme } from '../src/ThemeContext';

/**
 * Internal component to toggle Light/Dark theme.
 * Pinned top-right so it never obstructs the story.
 */
const ThemeToggle = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme, mode } = useTheme();

  return (
    <View style={[styles.outerContainer, { backgroundColor: theme.colors.background }]}>
      {/* Mobile frame — active on Web only */}
      <View style={styles.mobileFrame}>
        {/* Floating theme switch button */}
        <View style={styles.toggleContainer}>
          <Button
            title={mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            onPress={toggleTheme}
            color={Platform.OS === 'ios' ? theme.colors.primary : undefined}
          />
        </View>

        {children}
      </View>
    </View>
  );
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story: React.ComponentType) => (
    <ThemeProvider>
      <ThemeToggle>
        <Story />
      </ThemeToggle>
    </ThemeProvider>
  ),
];

// Default export for Storybook 8+ annotation system (looks for module.default first)
export default { parameters, decorators };

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Platform.OS === 'web' ? '#f0f2f5' : 'transparent',
  },
  mobileFrame: {
    ...(Platform.OS === 'web'
      ? {
          width: 375,
          height: 812,
          maxHeight: '95vh' as unknown as number,
          borderRadius: 30,
          overflow: 'hidden',
          borderWidth: 8,
          borderColor: '#1a1a1a',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        }
      : {
          flex: 1,
          width: '100%' as unknown as number,
        }),
  },
  toggleContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    right: 20,
    zIndex: 9999,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
