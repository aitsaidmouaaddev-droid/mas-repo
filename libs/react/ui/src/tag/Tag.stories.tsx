import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tag from './Tag';

const meta: Meta<typeof Tag> = { title: 'UI/Tag', component: Tag };
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = { args: { label: 'React' } };
export const WithRemove: Story = { args: { label: 'React', onRemove: () => alert('removed') } };
export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag label="React" />
      <Tag label="TypeScript" />
      <Tag label="SCSS" />
      <Tag label="Vite" onRemove={() => undefined} />
    </div>
  ),
};
