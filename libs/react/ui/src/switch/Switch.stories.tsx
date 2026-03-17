import type { Meta, StoryObj } from '@storybook/react';
import Switch from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  argTypes: { on: { control: 'boolean' }, disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = { args: { label: 'Notifications' } };
export const On: Story = { args: { label: 'Notifications', on: true } };
export const Disabled: Story = { args: { label: 'Locked', disabled: true } };
