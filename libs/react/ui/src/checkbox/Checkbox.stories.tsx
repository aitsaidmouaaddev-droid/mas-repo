import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  argTypes: { checked: { control: 'boolean' }, disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { label: 'Accept terms' } };
export const Checked: Story = { args: { label: 'Accept terms', checked: true } };
export const Disabled: Story = { args: { label: 'Cannot change', disabled: true } };
