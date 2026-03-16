import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Container from './Container';

describe('Container', () => {
  it('renders children', () => {
    render(
      <Container>
        <p>Content</p>
      </Container>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies testId', () => {
    render(
      <Container testId="ctn">
        <p>hi</p>
      </Container>,
    );
    expect(screen.getByTestId('ctn')).toBeInTheDocument();
  });

  it('renders as div', () => {
    render(
      <Container testId="ctn">
        <p>hi</p>
      </Container>,
    );
    expect(screen.getByTestId('ctn').tagName).toBe('DIV');
  });
});
