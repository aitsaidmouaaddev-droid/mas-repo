import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Logo from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
  argTypes: {
    size: { control: { type: 'range', min: 50, max: 300, step: 10 } },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/150',
    size: 150,
  },
};

export const FastPulse: Story = {
  args: {
    src: 'https://picsum.photos/150',
    size: 120,
    animation: { scaleFrom: 0.8, scaleTo: 1.2, duration: 300 },
  },
};

export const SubtleZen: Story = {
  args: {
    src: 'https://picsum.photos/150',
    size: 120,
    animation: { scaleFrom: 0.98, scaleTo: 1.02, duration: 2000 },
  },
};
