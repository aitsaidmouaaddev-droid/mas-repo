import type { Meta, StoryObj } from '@storybook/react';
import Alert from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  argTypes: { variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] } },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { variant: 'info', children: 'This is an informational alert.' },
};
export const Success: Story = { args: { variant: 'success', children: 'Operation completed!' } };
export const Warning: Story = {
  args: { variant: 'warning', children: 'Please check your input.' },
};
export const Error: Story = { args: { variant: 'error', children: 'Something went wrong.' } };
export const Closable: Story = {
  args: { variant: 'info', children: 'You can close me.', onClose: () => undefined },
};
