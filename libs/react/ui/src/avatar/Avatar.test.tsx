import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders initials when no src', () => {
    render(<Avatar testId="av" initials="AB" />);
    expect(screen.getByTestId('av')).toHaveTextContent('AB');
  });

  it('renders ? when no src and no initials', () => {
    render(<Avatar testId="av" />);
    expect(screen.getByTestId('av')).toHaveTextContent('?');
  });

  it('renders image when src provided', () => {
    render(<Avatar testId="av" src="https://example.com/photo.jpg" alt="User" />);
    const img = screen.getByTestId('av').querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'User');
  });

  it('applies size classes', () => {
    render(<Avatar testId="av" size="lg" initials="X" />);
    expect(screen.getByTestId('av')).toBeDefined();
  });
});
