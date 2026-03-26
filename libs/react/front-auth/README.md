# `@mas/front-auth`

Reusable React authentication client factory for Apollo Client v4, JWT access tokens, and silent refresh. Ships as a thin factory — `createAuthClient<TIdentity>(config)` — that returns a pre-wired Apollo Client, a React Provider, and a `useAuth()` hook, all narrowed to your application-specific identity type.

---

## What problem does it solve?

Every React app talking to a GraphQL backend needs the same wiring:

1. Inject `Authorization: Bearer <token>` into every request
2. Intercept `UNAUTHENTICATED` errors, silently refresh the token pair, and retry the failed operation — without the user ever seeing a login prompt
3. Persist tokens across page reloads
4. Expose login/register/logout actions and current auth state to any component

`@mas/front-auth` packages all of this into a single `createAuthClient` call with zero boilerplate.

---

## Installation (monorepo)

The library is consumed via its `@mas/*` workspace alias — no `npm install` needed.

```ts
// tsconfig.base.json already maps:
"@mas/front-auth": ["libs/react/front-auth/src/index.ts"]
```

---

## Quick start

```tsx
import { gql } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
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
  uri: 'http://localhost:3000/graphql',
  storage: localStorageAdapter,
  mutations: {
    login: { document: LOGIN, extract: (d: any) => d.login },
    register: { document: REGISTER, extract: (d: any) => d.register },
    logout: { document: LOGOUT, extract: (d: any) => d.logout },
  },
});

// App root — Provider must wrap ApolloProvider:
export function Root() {
  return (
    <authClient.Provider>
      <ApolloProvider client={authClient.apolloClient}>
        <App />
      </ApolloProvider>
    </authClient.Provider>
  );
}
```

---

## `createAuthClient` API

```ts
function createAuthClient<TIdentity extends AuthIdentity>(
  config: AuthClientConfig<TIdentity>,
): AuthClient<TIdentity>;
```

### `AuthClientConfig<TIdentity>`

| Field       | Type                             | Description                                                        |
| ----------- | -------------------------------- | ------------------------------------------------------------------ |
| `uri`       | `string`                         | GraphQL endpoint URL, e.g. `http://localhost:3000/graphql`         |
| `storage`   | `IStorageAdapter`                | Token persistence backend. Use `localStorageAdapter` for browsers. |
| `mutations` | `AuthClientMutations<TIdentity>` | Login, register, and optional logout mutation configs.             |

### `AuthClientMutations<TIdentity>`

| Field      | Type                                                               | Required | Description                      |
| ---------- | ------------------------------------------------------------------ | -------- | -------------------------------- |
| `login`    | `MutationConfig<unknown, { identity: TIdentity } & AuthTokenPair>` | Yes      | Login mutation                   |
| `register` | `MutationConfig<unknown, { identity: TIdentity } & AuthTokenPair>` | Yes      | Register mutation                |
| `logout`   | `MutationConfig<unknown, unknown>`                                 | No       | Server-side session invalidation |

### `MutationConfig<TData, TResult>`

| Field      | Type                       | Description                                            |
| ---------- | -------------------------- | ------------------------------------------------------ |
| `document` | `DocumentNode`             | Compiled `gql` document                                |
| `extract`  | `(data: TData) => TResult` | Extracts the typed result from the raw Apollo response |

### Return value — `AuthClient<TIdentity>`

| Field          | Type                             | Description                                       |
| -------------- | -------------------------------- | ------------------------------------------------- |
| `apolloClient` | `ApolloClient`                   | Configured Apollo Client with the full link chain |
| `Provider`     | `FC<{ children: ReactNode }>`    | React Provider — must wrap your app               |
| `useAuth`      | `() => UseAuthReturn<TIdentity>` | Hook — auth state + actions                       |

---

## `useAuth()` hook

```tsx
function LoginForm() {
  const { login, isLoading, isAuthenticated, identity } = authClient.useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ login: 'alice@example.com', password: 'secret' });
  };

  if (isAuthenticated) {
    return <p>Welcome, {identity?.displayName}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isLoading}>
        Sign in
      </button>
    </form>
  );
}
```

### `UseAuthReturn<TIdentity>` fields

| Field                                | Type                | Description                        |
| ------------------------------------ | ------------------- | ---------------------------------- |
| `identity`                           | `TIdentity \| null` | Authenticated user, or `null`      |
| `accessToken`                        | `string \| null`    | Current JWT                        |
| `refreshToken`                       | `string \| null`    | Current refresh token              |
| `isAuthenticated`                    | `boolean`           | Whether the user is logged in      |
| `isLoading`                          | `boolean`           | In-flight auth operation indicator |
| `login(input)`                       | `Promise<...>`      | Login mutation                     |
| `register(input)`                    | `Promise<...>`      | Register mutation                  |
| `logout()`                           | `Promise<void>`     | Clear session                      |
| `setAuthenticated(identity, tokens)` | `void`              | Manually set auth state            |
| `clearAuth()`                        | `void`              | Manually clear auth state          |
| `refreshTokens(tokens)`              | `void`              | Update token pair in state         |
| `setLoading(bool)`                   | `void`              | Toggle loading flag                |

---

## `IStorageAdapter` — custom storage

