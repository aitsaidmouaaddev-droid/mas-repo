import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Divider from './Divider';

const meta: Meta<typeof Divider> = { title: 'UI/Divider', component: Divider };
export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = { args: {} };
export const WithLabel: Story = { args: { label: 'OR' } };
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', height: 40, alignItems: 'center' }}>
      <span>Left</span>
      <Divider direction="vertical" />
      <span>Right</span>
    </div>
  ),
};
