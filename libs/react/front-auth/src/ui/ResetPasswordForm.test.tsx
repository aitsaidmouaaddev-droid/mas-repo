import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResetPasswordForm } from './ResetPasswordForm';

function getInput(testId: string): HTMLInputElement {
  const el = screen.getByTestId(testId);
  return (el.tagName === 'INPUT' ? el : el.querySelector('input')!) as HTMLInputElement;
}

function fill(testId: string, value: string) {
  fireEvent.change(getInput(testId), { target: { value } });
}

function submit() {
  fireEvent.click(screen.getByTestId('reset-submit'));
}

describe('ResetPasswordForm', () => {
  it('shows an error alert when token is empty', () => {
    render(<ResetPasswordForm token="" onSubmit={vi.fn()} />);
    expect(screen.getByText(/missing reset token/i)).toBeInTheDocument();
  });

  it('renders password and confirm fields when token is present', () => {
    render(<ResetPasswordForm token="tok123" onSubmit={vi.fn()} />);
    expect(getInput('reset-password')).toBeInTheDocument();
    expect(getInput('reset-confirm')).toBeInTheDocument();
  });

  it('shows "Password is required" when submitted empty', async () => {
    render(<ResetPasswordForm token="tok123" onSubmit={vi.fn()} />);
    submit();
    await waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
  });

  it('shows "Minimum 8 characters" for short password', async () => {
    render(<ResetPasswordForm token="tok123" onSubmit={vi.fn()} />);
    fill('reset-password', 'short');
    fill('reset-confirm', 'short');
    submit();
    await waitFor(() => expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument());
  });

  it('shows "Passwords do not match" when confirm differs', async () => {
    render(<ResetPasswordForm token="tok123" onSubmit={vi.fn()} />);
    fill('reset-password', 'password123');
    fill('reset-confirm', 'different1');
    submit();
    await waitFor(() => expect(screen.getByText('Passwords do not match')).toBeInTheDocument());
  });

  it('calls onSubmit with token and new password when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ResetPasswordForm token="tok123" onSubmit={onSubmit} />);
    fill('reset-password', 'newpassword');
    fill('reset-confirm', 'newpassword');
    submit();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith('tok123', 'newpassword'),
    );
  });

  it('shows success message after valid submission', async () => {
    render(
      <ResetPasswordForm token="tok123" onSubmit={vi.fn().mockResolvedValue(undefined)} />,
    );
    fill('reset-password', 'newpassword');
    fill('reset-confirm', 'newpassword');
    submit();
    await waitFor(() =>
      expect(screen.getByText(/password updated successfully/i)).toBeInTheDocument(),
    );
  });

  it('shows "Sign in with new password" button after success', async () => {
    const onBack = vi.fn();
    render(
      <ResetPasswordForm
        token="tok123"
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onBackClick={onBack}
      />,
    );
    fill('reset-password', 'newpassword');
    fill('reset-confirm', 'newpassword');
    submit();
    await waitFor(() =>
      expect(screen.getByText('Sign in with new password')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText('Sign in with new password'));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn();
    render(<ResetPasswordForm token="tok123" onSubmit={onSubmit} />);
    submit();
    await waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('displays the error prop', () => {
    render(<ResetPasswordForm token="tok123" onSubmit={vi.fn()} error="Link expired." />);
    expect(screen.getByText('Link expired.')).toBeInTheDocument();
  });

  it('shows loading label on submit button when isLoading', () => {
    render(<ResetPasswordForm token="tok123" onSubmit={vi.fn()} isLoading />);
    expect(screen.getByTestId('reset-submit')).toHaveTextContent('Saving…');
  });
});
