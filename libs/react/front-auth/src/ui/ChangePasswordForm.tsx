import { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { Alert, Button, Form, Input, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import styles from './profile.module.scss';

export interface ChangePasswordFormProps {
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export function ChangePasswordForm({
  onSubmit,
  isLoading = false,
  error,
  onCancel,
}: ChangePasswordFormProps) {
  const { t } = useT();
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
      setCurrentError(t('auth.currentRequired'));
      valid = false;
    } else setCurrentError('');

    if (!next) {
      setNextError(t('auth.newPasswordRequired'));
      valid = false;
    } else if (next.length < 8) {
      setNextError(t('auth.minChars'));
      valid = false;
    } else setNextError('');

    if (!confirm) {
      setConfirmError(t('auth.confirmNewRequired'));
      valid = false;
    } else if (confirm !== next) {
      setConfirmError(t('auth.passwordsMismatch'));
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
          label={t('common.cancel')}
          variant="ghost"
          size="md"
          disabled={isLoading}
          onClick={onCancel}
          testId="change-password-cancel"
        />
      )}
      <Button
        type="submit"
        label={isLoading ? t('auth.updating') : t('auth.updatePassword')}
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
        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>{t('auth.currentPassword')}</label>
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
              aria-label={showCurrent ? t('auth.hidePassword') : t('auth.showPassword')}
              tabIndex={-1}
            >
              {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {currentError && <span className={styles.passwordError}>{currentError}</span>}
        </div>

        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>{t('auth.newPassword')}</label>
          <div className={styles.passwordInputRow}>
            <Input
              type={showNext ? 'text' : 'password'}
              placeholder={t('auth.minChars')}
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
              aria-label={showNext ? t('auth.hidePassword') : t('auth.showPassword')}
              tabIndex={-1}
            >
              {showNext ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {nextError && <span className={styles.passwordError}>{nextError}</span>}
        </div>

        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>{t('auth.confirmNewPassword')}</label>
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
              aria-label={showConfirm ? t('auth.hidePassword') : t('auth.showPassword')}
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
