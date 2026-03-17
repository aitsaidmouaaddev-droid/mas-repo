# @mas/react-router

Lightweight, Redux-backed React router for the MAS monorepo.

The router stores all navigation state in Redux — no hidden Context magic, no parallel state. Register `routerReducer` in your existing store, drop in `<RouterProvider>`, and every hook reads from the same store your app already uses.

---

## Features

| Feature          | Details                                                              |
| ---------------- | -------------------------------------------------------------------- |
| Nested routes    | `<Outlet />` renders the matched component at each depth level       |
| Dynamic segments | `/users/:id` → `useParams().id`                                      |
| Async guards     | `canActivate` can return a `Promise<boolean>`                        |
| Breadcrumbs      | `useBreadcrumbs()` walks the matched tree via `meta.breadcrumb`      |
| Search params    | `useSearchParams()` — typed read/write helpers                       |
| Redux-driven     | `routerReducer` plugs into `createAppStore` from `@mas/shared/store` |
| Zero extra deps  | Only `react-redux` and `@reduxjs/toolkit` (already in the monorepo)  |

---

## Quick start

```tsx
import { Provider } from 'react-redux';
import { RouterProvider, Outlet, Link, routerReducer } from '@mas/react-router';
import { createAppStore } from '@mas/shared/store';

const store = createAppStore({ router: routerReducer });

const routes = [
  { path: '/', component: Home },
  { path: '/users/:id', component: UserDetail },
  { path: '/about', component: About },
];

export function App() {
  return (
    <Provider store={store}>
      <RouterProvider routes={routes} store={store}>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <Outlet />
      </RouterProvider>
    </Provider>
  );
}
```

---

## Use cases

### 1. Basic navigation

```tsx
// Declarative
<Link to="/users/42">View user</Link>;

// Programmatic
function LogoutButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/login', { replace: true })}>Logout</button>;
}

// Browser history
navigate.back();
navigate.forward();
```

### 2. Dynamic params

```tsx
// Route: { path: '/users/:id', component: UserDetail }
function UserDetail() {
  const { id } = useParams();
  return <h1>User {id}</h1>;
}
```

### 3. Nested routes with Outlet

```tsx
const routes = [
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: 'settings', component: Settings },
      { path: 'profile', component: Profile },
    ],
  },
];

function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

### 4. Navigation guards (auth)

```tsx
const authGuard: RouteGuard = {
  canActivate: () => !!localStorage.getItem('token'),
  redirectTo: '/login',
};

// Async guard
const roleGuard: RouteGuard = {
  canActivate: async () => {
    const user = await fetchCurrentUser();
    return user.roles.includes('admin');
  },
  redirectTo: '/forbidden',
};
```

### 5. Breadcrumbs

```tsx
const routes = [
  {
    path: '/',
    component: Home,
    meta: { breadcrumb: { label: 'Home' } },
    children: [
      {
        path: 'users',
        component: UserList,
        meta: { breadcrumb: { label: 'Users' } },
        children: [
          {
            path: ':id',
            component: UserDetail,
            meta: { breadcrumb: { label: (p) => `User ${p.id}` } },
          },
        ],
      },
    ],
  },
];

function Breadcrumbs() {
  const crumbs = useBreadcrumbs();
  return (
    <nav>
      {crumbs.map((c) =>
        c.active ? (
          <span key={c.path}>{c.label}</span>
        ) : (
          <Link key={c.path} to={c.path}>
            {c.label}
          </Link>
        ),
      )}
    </nav>
  );
}
// /users/42 → Home / Users / User 42
```

### 6. Search params

```tsx
function ProductList() {
  const { params, set, delete: del } = useSearchParams();
  const sort = params.get('sort') ?? 'asc';
  return (
    <div>
      <button onClick={() => set('sort', 'desc')}>Sort desc</button>
      <button onClick={() => del('sort')}>Clear</button>
    </div>
  );
}
```

### 7. Declarative redirect

```tsx
function ProtectedPage() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (!isLoggedIn) return <Redirect to="/login" />;
  return <Dashboard />;
}
```

### 8. Active link styling

```tsx
<Link to="/dashboard" activeClassName="active" exact>
  Dashboard
</Link>
```

### 9. Test an arbitrary pattern

```tsx
function AdminBadge() {
  const match = useMatch('/admin/:section');
  if (!match) return null;
  return <span>Admin › {match.section}</span>;
}
```

---

## API reference

### Components

| Component          | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `<RouterProvider>` | Root provider. Mounts history listener, runs guards, stores match tree   |
| `<Outlet>`         | Renders the matched component at the current nesting depth               |
| `<Link>`           | Client-side anchor — dispatches push/replace, supports `activeClassName` |
| `<Redirect>`       | Renders nothing, dispatches replace on mount                             |

### Hooks

| Hook                | Returns                                               |
| ------------------- | ----------------------------------------------------- |
| `useNavigate()`     | `navigate(to, opts?)` + `.back()` + `.forward()`      |
| `useParams()`       | Merged params from all ancestor matches               |
| `useLocation()`     | `RouterLocation` — pathname, search, hash, state, key |
| `useMatch(pattern)` | Params map or `null`                                  |
| `useSearchParams()` | `{ params, set, delete, setAll }`                     |
| `useBreadcrumbs()`  | `Breadcrumb[]` resolved from `meta.breadcrumb`        |

### Redux

| Export                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `routerReducer`        | Register under `router` key via `createAppStore` |
| `push / replace / pop` | Navigation actions                               |
| `selectLocation`       | Current `RouterLocation`                         |
| `selectPathname`       | Pathname string                                  |
| `selectMatchedTree`    | Full ancestor match chain                        |
| `selectCurrentMatch`   | Leaf match                                       |
| `selectParams`         | Merged params across all ancestors               |
| `selectRouterStatus`   | `'idle' \| 'loading' \| 'ready' \| 'error'`      |

### Utilities

| Function                             | Description                                  |
| ------------------------------------ | -------------------------------------------- |
| `matchSegment(pattern, segment)`     | Match one path segment, extract params       |
| `matchRoute(route, pathname, base?)` | Match a route config against a full pathname |
| `matchTree(routes, pathname)`        | Walk route tree, return ancestor chain       |
| `resolvePath(pattern, params)`       | Substitute `:param` placeholders             |

---

## Tests

```bash
npx nx test @mas/react-router
```

## Typecheck

```bash
npx nx typecheck @mas/react-router
```
