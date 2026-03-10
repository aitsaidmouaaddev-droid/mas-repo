import React from 'react';
import { ThemeProvider } from '@mas/rn/ui';

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
      <Story />
    </ThemeProvider>
  ),
];

// Default export for Storybook 8+ annotation system
export default { parameters, decorators };
