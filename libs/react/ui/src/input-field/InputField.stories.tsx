import type { Meta, StoryObj } from '@storybook/react';
import InputField from './InputField';
import { FiMail } from 'react-icons/fi';

const meta: Meta<typeof InputField> = { title: 'UI/InputField', component: InputField };
export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', startIcon: FiMail },
};
export const WithHint: Story = {
  args: { label: 'Password', placeholder: '••••••', hint: 'At least 8 characters' },
};
export const WithError: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', errorText: 'Invalid email address' },
};
