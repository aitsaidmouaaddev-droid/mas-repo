/**
 * Profile page — view and edit the current user's identity.
 */
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ProfileCard, ProfileForm, ChangePasswordForm, AuthCard } from '@mas/front-auth';
import type { ProfileFormData } from '@mas/front-auth';
import { Container, Stack } from '@mas/react-ui';
import { useNavigate } from '@mas/react-router';
import { authClient } from '../auth/auth.client';
import type { AppIdentity } from '../auth/auth.client';
import { MY_USER } from '../../graphql/documents';
import styles from './ProfilePage.module.scss';

interface GqlUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  identity: {
    id: string;
    email?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
    identityName?: string | null;
  };
}

type Mode = 'view' | 'edit' | 'changePassword';

const UPDATE_USER = gql`
  mutation UpdateUserProfile($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      firstName
      lastName
      dateOfBirth
    }
  }
`;

const UPDATE_IDENTITY = gql`
  mutation UpdateIdentityProfile($input: UpdateIdentityInput!) {
    updateIdentity(input: $input) {
      id
      displayName
      avatarUrl
      identityName
    }
  }
`;

export function ProfilePage() {
  const auth = authClient.useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('view');
  const [error, setError] = useState<string | null>(null);

  const authIdentity = auth.identity as AppIdentity | null;

  const { data, loading: queryLoading } = useQuery<{ findOneUser: GqlUser | null }>(MY_USER, {
    variables: { id: authIdentity?.userId },
    skip: !authIdentity?.userId,
    fetchPolicy: 'network-only',
  });

  if (!authIdentity) return null;

  const me = authIdentity as AppIdentity;
  const u = data?.findOneUser;
  const identity: AppIdentity = {
    ...me,
    ...(u ? {
      userId: u.id,
      firstName: u.firstName ?? null,
      lastName: u.lastName ?? null,
      dateOfBirth: u.dateOfBirth ?? null,
      displayName: u.identity.displayName ?? me.displayName,
      avatarUrl: u.identity.avatarUrl ?? me.avatarUrl,
      identityName: u.identity.identityName ?? me.identityName,
      email: u.identity.email ?? me.email,
    } : {}),
  };

  const handleSave = async (data: ProfileFormData) => {
    setError(null);
    try {
      const mutations: Promise<unknown>[] = [
        authClient.apolloClient.mutate({
          mutation: UPDATE_IDENTITY,
          variables: {
            input: {
              id: identity.id,
              displayName: data.displayName || null,
              avatarUrl: data.avatarUrl || null,
              identityName: data.identityName || null,
            },
          },
        }),
      ];

      if (identity.userId) {
        mutations.push(
          authClient.apolloClient.mutate({
            mutation: UPDATE_USER,
            variables: {
              input: {
                id: identity.userId,
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : null,
              },
            },
          }),
        );
      }

      await Promise.all(mutations);
      auth.setAuthenticated(
        {
          ...identity,
          displayName: data.displayName || identity.displayName,
          avatarUrl: data.avatarUrl || identity.avatarUrl,
          identityName: data.identityName || identity.identityName,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : null,
        } as AppIdentity,
        { accessToken: auth.accessToken!, refreshToken: auth.refreshToken! },
      );
      setMode('view');
    } catch {
      setError('Failed to save profile. Please try again.');
    }
  };

  const handleChangePassword = async (_current: string, _next: string) => {
    setError(null);
    setMode('view');
  };

  return (
    <div className={styles.page}>
      <Container maxWidth="sm">
        <Stack direction="vertical" gap={0}>
          {mode === 'edit' && (
            <AuthCard title="Edit profile" subtitle="Update your information" icon="✎">
              <ProfileForm
                identity={identity}
                onSubmit={handleSave}
                isLoading={auth.isLoading}
                error={error}
                onCancel={() => setMode('view')}
              />
            </AuthCard>
          )}

          {mode === 'changePassword' && (
            <AuthCard title="Change password" subtitle="Choose a new strong password" icon="🔒">
              <ChangePasswordForm
                onSubmit={handleChangePassword}
                isLoading={auth.isLoading}
                error={error}
                onCancel={() => setMode('view')}
              />
            </AuthCard>
          )}

          {mode === 'view' && (
            <AuthCard title="My profile" icon="◉">
              <ProfileCard
                identity={identity}
                onEditClick={() => setMode('edit')}
                onChangePasswordClick={() => setMode('changePassword')}
                onLogout={async () => { await auth.logout(); navigate('/auth', { replace: true }); }}
                isLoading={auth.isLoading}
              />
            </AuthCard>
          )}
        </Stack>
      </Container>
    </div>
  );
}
