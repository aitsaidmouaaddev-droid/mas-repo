import React from 'react';
import { render, screen } from '@testing-library/react';
import Link from './Link';

describe('Link', () => {
  it('renders anchor with text', () => {
    render(
      <Link testId="lk" href="/home">
        Home
      </Link>,
    );
    expect(screen.getByTestId('lk')).toHaveTextContent('Home');
    expect(screen.getByTestId('lk')).toHaveAttribute('href', '/home');
  });

  it('applies disabled state', () => {
    render(
      <Link testId="lk" disabled>
        Nope
      </Link>,
    );
    expect(screen.getByTestId('lk')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders with target _blank', () => {
    render(
      <Link testId="lk" href="/ext" target="_blank">
        External
      </Link>,
    );
    expect(screen.getByTestId('lk')).toHaveAttribute('target', '_blank');
  });
});
