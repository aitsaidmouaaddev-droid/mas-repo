import { useState } from 'react';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import { Alert, Button, Form, InputField, Link, Stack, Typography } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import styles from './auth-form.module.scss';

export interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  onBackClick?: () => void;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
  error,
  onBackClick,
}: ForgotPasswordFormProps) {
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);

  const validate = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError(t('auth.emailRequired'));
      return false;
    }
    if (!re.test(email.trim())) {
      setEmailError(t('auth.invalidEmail'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(email.trim());
    setSent(true);
  };

  if (sent) {
    return (
      <Stack direction="vertical" gap={20}>
        <Alert variant="success">
          <span dangerouslySetInnerHTML={{ __html: t('auth.resetSent', { email }) }} />
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
              {t('auth.backToSignIn')}
            </Link>
          </div>
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
          {t('auth.forgotDesc')}
        </Typography>

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
          testId="forgot-email"
        />

        {error && <Alert variant="error">{error}</Alert>}

        <Button
          type="submit"
          label={isLoading ? t('auth.sending') : t('auth.sendResetLink')}
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
            {t('auth.backToSignIn')}
          </Link>
        </div>
      )}
    </Form>
  );
}
