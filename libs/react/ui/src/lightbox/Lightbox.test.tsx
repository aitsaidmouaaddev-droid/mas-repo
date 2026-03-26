import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Lightbox from './Lightbox';

describe('Lightbox', () => {
  const defaultProps = {
    src: 'https://picsum.photos/800/600',
    alt: 'Test image',
    onClose: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onClose = vi.fn();
  });

  it('renders nothing when open=false', () => {
    render(<Lightbox {...defaultProps} open={false} testId="lightbox" />);
    expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument();
  });

  it('renders overlay and image when open=true', () => {
    render(<Lightbox {...defaultProps} open testId="lightbox" />);
    expect(screen.getByTestId('lightbox')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultProps.src);
  });

  it('calls onClose on overlay click', () => {
    render(<Lightbox {...defaultProps} open testId="lightbox" />);
    fireEvent.click(screen.getByTestId('lightbox'));
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape key', () => {
    render(<Lightbox {...defaultProps} open testId="lightbox" />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });
});
