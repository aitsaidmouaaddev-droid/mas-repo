import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Accordion from './Accordion';

const meta: Meta<typeof Accordion> = { title: 'UI/Accordion', component: Accordion };
export default meta;
type Story = StoryObj<typeof Accordion>;

const items = [
  {
    key: '1',
    title: 'What is React?',
    content: <p>A JavaScript library for building user interfaces.</p>,
  },
  { key: '2', title: 'What is TypeScript?', content: <p>A typed superset of JavaScript.</p> },
  { key: '3', title: 'What is Vite?', content: <p>A fast build tool for the web.</p> },
];

export const Single: Story = { args: { items } };
export const Multiple: Story = { args: { items, multiple: true } };
export const DefaultOpen: Story = { args: { items, defaultOpen: ['1'] } };
