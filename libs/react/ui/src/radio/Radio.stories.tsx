import type { Meta, StoryObj } from '@storybook/react';
import Radio from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
  argTypes: { selected: { control: 'boolean' }, disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = { args: { value: 'a', label: 'Option A' } };
export const Selected: Story = { args: { value: 'a', label: 'Option A', selected: true } };
export const Disabled: Story = { args: { value: 'a', label: 'Disabled', disabled: true } };
