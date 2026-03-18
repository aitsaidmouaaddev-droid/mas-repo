import { useState, type FormEvent } from 'react';
import { FiEye, FiEyeOff, FiLock, FiCheckCircle } from 'react-icons/fi';
import { Alert, Button, InputField, Link, Stack, Typography } from '@mas/react-ui';
import styles from './auth-form.module.scss';

/**
 * Props for {@link ResetPasswordForm}.
 */
export interface ResetPasswordFormProps {
  /** The raw reset token — typically read from the URL query string (`?token=…`). */
  token: string;
  /**
   * Called with `(token, newPassword)` when the form passes validation.
   * Throw to surface an error message.
   */
  onSubmit: (token: string, newPassword: string) => Promise<void> | void;
  /** When `true`, disables the form and shows a loading state. */
  isLoading?: boolean;
  /** Network / server error to display. */
  error?: string | null;
  /** Called when the user clicks "Back to sign in" after a successful reset. */
  onBackClick?: () => void;
}

/**
 * Reset-password form — accepts the one-time token from the URL and a new password.
 *
 * On success, renders a confirmation message with a link back to the login form.
 *
 * @example
 * ```tsx
 * const token = new URLSearchParams(location.search).get('token') ?? '';
 *
 * <ResetPasswordForm
 *   token={token}
 *   onSubmit={async (t, newPassword) => {
 *     await apolloClient.mutate({ mutation: RESET_PASSWORD, variables: { token: t, newPassword } });
 *   }}
 *   onBackClick={() => setMode('login')}
 * />
 * ```
 */
export function ResetPasswordForm({
  token,
  onSubmit,
  isLoading = false,
  error,
  onBackClick,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [done, setDone] = useState(false);

  const validate = () => {
    let valid = true;
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Minimum 8 characters');
      valid = false;
    } else setPasswordError('');

    if (!confirm) {
      setConfirmError('Please confirm your password');
      valid = false;
    } else if (confirm !== password) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else setConfirmError('');
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(token, password);
    setDone(true);
  };

  if (!token) {
    return <Alert variant="error">Missing reset token. Please use the link from your email.</Alert>;
  }

  if (done) {
    return (
      <Stack direction="vertical" gap={20}>
        <Alert variant="success">
          <FiCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Password updated successfully.
        </Alert>
        {onBackClick && (
          <Button
            label="Sign in with new password"
            variant="primary"
            size="md"
            onClick={onBackClick}
            style={{ width: '100%' }}
          />
        )}
      </Stack>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      noValidate
    >
      <Stack direction="vertical" gap={16}>
        <Typography
          variant="caption"
          style={{ color: 'var(--color-muted-text)', textAlign: 'center' }}
        >
          Choose a strong password of at least 8 characters.
        </Typography>

        <div className={styles.passwordWrap}>
          <InputField
            label="New password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={passwordError}
            disabled={isLoading}
            startIcon={FiLock}
            autoComplete="new-password"
            testId="reset-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        <div className={styles.passwordWrap}>
          <InputField
            label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            errorText={confirmError}
            disabled={isLoading}
            startIcon={FiLock}
            autoComplete="new-password"
            testId="reset-confirm"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <Button
          type="submit"
          label={isLoading ? 'Saving…' : 'Set new password'}
          variant="primary"
          size="md"
          disabled={isLoading}
          style={{ width: '100%' }}
          testId="reset-submit"
        />
      </Stack>

      {onBackClick && (
        <div className={styles.footer}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBackClick();
            }}
          >
            Back to sign in
          </Link>
        </div>
      )}
    </form>
  );
}
