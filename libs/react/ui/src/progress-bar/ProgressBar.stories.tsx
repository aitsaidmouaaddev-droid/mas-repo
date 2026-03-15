import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  argTypes: {
    variant: { control: 'select', options: ['linear', 'circular'] },
    isInfinite: { control: 'boolean' },
    value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    size: { control: { type: 'range', min: 24, max: 160, step: 1 } },
    strokeWidth: { control: { type: 'range', min: 2, max: 20, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 40, maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Linear: Story = {
  args: { variant: 'linear', value: 0.5, isInfinite: false },
};

export const LinearInfinite: Story = {
  args: { variant: 'linear', isInfinite: true },
};

export const Circular: Story = {
  args: { variant: 'circular', value: 0.7, size: 72, strokeWidth: 6 },
};

export const CircularInfinite: Story = {
  args: { variant: 'circular', isInfinite: true, size: 72, strokeWidth: 6 },
};

export const LiveProgression: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 0.05;
          return next > 1 ? 0 : next;
        });
      }, 120);
      return () => clearInterval(interval);
    }, []);
    return <ProgressBar value={progress} />;
  },
};
