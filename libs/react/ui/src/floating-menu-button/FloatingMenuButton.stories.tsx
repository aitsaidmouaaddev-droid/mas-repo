import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import FloatingMenuButton from './FloatingMenuButton';
import { FiEdit, FiCamera, FiUpload, FiTrash2 } from 'react-icons/fi';

const meta: Meta<typeof FloatingMenuButton> = {
  title: 'UI/FloatingMenuButton',
  component: FloatingMenuButton,
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          height: 400,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FloatingMenuButton>;

const menuItems = [
  { name: 'edit', label: 'Edit', icon: FiEdit },
  { name: 'camera', label: 'Camera', icon: FiCamera },
  { name: 'upload', label: 'Upload', icon: FiUpload },
];

export const Default: Story = {
  args: {
    items: menuItems,
    onItemClick: action('onItemClick'),
  },
};

export const WithDelete: Story = {
  args: {
    items: [...menuItems, { name: 'delete', label: 'Delete', icon: FiTrash2 }],
    onItemClick: action('onItemClick'),
  },
};

export const IconsOnly: Story = {
  args: {
    items: menuItems.map(({ name, icon }) => ({ name, icon })),
    onItemClick: action('onItemClick'),
  },
};
