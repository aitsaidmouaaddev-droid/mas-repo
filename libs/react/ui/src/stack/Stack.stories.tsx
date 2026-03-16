import type { Meta, StoryObj } from '@storybook/react';
import Stack from './Stack';

const meta: Meta<typeof Stack> = { title: 'Layout/Stack', component: Stack };
export default meta;
type Story = StoryObj<typeof Stack>;

const Box = ({ children }: { children: string }) => (
  <div style={{ background: '#e9ecef', padding: 16 }}>{children}</div>
);

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    gap: 12,
    children: (
      <>
        <Box>One</Box>
        <Box>Two</Box>
        <Box>Three</Box>
      </>
    ),
  },
};
export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    gap: 12,
    children: (
      <>
        <Box>One</Box>
        <Box>Two</Box>
        <Box>Three</Box>
      </>
    ),
  },
};
