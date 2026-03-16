import type { Meta, StoryObj } from '@storybook/react';
import Grid from './Grid';

const meta: Meta<typeof Grid> = { title: 'Layout/Grid', component: Grid };
export default meta;
type Story = StoryObj<typeof Grid>;

const Cell = ({ children }: { children: string }) => (
  <div style={{ background: '#e9ecef', padding: 16, textAlign: 'center' }}>{children}</div>
);

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    gap: 12,
    children: (
      <>
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
        <Cell>4</Cell>
        <Cell>5</Cell>
        <Cell>6</Cell>
      </>
    ),
  },
};
export const CustomTemplate: Story = {
  args: {
    columns: '200px 1fr 1fr',
    gap: 8,
    children: (
      <>
        <Cell>Sidebar</Cell>
        <Cell>Main</Cell>
        <Cell>Extra</Cell>
      </>
    ),
  },
};
