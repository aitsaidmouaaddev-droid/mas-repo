import { Avatar, Badge, Button, Divider, Link, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import type { AuthIdentity } from '../interfaces';
import styles from './profile.module.scss';

/**
 * Props for {@link ProfileCard}.
 */
export interface ProfileCardProps<TIdentity extends AuthIdentity = AuthIdentity> {
  identity: TIdentity;
  onEditClick?: () => void;
  onChangePasswordClick?: () => void;
  onLogout?: () => void;
  isLoading?: boolean;
}

export function ProfileCard<TIdentity extends AuthIdentity = AuthIdentity>({
  identity,
  onEditClick,
  onChangePasswordClick,
  onLogout,
  isLoading = false,
}: ProfileCardProps<TIdentity>) {
  const { t } = useT();

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
      <div className={styles.avatarWrap}>
        <Avatar src={identity.avatarUrl ?? undefined} alt={name} initials={initials} size="lg" />
      </div>

      <Stack direction="vertical" gap={4}>
        <p className={styles.displayName}>{name}</p>
        {identity.identityName && <p className={styles.handle}>@{identity.identityName}</p>}
        {identity.email && <p className={styles.email}>{identity.email}</p>}
      </Stack>

      <div className={styles.metaRow} style={{ marginTop: 'var(--spacing-sm)' }}>
        <Badge label={t('auth.active')} variant="success" dot />
        {identity.identityName && <Badge label={t('auth.member')} variant="primary" />}
      </div>

      <div className={styles.divider}>
        <Divider />
      </div>

      <div className={styles.actions}>
        {onEditClick && (
          <Button
            label={t('auth.editProfile')}
            variant="secondary"
            size="md"
            disabled={isLoading}
            style={{ width: '100%' }}
            onClick={onEditClick}
          />
        )}
        {onChangePasswordClick && (
          <Button
            label={t('auth.changePassword')}
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
            {t('auth.signOut')}
          </Link>
        </div>
      )}
    </div>
  );
}