To use a different storage backend (e.g. React Native's `AsyncStorage`), implement the interface:

```ts
export interface IStorageAdapter {
  get(key: string): string | null | Promise<string | null>;
  set(key: string, value: string): void | Promise<void>;
  remove(key: string): void | Promise<void>;
}
```

### React Native example

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IStorageAdapter } from '@mas/front-auth';

export const asyncStorageAdapter: IStorageAdapter = {
  get: (key) => AsyncStorage.getItem(key),
  set: (key, value) => AsyncStorage.setItem(key, value),
  remove: (key) => AsyncStorage.removeItem(key),
};
```

Pass `asyncStorageAdapter` as `storage` in `AuthClientConfig`.

Note: `createAuthClient` reads the access token synchronously when injecting the `Authorization` header (via the auth link). An async storage adapter is fully supported for persist/remove calls — the access token will be `null` on the first request if not yet resolved, but the refresh link will handle `UNAUTHENTICATED` errors transparently.

---

## Apollo link chain

The `apolloClient` is built with a three-link chain:

```
refreshLink  ──►  authLink  ──►  httpLink
```

| Link          | Role                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `refreshLink` | Intercepts `UNAUTHENTICATED` GraphQL errors, calls the refresh mutation, updates storage + state, retries the original operation |
| `authLink`    | Injects `Authorization: Bearer <token>` into every request header                                                                |
| `httpLink`    | Sends the HTTP request to the configured `uri`                                                                                   |

Placing `refreshLink` first ensures the retried request already carries the fresh token when `authLink` runs on the retry pass.

---

## Wiring with `@mas/react-fundamentals-sot`

`@mas/react-fundamentals-sot` provides auto-generated TypeScript types for the `react-fundamentals` NestJS backend. Use the `Identity` type as the `TIdentity` parameter:

```ts
import type { Identity } from '@mas/react-fundamentals-sot';
import { createAuthClient, localStorageAdapter } from '@mas/front-auth';

export const authClient = createAuthClient<Identity>({
  uri: import.meta.env.VITE_API_URL,
  storage: localStorageAdapter,
  mutations: { login, register, logout },
});
```

The `Identity` type satisfies `AuthIdentity` because it has an `id` field. All optional `AuthIdentity` fields (`email`, `displayName`, etc.) map directly to the generated type.

---

## Architecture

```
@mas/react-fundamentals-sot        (generated GraphQL types)
         │
         ▼
@mas/front-auth                    (auth client factory)
  ├── createAuthClient<TIdentity>
  ├── Apollo link chain  (refresh → auth → http)
  ├── AuthProvider       (React context + reducer)
  └── useAuth()          (state + actions)
         │
         ▼
   app/auth.client.ts             (configured instance)
         │
         ▼
   <Root>                         (Provider + ApolloProvider)
         │
         ▼
   <LoginForm> / <ProfileBadge>   (useAuth())
```

---

## Standalone use (without the factory)

The individual building blocks are also exported if you want to compose your own link chain:

```ts
import { createAuthLink } from '@mas/front-auth';
import { createRefreshLink } from '@mas/front-auth';
import { AuthProvider, useAuthContext } from '@mas/front-auth';
```

---

## UI components

`@mas/front-auth` also ships ready-made profile UI components built on top of `@mas/react-ui`.

### `ProfileCard`

Read-only profile view — avatar (with glow ring), name, handle, email, Active/Member badges, and action buttons.

```tsx
import { ProfileCard } from '@mas/front-auth';

<ProfileCard
  identity={auth.identity}
  onEditClick={() => setMode('editProfile')}
  onChangePasswordClick={() => setMode('changePassword')}
  onLogout={() => auth.logout()}
  isLoading={auth.isLoading}
/>;
```

### `ProfileForm`

Editable identity form — first/last name, date of birth (uses `DatePickerField`), avatar URL with live preview, display name, username. Email is shown as a read-only block (immutable after registration).

```tsx
import { ProfileForm, type ProfileFormData } from '@mas/front-auth';

<ProfileForm
  identity={auth.identity}
  onSubmit={async (data: ProfileFormData) => {
    await updateIdentity(data);
    setMode('profile');
  }}
  isLoading={isSaving}
  error={saveError}
  onCancel={() => setMode('profile')}
/>;
```

`ProfileFormData`:

```ts
interface ProfileFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  identityName: string;
  avatarUrl: string;
  dateOfBirth: Date | null; // email is intentionally absent — immutable
}
```

### `ChangePasswordForm`

Three-field form — current password, new password, confirm new password — with show/hide toggles and client-side validation (min 8 chars, match check).

```tsx
import { ChangePasswordForm } from '@mas/front-auth';

<ChangePasswordForm
  onSubmit={async (current, next) => {
    await changePassword(current, next);
    setMode('profile');
  }}
  isLoading={isSaving}
  error={serverError}
  onCancel={() => setMode('profile')}
/>;
```

### `AuthIdentity` extensions

The `AuthIdentity` interface was extended with profile fields:

```ts
interface AuthIdentity {
  id: string;
  email?: string | null;
  identityName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null; // ISO date string YYYY-MM-DD
}
```

### Google OAuth

The library integrates with the NestJS `OAuthModule` (backend). The frontend redirects to `/auth/oauth/google` and handles the callback parameters on return:

```ts
// Initiate Google login
window.location.href = `${API_URL}/auth/oauth/google`;

// On return to FRONTEND_URL/auth?accessToken=...&refreshToken=...&identityId=...
auth.setAuthenticated(identity, { accessToken, refreshToken });
```
