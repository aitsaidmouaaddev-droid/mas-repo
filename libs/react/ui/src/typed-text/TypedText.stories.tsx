import type { Meta, StoryObj } from '@storybook/react';
import TypedText from './TypedText';

const meta: Meta<typeof TypedText> = {
  title: 'UI/TypedText',
  component: TypedText,
  argTypes: {
    typeSpeed: { control: 'number' },
    deleteSpeed: { control: 'number' },
    pauseDuration: { control: 'number' },
    loop: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TypedText>;

export const Default: Story = {
  args: {
    strings: ['React', 'Angular', 'Vue'],
  },
};

export const SlowTyping: Story = {
  args: {
    strings: ['React', 'Angular', 'Vue'],
    typeSpeed: 200,
  },
};

export const SingleString: Story = {
  args: {
    strings: ['Hello World'],
    loop: false,
  },
};

export const ManyStrings: Story = {
  args: {
    strings: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Kotlin'],
    typeSpeed: 60,
    deleteSpeed: 30,
    pauseDuration: 1000,
  },
};
