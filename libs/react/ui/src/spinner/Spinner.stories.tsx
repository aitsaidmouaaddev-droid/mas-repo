import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = { args: { size: 'md' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};
