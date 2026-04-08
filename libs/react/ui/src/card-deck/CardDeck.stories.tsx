import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CardDeck from './CardDeck';

const meta: Meta<typeof CardDeck> = {
  title: 'UI/CardDeck',
  component: CardDeck,
  decorators: [
    (Story) => (
      <div style={{ padding: 40, maxWidth: 640, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    autoplay: { control: 'boolean' },
    autoplayInterval: { control: { type: 'number', min: 500, max: 10000, step: 500 } },
    loop: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CardDeck>;

const SAMPLE_ITEMS = [
  {
    key: 'nature',
    image: 'https://picsum.photos/seed/nature/800/500',
    title: 'Nature — Landscapes & scenery',
  },
  {
    key: 'city',
    image: 'https://picsum.photos/seed/city/800/500',
    title: 'City — Urban architecture',
  },
  {
    key: 'abstract',
    image: 'https://picsum.photos/seed/abstract/800/500',
    title: 'Abstract — Shapes & colours',
  },
];

export const Default: Story = {
  args: {
    items: SAMPLE_ITEMS,
    autoplay: false,
    loop: true,
  },
};

export const Autoplay: Story = {
  args: {
    items: SAMPLE_ITEMS,
    autoplay: true,
    autoplayInterval: 2500,
    loop: true,
  },
};

export const TwoCards: Story = {
  args: {
    items: SAMPLE_ITEMS.slice(0, 2),
    autoplay: false,
    loop: true,
  },
};

export const NoLoop: Story = {
  args: {
    items: SAMPLE_ITEMS,
    autoplay: false,
    loop: false,
  },
};

export const WithoutTitles: Story = {
  args: {
    items: SAMPLE_ITEMS.map(({ key, image }) => ({ key, image })),
    autoplay: true,
    autoplayInterval: 2000,
    loop: true,
  },
};
