import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tag from './Tag';

describe('Tag', () => {
  it('renders label', () => {
    render(<Tag testId="t" label="React" />);
    expect(screen.getByTestId('t')).toHaveTextContent('React');
  });

  it('renders remove button when onRemove provided', () => {
    const onRemove = vi.fn();
    render(<Tag testId="t" label="React" onRemove={onRemove} />);
    const btn = screen.getByTestId('t').querySelector('button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn as HTMLButtonElement);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('does not render remove button when no onRemove', () => {
    render(<Tag testId="t" label="React" />);
    expect(screen.getByTestId('t').querySelector('button')).toBeNull();
  });
});
