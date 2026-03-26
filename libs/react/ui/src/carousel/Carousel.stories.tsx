import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Carousel from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'UI/Carousel',
  component: Carousel,
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const slideStyle = (bg: string): React.CSSProperties => ({
  height: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  color: '#fff',
  background: bg,
});

export const Default: Story = {
  render: () => (
    <Carousel>
      <div style={slideStyle('#e74c3c')}>Slide 1</div>
      <div style={slideStyle('#3498db')}>Slide 2</div>
      <div style={slideStyle('#2ecc71')}>Slide 3</div>
    </Carousel>
  ),
};

export const SingleSlide: Story = {
  render: () => (
    <Carousel>
      <div style={slideStyle('#9b59b6')}>Only Slide</div>
    </Carousel>
  ),
};

export const Autoplay: Story = {
  render: () => (
    <Carousel autoplay autoplayInterval={2000}>
      <div style={slideStyle('#e74c3c')}>Slide 1</div>
      <div style={slideStyle('#3498db')}>Slide 2</div>
      <div style={slideStyle('#2ecc71')}>Slide 3</div>
    </Carousel>
  ),
};

export const NoLoop: Story = {
  render: () => (
    <Carousel loop={false}>
      <div style={slideStyle('#e74c3c')}>Slide 1</div>
      <div style={slideStyle('#3498db')}>Slide 2</div>
      <div style={slideStyle('#2ecc71')}>Slide 3</div>
    </Carousel>
  ),
};
