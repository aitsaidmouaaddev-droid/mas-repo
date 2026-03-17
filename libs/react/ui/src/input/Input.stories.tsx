import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';
import { FiSearch } from 'react-icons/fi';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    inputSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter text...' } };
export const WithIcons: Story = { args: { placeholder: 'Search...', startIcon: FiSearch } };
export const Error: Story = { args: { placeholder: 'Invalid...', error: true } };
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <Input placeholder="Small" inputSize="sm" />
      <Input placeholder="Medium" inputSize="md" />
      <Input placeholder="Large" inputSize="lg" />
    </div>
  ),
};
