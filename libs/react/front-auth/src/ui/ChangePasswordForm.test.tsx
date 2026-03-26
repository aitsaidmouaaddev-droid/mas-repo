import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChangePasswordForm } from './ChangePasswordForm';

function getInput(testId: string): HTMLInputElement {
  const el = screen.getByTestId(testId);
  return (el.tagName === 'INPUT' ? el : el.querySelector('input')!) as HTMLInputElement;
}

function fill(testId: string, value: string) {
  fireEvent.change(getInput(testId), { target: { value } });
}

function submit() {
  fireEvent.click(screen.getByTestId('change-password-submit'));
}

describe('ChangePasswordForm', () => {
  it('renders all three password fields', () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} />);
    expect(getInput('change-current-password')).toBeInTheDocument();
    expect(getInput('change-new-password')).toBeInTheDocument();
    expect(getInput('change-confirm-password')).toBeInTheDocument();
  });

  it('shows "Current password is required" when current is empty', async () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} />);
    submit();
    await waitFor(() =>
      expect(screen.getByText('Current password is required')).toBeInTheDocument(),
    );
  });

  it('shows "New password is required" when new is empty', async () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} />);
    fill('change-current-password', 'oldpass');
    submit();
    await waitFor(() =>
      expect(screen.getByText('New password is required')).toBeInTheDocument(),
    );
  });

  it('shows "Minimum 8 characters" for short new password', async () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} />);
    fill('change-current-password', 'oldpass');
    fill('change-new-password', 'short');
    fill('change-confirm-password', 'short');
    submit();
    await waitFor(() => expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument());
  });

  it('shows "Passwords do not match" when confirm differs', async () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} />);
    fill('change-current-password', 'oldpass');
    fill('change-new-password', 'newpassword');
    fill('change-confirm-password', 'different1');
    submit();
    await waitFor(() =>
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument(),
    );
  });

  it('calls onSubmit with current and new password when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ChangePasswordForm onSubmit={onSubmit} />);
    fill('change-current-password', 'oldpassword');
    fill('change-new-password', 'newpassword');
    fill('change-confirm-password', 'newpassword');
    submit();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith('oldpassword', 'newpassword'),
    );
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn();
    render(<ChangePasswordForm onSubmit={onSubmit} />);
    submit();
    await waitFor(() =>
      expect(screen.getByText('Current password is required')).toBeInTheDocument(),
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('displays the error prop', () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} error="Wrong password." />);
    expect(screen.getByText('Wrong password.')).toBeInTheDocument();
  });

  it('shows loading label on submit button when isLoading', () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByTestId('change-password-submit')).toHaveTextContent('Updating…');
  });

  it('disables submit button when isLoading', () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByTestId('change-password-submit')).toBeDisabled();
  });

  it('renders Cancel button when onCancel is provided', () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByTestId('change-password-cancel')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(<ChangePasswordForm onSubmit={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId('change-password-cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('does not render Cancel button when onCancel is not provided', () => {
    render(<ChangePasswordForm onSubmit={vi.fn()} />);
    expect(screen.queryByTestId('change-password-cancel')).toBeNull();
  });
});
