import type { Meta, StoryObj } from '@storybook/react';
import Link from './Link';

const meta: Meta<typeof Link> = { title: 'UI/Link', component: Link };
export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = { args: { href: '#', children: 'Click here' } };
export const Disabled: Story = { args: { href: '#', children: 'Disabled', disabled: true } };
