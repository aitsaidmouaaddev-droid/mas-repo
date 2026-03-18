import { useState } from 'react';
import { FiUser, FiAtSign, FiImage } from 'react-icons/fi';
import { Alert, Avatar, Button, DatePickerField, Form, InputField, Stack } from '@mas/react-ui';
import type { AuthIdentity } from '../interfaces';
import styles from './profile.module.scss';

/**
 * Fields that can be updated via the profile form.
 * Email is intentionally excluded — it is set at registration and never changed.
 */
export interface ProfileFormData {
  displayName: string;
  identityName: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  /** Date of birth — `null` means not set. */
  dateOfBirth: Date | null;
}

/**
 * Props for {@link ProfileForm}.
 */
export interface ProfileFormProps<TIdentity extends AuthIdentity = AuthIdentity> {
  /** The current identity to pre-populate the form. */
  identity: TIdentity;
  /** Called with the updated fields when the form passes validation and is submitted. */
  onSubmit: (data: ProfileFormData) => Promise<void> | void;
  /** When `true`, disables the form and shows a loading state on the submit button. */
  isLoading?: boolean;
  /** Server or validation error to display above the submit button. */
  error?: string | null;
  /** Called when the user clicks "Cancel". */
  onCancel?: () => void;
}

/**
 * Edit form for a user's profile identity fields.
 *
 * Shows a live avatar preview that updates as the user types an image URL.
 *
 * @example
 * ```tsx
 * <ProfileForm
 *   identity={auth.identity}
 *   onSubmit={async (data) => {
 *     await updateIdentity(data);
 *     setMode('profile');
 *   }}
 *   isLoading={isSaving}
 *   error={saveError}
 *   onCancel={() => setMode('profile')}
 * />
 * ```
 */
export function ProfileForm<TIdentity extends AuthIdentity = AuthIdentity>({
  identity,
  onSubmit,
  isLoading = false,
  error,
  onCancel,
}: ProfileFormProps<TIdentity>) {
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
          label="Cancel"
          variant="ghost"
          size="md"
          disabled={isLoading}
          onClick={onCancel}
          testId="profile-cancel"
        />
      )}
      <Button
        type="submit"
        label={isLoading ? 'Saving…' : 'Save changes'}
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
        {/* Live avatar preview */}
        <div className={styles.avatarPreview}>
          <Avatar
            src={avatarUrl.trim() || undefined}
            alt={displayName || identityName || 'Preview'}
            initials={initials}
            size="lg"
          />
          <span className={styles.previewLabel}>Avatar preview</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
          <InputField
            label="First name"
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            startIcon={FiUser}
            autoComplete="given-name"
            testId="profile-first-name"
          />
          <InputField
            label="Last name"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            autoComplete="family-name"
            testId="profile-last-name"
          />
        </div>

        <DatePickerField
          label="Date of birth"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          disabled={isLoading}
          clearable
          maxDate={new Date()}
          displayFormat="dd/MM/yyyy"
          testId="profile-dob"
        />

        <InputField
          label="Avatar URL"
          type="url"
          placeholder="https://example.com/photo.jpg"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          disabled={isLoading}
          startIcon={FiImage}
          autoComplete="photo"
          hint="Paste any public image URL"
          testId="profile-avatar-url"
        />

        <InputField
          label="Display name"
          type="text"
          placeholder="Jane Doe"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={isLoading}
          startIcon={FiUser}
          autoComplete="name"
          hint="How you'll appear to others"
          testId="profile-display-name"
        />

        <InputField
          label="Username"
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
              Email
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
              Email cannot be changed after registration
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
