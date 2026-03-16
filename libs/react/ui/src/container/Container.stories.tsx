import type { Meta, StoryObj } from '@storybook/react';
import Container from './Container';

const meta: Meta<typeof Container> = { title: 'Layout/Container', component: Container };
export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: <div style={{ background: '#e9ecef', padding: 16 }}>Contained content</div>,
    maxWidth: 'lg',
  },
};
export const Small: Story = {
  args: {
    children: <div style={{ background: '#e9ecef', padding: 16 }}>Small container</div>,
    maxWidth: 'sm',
  },
};
export const Fluid: Story = {
  args: {
    children: <div style={{ background: '#e9ecef', padding: 16 }}>Fluid container</div>,
    maxWidth: 'fluid',
  },
};
