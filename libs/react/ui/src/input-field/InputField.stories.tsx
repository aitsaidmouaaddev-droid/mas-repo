import type { Meta, StoryObj } from '@storybook/react';
import InputField, { InputFieldWithSkeleton } from './InputField';
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

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center',minHeight: 50 }}>
      <InputFieldWithSkeleton style={{ display: 'flex',minHeight: 50}} loading />
    </div>
  ),
};
