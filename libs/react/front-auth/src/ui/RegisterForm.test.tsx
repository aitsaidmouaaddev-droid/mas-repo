import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from './RegisterForm';

function getInput(testId: string): HTMLInputElement {
  const el = screen.getByTestId(testId);
  return (el.tagName === 'INPUT' ? el : el.querySelector('input')!) as HTMLInputElement;
}

function fill(testId: string, value: string) {
  fireEvent.change(getInput(testId), { target: { value } });
}

function submit() {
  fireEvent.click(screen.getByTestId('register-submit'));
}

function fillValid() {
  fill('register-email', 'user@example.com');
  fill('register-password', 'password123');
  fill('register-confirm', 'password123');
}

describe('RegisterForm', () => {
  it('renders email, password, and confirm fields', () => {
    render(<RegisterForm onSubmit={vi.fn()} />);
    expect(getInput('register-email')).toBeInTheDocument();
    expect(getInput('register-password')).toBeInTheDocument();
    expect(getInput('register-confirm')).toBeInTheDocument();
  });

  it('shows "Email is required" when submitted empty', async () => {
    render(<RegisterForm onSubmit={vi.fn()} />);
    submit();
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
  });

  it('shows "Invalid email address" for malformed email', async () => {
    render(<RegisterForm onSubmit={vi.fn()} />);
    fill('register-email', 'notanemail');
    submit();
    await waitFor(() => expect(screen.getByText('Invalid email address')).toBeInTheDocument());
  });

  it('shows "Password is required" when password is empty', async () => {
    render(<RegisterForm onSubmit={vi.fn()} />);
    fill('register-email', 'user@example.com');
    submit();
    await waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
  });

  it('shows "Minimum 8 characters" for short password', async () => {
    render(<RegisterForm onSubmit={vi.fn()} />);
    fill('register-email', 'user@example.com');
    fill('register-password', 'abc');
    fill('register-confirm', 'abc');
    submit();
    await waitFor(() => expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument());
  });

  it('shows "Passwords do not match" when confirm differs', async () => {
    render(<RegisterForm onSubmit={vi.fn()} />);
    fill('register-email', 'user@example.com');
    fill('register-password', 'password123');
    fill('register-confirm', 'different1');
    submit();
    await waitFor(() => expect(screen.getByText('Passwords do not match')).toBeInTheDocument());
  });

  it('calls onSubmit with trimmed values when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RegisterForm onSubmit={onSubmit} />);
    fillValid();
    submit();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'user@example.com', password: 'password123' }),
      ),
    );
  });

  it('sends displayName as undefined when left empty', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RegisterForm onSubmit={onSubmit} />);
    fillValid();
    submit();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ displayName: undefined }),
      ),
    );
  });

  it('sends displayName when filled', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RegisterForm onSubmit={onSubmit} />);
    fillValid();
    fill('register-display-name', 'Jane Doe');
    submit();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ displayName: 'Jane Doe' }),
      ),
    );
  });

  it('hides display name field when showDisplayName=false', () => {
    render(<RegisterForm onSubmit={vi.fn()} showDisplayName={false} />);
    expect(screen.queryByTestId('register-display-name')).toBeNull();
  });

  it('displays the error prop', () => {
    render(<RegisterForm onSubmit={vi.fn()} error="Registration failed." />);
    expect(screen.getByText('Registration failed.')).toBeInTheDocument();
  });

  it('disables fields when isLoading', () => {
    render(<RegisterForm onSubmit={vi.fn()} isLoading />);
    expect(getInput('register-email')).toBeDisabled();
    expect(getInput('register-password')).toBeDisabled();
  });

  it('shows loading label on submit button when isLoading', () => {
    render(<RegisterForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByTestId('register-submit')).toHaveTextContent('Creating account…');
  });

  it('calls onLoginClick when "Sign in" is clicked', () => {
    const onLogin = vi.fn();
    render(<RegisterForm onSubmit={vi.fn()} onLoginClick={onLogin} />);
    fireEvent.click(screen.getByText('Sign in'));
    expect(onLogin).toHaveBeenCalledOnce();
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);
    submit();
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
