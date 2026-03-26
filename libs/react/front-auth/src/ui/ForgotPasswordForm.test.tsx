import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ForgotPasswordForm } from './ForgotPasswordForm';

function getInput(testId: string): HTMLInputElement {
  const el = screen.getByTestId(testId);
  return (el.tagName === 'INPUT' ? el : el.querySelector('input')!) as HTMLInputElement;
}

function fill(value: string) {
  fireEvent.change(getInput('forgot-email'), { target: { value } });
}

function submit() {
  fireEvent.click(screen.getByTestId('forgot-submit'));
}

describe('ForgotPasswordForm', () => {
  it('renders email field and submit button', () => {
    render(<ForgotPasswordForm onSubmit={vi.fn()} />);
    expect(getInput('forgot-email')).toBeInTheDocument();
    expect(screen.getByTestId('forgot-submit')).toBeInTheDocument();
  });

  it('shows "Email is required" when submitted empty', async () => {
    render(<ForgotPasswordForm onSubmit={vi.fn()} />);
    submit();
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
  });

  it('shows "Invalid email address" for malformed email', async () => {
    render(<ForgotPasswordForm onSubmit={vi.fn()} />);
    fill('notanemail');
    submit();
    await waitFor(() => expect(screen.getByText('Invalid email address')).toBeInTheDocument());
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn();
    render(<ForgotPasswordForm onSubmit={onSubmit} />);
    submit();
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with trimmed email when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ForgotPasswordForm onSubmit={onSubmit} />);
    fill('  user@example.com  ');
    submit();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('user@example.com'));
  });

  it('shows success message after submission', async () => {
    render(<ForgotPasswordForm onSubmit={vi.fn().mockResolvedValue(undefined)} />);
    fill('user@example.com');
    submit();
    await waitFor(() =>
      expect(screen.getByText(/reset link has been sent/i)).toBeInTheDocument(),
    );
  });

  it('success message includes the submitted email', async () => {
    render(<ForgotPasswordForm onSubmit={vi.fn().mockResolvedValue(undefined)} />);
    fill('user@example.com');
    submit();
    await waitFor(() =>
      expect(screen.getByText(/user@example\.com/)).toBeInTheDocument(),
    );
  });

  it('displays the error prop', () => {
    render(<ForgotPasswordForm onSubmit={vi.fn()} error="Server error." />);
    expect(screen.getByText('Server error.')).toBeInTheDocument();
  });

  it('shows loading label on submit button when isLoading', () => {
    render(<ForgotPasswordForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByTestId('forgot-submit')).toHaveTextContent('Sending…');
  });

  it('calls onBackClick when "Back to sign in" is clicked', () => {
    const onBack = vi.fn();
    render(<ForgotPasswordForm onSubmit={vi.fn()} onBackClick={onBack} />);
    fireEvent.click(screen.getByText(/back to sign in/i));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
