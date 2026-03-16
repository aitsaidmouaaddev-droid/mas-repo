import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastContainer } from './Toast';

const toasts = [
  { id: '1', message: 'Hello world', variant: 'info' as const },
  { id: '2', message: 'Success!', variant: 'success' as const },
];

describe('ToastContainer', () => {
  it('renders toasts via portal', () => {
    const onDismiss = vi.fn();
    render(<ToastContainer toasts={toasts} onDismiss={onDismiss} testId="tc" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('calls onDismiss on close click', () => {
    const onDismiss = vi.fn();
    render(<ToastContainer toasts={[toasts[0]]} onDismiss={onDismiss} testId="tc" />);
    fireEvent.click(screen.getByLabelText('Dismiss toast'));
    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  it('renders empty when no toasts', () => {
    const onDismiss = vi.fn();
    render(<ToastContainer toasts={[]} onDismiss={onDismiss} testId="tc" />);
    expect(screen.getByTestId('tc').children.length).toBe(0);
  });
});
