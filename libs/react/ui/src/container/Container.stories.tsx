import type { Meta, StoryObj } from '@storybook/react';
import Container, { ContainerWithSkeleton } from './Container';
import Card from '../card/Card';

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

export const Skeleton: Story = {
  render: () => (
    <ContainerWithSkeleton loading>
      {' '}
      <Card>
        <div style={{ padding: 24 }}>
          <h3 style={{ margin: 0 }}>Card Title</h3>
          <p style={{ color: 'var(--color-muted-text)' }}>Card description goes here.</p>
        </div>
      </Card>{' '}
    </ContainerWithSkeleton>
  ),
};
