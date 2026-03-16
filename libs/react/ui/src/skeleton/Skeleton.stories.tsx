import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  argTypes: { variant: { control: 'select', options: ['text', 'circular', 'rectangular'] } },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = { args: { variant: 'text', width: 200 } };
export const Circular: Story = { args: { variant: 'circular', width: 48, height: 48 } };
export const Card: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 300 }}>
      <Skeleton variant="rectangular" width="100%" height={140} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
    </div>
  ),
};
