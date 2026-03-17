import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Icon from './Icon';
import { FiHome, FiStar, FiSettings, FiHeart } from 'react-icons/fi';

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Vector: Story = {
  args: { type: 'vector', icon: FiHome, size: 24 },
};

export const WithColor: Story = {
  args: { type: 'vector', icon: FiHeart, size: 32, color: '#DC2626' },
};

export const CustomSvg: Story = {
  args: {
    type: 'svg',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    size: 24,
  },
};

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon type="vector" icon={FiHome} size={24} />
      <Icon type="vector" icon={FiStar} size={24} color="#F59E0B" />
      <Icon type="vector" icon={FiSettings} size={24} />
      <Icon type="vector" icon={FiHeart} size={24} color="#DC2626" />
    </div>
  ),
};
