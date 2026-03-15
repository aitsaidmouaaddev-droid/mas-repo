import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  decorators: [
    (Story) => (
      <div style={{ padding: 40, maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <Card>
      <div style={{ padding: 24 }}>
        <h3 style={{ margin: 0 }}>Card Title</h3>
        <p style={{ color: 'var(--color-muted-text)' }}>Card description goes here.</p>
      </div>
    </Card>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Card>
      <img
        src="https://picsum.photos/400/200"
        alt="placeholder"
        style={{ width: '100%', height: 200, objectFit: 'cover' }}
      />
      <div style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 8px' }}>Photo Card</h3>
        <p style={{ margin: 0, color: 'var(--color-muted-text)' }}>A card with an image.</p>
      </div>
    </Card>
  ),
};

export const WithOverlay: Story = {
  render: () => (
    <Card
      renderOverlay={() => (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(22, 163, 74, 0.3)',
            color: '#16a34a',
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          APPROVED
        </div>
      )}
    >
      <div style={{ padding: 24 }}>
        <h3 style={{ margin: 0 }}>Overlaid Card</h3>
        <p style={{ color: 'var(--color-muted-text)' }}>This card has a status overlay.</p>
      </div>
    </Card>
  ),
};
