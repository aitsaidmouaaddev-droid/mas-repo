import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Typography from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'UI/Typography',
  component: Typography,
  argTypes: {
    variant: { control: 'select', options: ['title', 'subtitle', 'body', 'caption', 'label'] },
    align: { control: 'select', options: ['left', 'center', 'right'] },
    truncate: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Typography>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Typography variant="title">Title — The quick brown fox</Typography>
      <Typography variant="subtitle">Subtitle — The quick brown fox</Typography>
      <Typography variant="body">Body — The quick brown fox jumps over the lazy dog.</Typography>
      <Typography variant="caption">Caption — The quick brown fox</Typography>
      <Typography variant="label">Label — The quick brown fox</Typography>
    </div>
  ),
};

export const Truncated: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <Typography truncate>
        This is a very long text that should be truncated with an ellipsis.
      </Typography>
    </div>
  ),
};
