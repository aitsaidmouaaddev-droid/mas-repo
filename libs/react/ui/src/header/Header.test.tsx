import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders left content', () => {
    render(<Header left={<span>Logo</span>} />);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('renders right content', () => {
    render(<Header right={<button>Menu</button>} />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders children in left slot', () => {
    render(
      <Header>
        <span>Title</span>
      </Header>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('applies testId', () => {
    render(<Header testId="hdr" />);
    expect(screen.getByTestId('hdr')).toBeInTheDocument();
  });

  it('renders as header element', () => {
    render(<Header testId="hdr" />);
    expect(screen.getByTestId('hdr').tagName).toBe('HEADER');
  });
});
