import { Avatar, Badge, Button, Divider, Link, Stack } from '@mas/react-ui';
import type { AuthIdentity } from '../interfaces';
import styles from './profile.module.scss';

/**
 * Props for {@link ProfileCard}.
 */
export interface ProfileCardProps<TIdentity extends AuthIdentity = AuthIdentity> {
  /** The currently authenticated user's identity. */
  identity: TIdentity;
  /** Called when the user clicks "Edit profile". */
  onEditClick?: () => void;
  /** Called when the user clicks "Change password". */
  onChangePasswordClick?: () => void;
  /** Called when the user clicks "Sign out". */
  onLogout?: () => void;
  /** When `true`, action buttons are disabled (e.g. while a logout request is in progress). */
  isLoading?: boolean;
}

/**
 * Read-only profile view for an authenticated user.
 *
 * Shows the user's avatar (or generated initials), display name, email,
 * username handle, and a set of action buttons (edit, change password, logout).
 *
 * @example
 * ```tsx
 * const { identity } = authClient.useAuth();
 *
 * <ProfileCard
 *   identity={identity}
 *   onEditClick={() => setMode('editProfile')}
 *   onChangePasswordClick={() => setMode('changePassword')}
 *   onLogout={() => auth.logout()}
 * />
 * ```
 */
export function ProfileCard<TIdentity extends AuthIdentity = AuthIdentity>({
  identity,
  onEditClick,
  onChangePasswordClick,
  onLogout,
  isLoading = false,
}: ProfileCardProps<TIdentity>) {
  const fullName =
    identity.firstName && identity.lastName
      ? `${identity.firstName} ${identity.lastName}`
      : (identity.firstName ?? identity.lastName ?? null);

  const name =
    fullName ?? identity.displayName ?? identity.identityName ?? identity.email ?? 'User';

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={styles.card}>
      {/* Avatar */}
      <div className={styles.avatarWrap}>
        <Avatar src={identity.avatarUrl ?? undefined} alt={name} initials={initials} size="lg" />
      </div>

      <Stack direction="vertical" gap={4}>
        <p className={styles.displayName}>{name}</p>

        {identity.identityName && <p className={styles.handle}>@{identity.identityName}</p>}

        {identity.email && <p className={styles.email}>{identity.email}</p>}
      </Stack>

      {/* Badges row */}
      <div className={styles.metaRow} style={{ marginTop: 'var(--spacing-sm)' }}>
        <Badge label="Active" variant="success" dot />
        {identity.identityName && <Badge label="Member" variant="primary" />}
      </div>

      <div className={styles.divider}>
        <Divider />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {onEditClick && (
          <Button
            label="Edit profile"
            variant="secondary"
            size="md"
            disabled={isLoading}
            style={{ width: '100%' }}
            onClick={onEditClick}
          />
        )}
        {onChangePasswordClick && (
          <Button
            label="Change password"
            variant="ghost"
            size="md"
            disabled={isLoading}
            style={{ width: '100%' }}
            onClick={onChangePasswordClick}
          />
        )}
      </div>

      {onLogout && (
        <div className={styles.logoutRow}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading) onLogout();
            }}
            style={{ fontSize: 'var(--font-caption)', color: 'var(--color-error)' }}
          >
            Sign out
          </Link>
        </div>
      )}
    </div>
  );
}
