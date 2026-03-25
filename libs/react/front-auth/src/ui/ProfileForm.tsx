import { useState } from 'react';
import { FiUser, FiAtSign, FiImage } from 'react-icons/fi';
import { Alert, Avatar, Button, DatePickerField, Form, InputField, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import type { AuthIdentity } from '../interfaces';
import styles from './profile.module.scss';

export interface ProfileFormData {
  displayName: string;
  identityName: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
}

export interface ProfileFormProps<TIdentity extends AuthIdentity = AuthIdentity> {
  identity: TIdentity;
  onSubmit: (data: ProfileFormData) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export function ProfileForm<TIdentity extends AuthIdentity = AuthIdentity>({
  identity,
  onSubmit,
  isLoading = false,
  error,
  onCancel,
}: ProfileFormProps<TIdentity>) {
  const { t } = useT();
  const [firstName, setFirstName] = useState(identity.firstName ?? '');
  const [lastName, setLastName] = useState(identity.lastName ?? '');
  const [displayName, setDisplayName] = useState(identity.displayName ?? '');
  const [identityName, setIdentityName] = useState(identity.identityName ?? '');
  const [avatarUrl, setAvatarUrl] = useState(identity.avatarUrl ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    identity.dateOfBirth ? new Date(identity.dateOfBirth) : null,
  );

  const initials = (displayName || identityName || identity.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSubmit = async () => {
    await onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: displayName.trim(),
      identityName: identityName.trim(),
      avatarUrl: avatarUrl.trim(),
      dateOfBirth,
    } satisfies ProfileFormData);
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
          testId="profile-cancel"
        />
      )}
      <Button
        type="submit"
        label={isLoading ? t('auth.saving') : t('auth.saveChanges')}
        variant="primary"
        size="md"
        disabled={isLoading}
        testId="profile-save"
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
        <div className={styles.avatarPreview}>
          <Avatar
            src={avatarUrl.trim() || undefined}
            alt={displayName || identityName || 'Preview'}
            initials={initials}
            size="lg"
          />
          <span className={styles.previewLabel}>{t('auth.avatarPreview')}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', minWidth: 0 }}>
          <InputField
            label={t('auth.firstName')}
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            startIcon={FiUser}
            autoComplete="given-name"
            testId="profile-first-name"
            style={{ minWidth: 0 }}
          />
          <InputField
            label={t('auth.lastName')}
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            autoComplete="family-name"
            testId="profile-last-name"
            style={{ minWidth: 0 }}
          />
        </div>

        <DatePickerField
          label={t('auth.dateOfBirth')}
          value={dateOfBirth}
          onChange={setDateOfBirth}
          disabled={isLoading}
          clearable
          maxDate={new Date()}
          displayFormat="dd/MM/yyyy"
          testId="profile-dob"
        />

        <InputField
          label={t('auth.avatarUrl')}
          type="url"
          placeholder="https://example.com/photo.jpg"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          disabled={isLoading}
          startIcon={FiImage}
          autoComplete="photo"
          hint={t('auth.avatarHint')}
          testId="profile-avatar-url"
        />

        <InputField
          label={t('auth.displayName')}
          type="text"
          placeholder="Jane Doe"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={isLoading}
          startIcon={FiUser}
          autoComplete="name"
          hint={t('auth.displayNameHint')}
          testId="profile-display-name"
        />

        <InputField
          label={t('auth.username')}
          type="text"
          placeholder="janedoe"
          value={identityName}
          onChange={(e) => setIdentityName(e.target.value)}
          disabled={isLoading}
          startIcon={FiAtSign}
          autoComplete="username"
          testId="profile-identity-name"
        />

        {identity.email && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-muted-text)',
                fontWeight: 500,
              }}
            >
              {t('auth.email')}
            </span>
            <span
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text)',
                padding: '8px 12px',
                background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'not-allowed',
                opacity: 0.7,
              }}
            >
              {identity.email}
            </span>
            <span style={{ fontSize: 'var(--font-caption)', color: 'var(--color-muted-text)' }}>
              {t('auth.emailReadonly')}
            </span>
          </div>
        )}

        {error && (
          <Alert variant="error" onClose={undefined}>
            {error}
          </Alert>
        )}
      </Stack>
    </Form>
  );
}
