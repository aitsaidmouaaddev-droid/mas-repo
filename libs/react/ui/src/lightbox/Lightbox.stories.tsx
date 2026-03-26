import type { Meta, StoryObj } from '@storybook/react';
import Lightbox from './Lightbox';

const meta: Meta<typeof Lightbox> = {
  title: 'UI/Lightbox',
  component: Lightbox,
};

export default meta;
type Story = StoryObj<typeof Lightbox>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Sample image',
    open: true,
    onClose: () => {
      /* noop */
    },
  },
};

export const Closed: Story = {
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Sample image',
    open: false,
    onClose: () => {
      /* noop */
    },
  },
};
