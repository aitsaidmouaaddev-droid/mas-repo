import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AnimatedCounter from './AnimatedCounter';

const meta: Meta<typeof AnimatedCounter> = {
  title: 'UI/AnimatedCounter',
  component: AnimatedCounter,
};

export default meta;
type Story = StoryObj<typeof AnimatedCounter>;

export const Default: Story = {
  args: { end: 100 },
};

export const WithSuffix: Story = {
  args: { end: 6, suffix: '+' },
};

export const WithPrefix: Story = {
  args: { end: 1500, prefix: '$' },
};

export const LargeNumber: Story = {
  args: { end: 99999 },
};
