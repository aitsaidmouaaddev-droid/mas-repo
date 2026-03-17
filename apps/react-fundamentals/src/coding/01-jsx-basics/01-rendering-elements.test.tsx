import { render, screen } from '@testing-library/react';
import { Greeting, Sum } from './01-rendering-elements';

describe('01 — Rendering Elements', () => {
  it('Greeting renders hello message with the given name', () => {
    render(<Greeting name="Alice" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Hello, Alice!',
    );
  });

  it('Sum renders the addition of a and b', () => {
    render(<Sum a={3} b={7} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
