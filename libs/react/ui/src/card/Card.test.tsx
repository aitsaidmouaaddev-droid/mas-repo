import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card testId="card">
        <p>Hello</p>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveTextContent('Hello');
  });

  it('renders overlay when provided', () => {
    render(
      <Card testId="card" renderOverlay={() => <span data-testid="overlay">Over</span>}>
        <p>Content</p>
      </Card>,
    );
    expect(screen.getByTestId('overlay')).toHaveTextContent('Over');
  });

  it('does not render overlay when not provided', () => {
    render(
      <Card testId="card">
        <p>Content</p>
      </Card>,
    );
    expect(screen.queryByTestId('overlay')).toBeNull();
  });

  it('merges additional className from classOverride', () => {
    render(
      <Card testId="card" classOverride={{ base: 'my-custom-class' }}>
        <p>Test</p>
      </Card>,
    );
    // classOverride gets applied via clsx — the custom class should appear
    const card = screen.getByTestId('card');
    expect(card.className).toContain('my-custom-class');
  });

  it('has correct layout hierarchy', () => {
    render(
      <Card testId="card" renderOverlay={() => <span>Overlay</span>}>
        <p>Content</p>
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card.children.length).toBe(2);
  });
});
