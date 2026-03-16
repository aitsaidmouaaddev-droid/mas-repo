import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithInitials: Story = { args: { initials: 'MA', size: 'md' } };
export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/100', alt: 'User', size: 'lg' },
};
export const Placeholder: Story = { args: { size: 'md' } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar initials="S" size="sm" />
      <Avatar initials="M" size="md" />
      <Avatar initials="L" size="lg" />
    </div>
  ),
};
