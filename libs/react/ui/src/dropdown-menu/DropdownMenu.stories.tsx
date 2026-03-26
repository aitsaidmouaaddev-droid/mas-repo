import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DropdownMenu from './DropdownMenu';
import Button from '../button/Button';

const meta: Meta<typeof DropdownMenu> = { title: 'UI/DropdownMenu', component: DropdownMenu };
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button label="Actions" />}
      items={[
        { key: 'edit', label: 'Edit' },
        { key: 'duplicate', label: 'Duplicate' },
        { key: 'sep', label: '', separator: true },
        { key: 'delete', label: 'Delete' },
      ]}
    />
  ),
};
