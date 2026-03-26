import { useState } from 'react';
import { FiEye, FiEyeOff, FiLock, FiCheckCircle } from 'react-icons/fi';
import { Alert, Button, Form, InputField, Link, Stack, Typography } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import styles from './auth-form.module.scss';

export interface ResetPasswordFormProps {
  token: string;
  onSubmit: (token: string, newPassword: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  onBackClick?: () => void;
}

export function ResetPasswordForm({
  token,
  onSubmit,
  isLoading = false,
  error,
  onBackClick,
}: ResetPasswordFormProps) {
  const { t } = useT();
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
      setPasswordError(t('auth.passwordRequired'));
      valid = false;
    } else if (password.length < 8) {
      setPasswordError(t('auth.minChars'));
      valid = false;
    } else setPasswordError('');

    if (!confirm) {
      setConfirmError(t('auth.confirmRequired'));
      valid = false;
    } else if (confirm !== password) {
      setConfirmError(t('auth.passwordsMismatch'));
      valid = false;
    } else setConfirmError('');
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(token, password);
    setDone(true);
  };

  if (!token) {
    return <Alert variant="error">{t('auth.missingToken')}</Alert>;
  }

  if (done) {
    return (
      <Stack direction="vertical" gap={20}>
        <Alert variant="success">
          <FiCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} />
          {t('auth.passwordUpdated')}
        </Alert>
        {onBackClick && (
          <Button
            label={t('auth.signInNewPassword')}
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
    <Form
      className={styles.form}
      onSubmit={() => {
        void handleSubmit();
      }}
      noValidate
    >
      <Stack direction="vertical" gap={16}>
        <Typography
          variant="caption"
          style={{ color: 'var(--color-muted-text)', textAlign: 'center' }}
        >
          {t('auth.resetDesc')}
        </Typography>

        <div className={styles.passwordWrap}>
          <InputField
            label={t('auth.newPassword')}
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.minChars')}
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
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        <div className={styles.passwordWrap}>
          <InputField
            label={t('auth.confirmPassword')}
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
            aria-label={showConfirm ? t('auth.hidePassword') : t('auth.showPassword')}
            tabIndex={-1}
          >
            {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <Button
          type="submit"
          label={isLoading ? t('auth.saving') : t('auth.setNewPassword')}
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
            {t('auth.backToSignIn')}
          </Link>
        </div>
      )}
    </Form>
  );
}
