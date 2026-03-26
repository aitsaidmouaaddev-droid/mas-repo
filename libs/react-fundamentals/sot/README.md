# `@mas/react-fundamentals-sot`

Auto-generated GraphQL type definitions for the `react-fundamentals` NestJS backend.

> **Do not edit the files in `src/` manually.** They are generated from the backend's GraphQL schema and will be overwritten on the next codegen run.

---

## What is this?

SOT (Source Of Truth) — this library exposes TypeScript types that exactly mirror the GraphQL schema served by the `react-fundamentals` backend (`apps/react-fundamentals/server/`).

It is consumed by frontend code (e.g. `@mas/front-auth`) to ensure full type safety between GraphQL queries and the React UI layer without duplicating type definitions.

---

## Contents

The generated file (`src/graphql.ts`) exports:

| Export                                        | Description                                          |
| --------------------------------------------- | ---------------------------------------------------- |
| `Identity`                                    | Authenticated user identity                          |
| `User`                                        | Application user linked to an identity               |
| `LoginInput` / `LoginResponse`                | Login mutation types                                 |
| `RegisterInput`                               | Registration mutation input                          |
| `CreateUserInput` / `UpdateUserInput`         | User management inputs                               |
| `CreateIdentityInput` / `UpdateIdentityInput` | Identity management inputs                           |
| `IdentityPage` / `IdentityCursorPage`         | Paginated identity results                           |
| `UserPage` / `UserCursorPage`                 | Paginated user results                               |
| `Query` / `Mutation`                          | Full query/mutation type maps                        |
| `Scalars`                                     | Scalar type mappings (`DateTime`, `ID`, `String`, …) |
| `Maybe<T>`, `InputMaybe<T>`, `Exact<T>`       | Utility types                                        |

---

## How to import

```ts
import type { Identity, LoginResponse, RegisterInput } from '@mas/react-fundamentals-sot';
```

The `@mas/react-fundamentals-sot` alias is defined in `tsconfig.base.json` and resolves to `libs/react-fundamentals/sot/src/index.ts`.

---

## How to regenerate

The codegen target is defined on the `react-fundamentals` app:

```bash
npx nx run react-fundamentals:codegen
```

This reads the backend's `schema.gql`, runs `@graphql-codegen/cli`, and overwrites `src/graphql.ts` in this library.

After regeneration, run typecheck to confirm no consumer is broken:

```bash
npx nx run react-fundamentals-sot:typecheck
```

---

## Relationship to the backend

```
apps/react-fundamentals/server/  (NestJS backend)
  └── schema.gql                 (GraphQL schema source of truth)
         │
         ▼  (codegen)
libs/react-fundamentals/sot/src/graphql.ts
         │
         ▼  (imports)
@mas/front-auth  /  apps/react-fundamentals/  (consumers)
```
