import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { FiCheck, FiArrowRight, FiTrash2, FiPlus } from 'react-icons/fi';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { label: 'Primary Button', variant: 'primary', size: 'md' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button label="Primary" variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Ghost" variant="ghost" />
      <Button label="Danger" variant="danger" />
      <Button label="Outline" variant="outline" />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button label="Confirm" startIcon={FiCheck} variant="primary" />
      <Button label="Next" endIcon={FiArrowRight} variant="secondary" />
      <Button label="Delete" startIcon={FiTrash2} variant="danger" />
    </div>
  ),
};

export const IconOnly: Story = {
  args: { startIcon: FiPlus, variant: 'primary', size: 'md' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button label="Small" size="sm" />
      <Button label="Medium" size="md" />
      <Button label="Large" size="lg" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true, variant: 'primary' },
};
