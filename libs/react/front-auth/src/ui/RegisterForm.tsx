import { useState } from 'react';
import { FiEye, FiEyeOff, FiUserPlus, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Alert, Button, Form, Input, InputField, Link, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { SocialLoginButtons } from './SocialLoginButtons';
import type { SocialLoginButtonsProps, SocialProvider } from './SocialLoginButtons';
import styles from './auth-form.module.scss';

/**
 * Props for {@link RegisterForm}.
 */
export interface RegisterFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  showDisplayName?: boolean;
  onLoginClick?: () => void;
  socialProviders?: SocialProvider[];
  onProviderLogin?: SocialLoginButtonsProps['onProviderLogin'];
  socialLayout?: SocialLoginButtonsProps['layout'];
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
  showDisplayName = true,
  onLoginClick,
  socialProviders,
  onProviderLogin,
  socialLayout = 'icons',
}: RegisterFormProps) {
  const { t } = useT();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const validate = () => {
    let valid = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError(t('auth.emailRequired'));
      valid = false;
    } else if (!emailRe.test(email.trim())) {
      setEmailError(t('auth.invalidEmail'));
      valid = false;
    } else setEmailError('');

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

    setNameError('');
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({
      email: email.trim(),
      password,
      displayName: displayName.trim() || undefined,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
    });
  };

  return (
    <Form
      className={styles.form}
      onSubmit={() => {
        void handleSubmit();
      }}
      noValidate
    >
      <Stack direction="vertical" gap={16}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
          <InputField
            label={t('auth.firstName')}
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            startIcon={FiUser}
            autoComplete="given-name"
            testId="register-first-name"
          />
          <InputField
            label={t('auth.lastName')}
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            autoComplete="family-name"
            testId="register-last-name"
          />
        </div>

        {showDisplayName && (
          <InputField
            label={t('auth.displayName')}
            type="text"
            placeholder="Jane Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            errorText={nameError}
            disabled={isLoading}
            startIcon={FiUser}
            autoComplete="name"
            hint={t('auth.displayNameHint')}
            testId="register-display-name"
          />
        )}

        <InputField
          label={t('auth.email')}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errorText={emailError}
          disabled={isLoading}
          startIcon={FiMail}
          autoComplete="email"
          testId="register-email"
        />

        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>{t('auth.password')}</label>
          <div className={styles.passwordInputRow}>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.minChars')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              disabled={isLoading}
              startIcon={FiLock}
              autoComplete="new-password"
              testId="register-password"
              style={{ paddingRight: 44 }}
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
          {passwordError && <span className={styles.passwordError}>{passwordError}</span>}
        </div>

        <div className={styles.passwordField}>
          <label className={styles.passwordLabel}>{t('auth.confirmPassword')}</label>
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
              testId="register-confirm"
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

        <Button
          type="submit"
          label={isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
          variant="primary"
          size="md"
          disabled={isLoading}
          startIcon={isLoading ? undefined : FiUserPlus}
          style={{ width: '100%' }}
          testId="register-submit"
        />

        {onProviderLogin && (
          <SocialLoginButtons
            providers={socialProviders}
            onProviderLogin={onProviderLogin}
            disabled={isLoading}
            layout={socialLayout}
          />
        )}
      </Stack>

      {onLoginClick && (
        <div className={styles.footer}>
          <span>{t('auth.hasAccount')}</span>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLoginClick();
            }}
          >
            {t('auth.signInBtn')}
          </Link>
        </div>
      )}
    </Form>
  );
}
