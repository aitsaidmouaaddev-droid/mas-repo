import { useState, type FormEvent } from 'react';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import { Alert, Button, InputField, Link, Stack, Typography } from '@mas/react-ui';
import styles from './auth-form.module.scss';

/**
 * Props for {@link ForgotPasswordForm}.
 */
export interface ForgotPasswordFormProps {
  /**
   * Called with the submitted email. The server always returns true regardless
   * of whether the email exists — the UI shows a success message either way.
   */
  onSubmit: (email: string) => Promise<void> | void;
  /** When `true`, disables the form and shows a loading state. */
  isLoading?: boolean;
  /** Network / server error to display. */
  error?: string | null;
  /** Called when the user clicks "Back to sign in". */
  onBackClick?: () => void;
}

/**
 * Forgot-password form — collects an email address and triggers a reset email.
 *
 * After a successful submission the component renders a confirmation message so
 * the user knows to check their inbox.
 *
 * @example
 * ```tsx
 * <ForgotPasswordForm
 *   onSubmit={async (email) => {
 *     await apolloClient.mutate({ mutation: FORGOT_PASSWORD, variables: { email } });
 *   }}
 *   onBackClick={() => setMode('login')}
 * />
 * ```
 */
export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
  error,
  onBackClick,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);

  const validate = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!re.test(email.trim())) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(email.trim());
    setSent(true);
  };

  if (sent) {
    return (
      <Stack direction="vertical" gap={20}>
        <Alert variant="success">
          If <strong>{email}</strong> is registered, a reset link has been sent. Check your inbox.
        </Alert>
        {onBackClick && (
          <div className={styles.footer}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBackClick();
              }}
            >
              <FiArrowLeft size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Back to sign in
            </Link>
          </div>
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
          Enter your email and we'll send you a link to reset your password.
        </Typography>

        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errorText={emailError}
          disabled={isLoading}
          startIcon={FiMail}
          autoComplete="email"
          testId="forgot-email"
        />

        {error && <Alert variant="error">{error}</Alert>}

        <Button
          type="submit"
          label={isLoading ? 'Sending…' : 'Send reset link'}
          variant="primary"
          size="md"
          disabled={isLoading}
          startIcon={isLoading ? undefined : FiSend}
          style={{ width: '100%' }}
          testId="forgot-submit"
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
            <FiArrowLeft size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Back to sign in
          </Link>
        </div>
      )}
    </form>
  );
}
