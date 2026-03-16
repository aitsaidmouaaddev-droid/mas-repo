import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tag, { TagWithSkeleton } from './Tag';

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
      <Tag label="Success" variant="success" />
      <Tag label="Warning" variant="warning" />
      <Tag label="Error" variant="error" />
      <Tag label="Info" variant="info" />
      <Tag label="Custom" style={{ background: '#a21caf', color: '#fff' }} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag label="Info" variant="info" />
      <Tag label="Success" variant="success" />
      <Tag label="Warning" variant="warning" />
      <Tag label="Error" variant="error" />
      <Tag label="Default" />
      <Tag label="Custom" style={{ background: '#a21caf', color: '#fff' }} />
    </div>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <TagWithSkeleton loading label="..." />
    </div>
  ),
};
