import { gql } from '@apollo/client';
import { createAuthClient, localStorageAdapter } from '@mas/front-auth';
import type { AuthIdentity } from '@mas/front-auth';

/** Extends AuthIdentity with the linked User record's id (needed for updateUser). */
export interface AppIdentity extends AuthIdentity {
  userId?: string | null;
}

/** Decode the `uid` claim from a JWT access token without any library. */
export function parseUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.uid ?? null;
  } catch {
    return null;
  }
}

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      identity {
        id
        email
        displayName
        avatarUrl
      }
    }
  }
`;

const REGISTER = gql`
  mutation Register($input: CreateUserInput!, $password: String!) {
    register(input: $input, password: $password) {
      accessToken
      refreshToken
      identity {
        id
        email
        displayName
        avatarUrl
      }
    }
  }
`;

const LOGOUT = gql`
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken)
  }
`;

const ME = gql`
  query Me($id: ID!) {
    findOneUser(id: $id, populate: ["identity"]) {
      id
      firstName
      lastName
      dateOfBirth
      identity {
        id
        email
        displayName
        avatarUrl
        identityName
      }
    }
  }
`;

export const authClient = createAuthClient<AppIdentity>({
  uri: `${import.meta.env.VITE_API_URL ?? 'http://localhost:4311'}/graphql`,
  storage: localStorageAdapter,
  mutations: {
    login: {
      document: LOGIN,
      extract: (d: any) => {
        const r = (d as any).login;
        return r;
      },
    },
    register: {
      document: REGISTER,
      extract: (d: any) => {
        const r = (d as any).register;
        return r;
      },
    },
    logout: { document: LOGOUT, extract: (d: any) => (d as any).logout },
  },
  me: {
    document: ME,
    variables: () => {
      const token = localStorage.getItem('auth.accessToken');
      return { id: token ? parseUserIdFromToken(token) : '' };
    },
    extract: (d: any): AppIdentity => {
      const u = (d as any).findOneUser;
      const i = u?.identity;
      return {
        id: i?.id,
        email: i?.email ?? null,
        displayName: i?.displayName ?? null,
        avatarUrl: i?.avatarUrl ?? null,
        identityName: i?.identityName ?? null,
        firstName: u?.firstName ?? null,
        lastName: u?.lastName ?? null,
        dateOfBirth: u?.dateOfBirth ?? null,
        userId: u?.id ?? null,
      };
    },
  },
});
