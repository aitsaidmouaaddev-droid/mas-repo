import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Badge, { BadgeWithSkeleton } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
    },
    dot: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { label: 'New', variant: 'primary' } };
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge label="Primary" variant="primary" />
      <Badge label="Secondary" variant="secondary" />
      <Badge label="Success" variant="success" />
      <Badge label="Warning" variant="warning" />
      <Badge label="Error" variant="error" />
    </div>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <BadgeWithSkeleton loading label="Loading" variant="primary" />
    </div>
  ),
};
