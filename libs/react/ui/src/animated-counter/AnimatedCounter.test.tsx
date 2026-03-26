import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimatedCounter from './AnimatedCounter';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn().mockImplementation(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  })),
);

describe('AnimatedCounter', () => {
  it('renders with testId', () => {
    render(<AnimatedCounter end={100} testId="counter" />);
    expect(screen.getByTestId('counter')).toBeInTheDocument();
  });

  it('displays prefix', () => {
    render(<AnimatedCounter end={50} prefix="$" testId="counter" />);
    expect(screen.getByTestId('counter')).toHaveTextContent('$');
  });

  it('displays suffix', () => {
    render(<AnimatedCounter end={50} suffix="+" testId="counter" />);
    expect(screen.getByTestId('counter')).toHaveTextContent('+');
  });

  it('initial value is 0', () => {
    render(<AnimatedCounter end={999} testId="counter" />);
    expect(screen.getByTestId('counter')).toHaveTextContent('0');
  });
});
