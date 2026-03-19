import { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { Alert, Button, Form, Input, Stack } from '@mas/react-ui';
import styles from './profile.module.scss';

/**
 * Props for {@link ChangePasswordForm}.
 */
export interface ChangePasswordFormProps {
  /**
   * Called with `(currentPassword, newPassword)` when the form passes validation.
   * Throw from this callback to keep the form in the error state.
   */
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void> | void;
  /** When `true`, disables the form and shows a loading state on the submit button. */
  isLoading?: boolean;
  /** Server or network error message to display above the submit button. */
  error?: string | null;
  /** Called when the user clicks "Cancel". */
  onCancel?: () => void;
}

/**
 * Form for changing the authenticated user's password.
 *
 * Validates that the new password meets the minimum length requirement and
 * that the confirmation matches before calling `onSubmit`.
 *
 * @example
 * ```tsx
 * <ChangePasswordForm
 *   onSubmit={async (current, next) => {
 *     await changePassword({ current, next });
 *     setMode('profile');
 *   }}
 *   isLoading={isSaving}
 *   error={saveError}
 *   onCancel={() => setMode('profile')}
 * />
 * ```
 */
export function ChangePasswordForm({
  onSubmit,
  isLoading = false,
  error,
  onCancel,
}: ChangePasswordFormProps) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentError, setCurrentError] = useState('');
  const [nextError, setNextError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const validate = () => {
    let valid = true;
    if (!current) {
      setCurrentError('Current password is required');
      valid = false;
    } else setCurrentError('');

    if (!next) {
      setNextError('New password is required');
      valid = false;
    } else if (next.length < 8) {
      setNextError('Minimum 8 characters');
      valid = false;
    } else setNextError('');

    if (!confirm) {
      setConfirmError('Please confirm your new password');
      valid = false;
    } else if (confirm !== next) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else setConfirmError('');

    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(current, next);
  };

  const actions = (
    <>
      {onCancel && (
        <Button
          type="button"
          label="Cancel"
          variant="ghost"
          size="md"
          disabled={isLoading}
          onClick={onCancel}
          testId="change-password-cancel"
        />
      )}
      <Button
        type="submit"
        label={isLoading ? 'Updating…' : 'Update password'}
        variant="primary"
        size="md"
        disabled={isLoading}
        testId="change-password-submit"
      />
    </>
  );

  return (
    <Form
      className={styles.form}
      onSubmit={() => {
        void handleSubmit();
      }}
      noValidate
      actions={actions}
    >
      <Stack direction="vertical" gap={16}>
        {/* Current password */}
        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>Current password</label>
          <div className={styles.passwordInputRow}>
            <Input
              type={showCurrent ? 'text' : 'password'}
              placeholder="••••••••"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              error={!!currentError}
              disabled={isLoading}
              startIcon={FiLock}
              autoComplete="current-password"
              testId="change-current-password"
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowCurrent((v) => !v)}
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {currentError && <span className={styles.passwordError}>{currentError}</span>}
        </div>

        {/* New password */}
        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>New password</label>
          <div className={styles.passwordInputRow}>
            <Input
              type={showNext ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              error={!!nextError}
              disabled={isLoading}
              startIcon={FiLock}
              autoComplete="new-password"
              testId="change-new-password"
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowNext((v) => !v)}
              aria-label={showNext ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showNext ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {nextError && <span className={styles.passwordError}>{nextError}</span>}
        </div>

        {/* Confirm new password */}
        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>Confirm new password</label>
          <div className={styles.passwordInputRow}>
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={!!confirmError}
              disabled={isLoading}
              startIcon={FiLock}
              autoComplete="new-password"
              testId="change-confirm-password"
              style={{ paddingRight: 44 }}
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
          {confirmError && <span className={styles.passwordError}>{confirmError}</span>}
        </div>

        {error && (
          <Alert variant="error" onClose={undefined}>
            {error}
          </Alert>
        )}
      </Stack>
    </Form>
  );
}
