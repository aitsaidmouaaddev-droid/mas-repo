import { gql } from '@apollo/client';
import { createAuthClient, localStorageAdapter } from '@mas/front-auth';
import type { Identity } from '@mas/react-fundamentals-sot';

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
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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

export const authClient = createAuthClient<Identity>({
  uri: 'http://localhost:4311/graphql',
  storage: localStorageAdapter,
  mutations: {
    login: { document: LOGIN, extract: (d: any) => (d as any).login },
    register: { document: REGISTER, extract: (d: any) => (d as any).register },
    logout: { document: LOGOUT, extract: (d: any) => (d as any).logout },
  },
});
