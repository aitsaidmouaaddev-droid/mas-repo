import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: { control: 'select', options: ['text', 'circular', 'rectangular'] },
    width: { control: 'number' },
    height: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 20,
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    width: 200,
  },
};

export const CustomSize: Story = {
  args: {
    variant: 'rectangular',
    width: 300,
    height: 100,
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
        <Skeleton variant="rectangular" width={280} height={140} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            <Skeleton variant="text" width="80%" height={14} />
            <Skeleton variant="text" width="50%" height={12} />
          </div>
        </div>
        <Skeleton variant="text" width="100%" height={12} />
        <Skeleton variant="text" width="90%" height={12} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
        <Skeleton variant="rectangular" width={280} height={140} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            <Skeleton variant="text" width="80%" height={14} />
            <Skeleton variant="text" width="50%" height={12} />
          </div>
        </div>
        <Skeleton variant="text" width="100%" height={12} />
        <Skeleton variant="text" width="90%" height={12} />
      </div>
    </div>
  ),
};
