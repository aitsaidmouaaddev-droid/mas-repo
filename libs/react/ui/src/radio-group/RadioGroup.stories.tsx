import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import RadioGroup from './RadioGroup';

const meta: Meta<typeof RadioGroup> = { title: 'Molecules/RadioGroup', component: RadioGroup };
export default meta;
type Story = StoryObj<typeof RadioGroup>;

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular', disabled: true },
];

const Demo = (args: Partial<React.ComponentProps<typeof RadioGroup>>) => {
  const [value, setValue] = useState('react');
  return <RadioGroup {...args} value={value} onChange={setValue} />;
};

export const Vertical: Story = {
  render: (args) => <Demo {...args} name="fw" options={options} label="Framework" />,
};
export const Horizontal: Story = {
  render: (args) => (
    <Demo {...args} name="fw" options={options} label="Framework" direction="horizontal" />
  ),
};
