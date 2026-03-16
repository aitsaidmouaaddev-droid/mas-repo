import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  argTypes: { position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] } },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  render: () => (
    <div style={{ padding: 60 }}>
      <Tooltip text="I'm a tooltip!" position="top">
        <button>Hover me</button>
      </Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, padding: 60 }}>
      <Tooltip text="Top" position="top">
        <button>Top</button>
      </Tooltip>
      <Tooltip text="Bottom" position="bottom">
        <button>Bottom</button>
      </Tooltip>
      <Tooltip text="Left" position="left">
        <button>Left</button>
      </Tooltip>
      <Tooltip text="Right" position="right">
        <button>Right</button>
      </Tooltip>
    </div>
  ),
};
