import type { Meta, StoryObj } from '@storybook/react';
import Header, { HeaderWithSkeleton } from './Header';

const meta: Meta<typeof Header> = { title: 'Layout/Header', component: Header };
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    left: <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>MyApp</span>,
    right: <button>Login</button>,
  },
};

export const ChildrenOnly: Story = {
  args: { children: <span>Simple Title</span> },
};

export const Skeleton: Story = {
  render: () => <HeaderWithSkeleton loading />,
};