/**
 * @module types
 * @description Core type definitions for `@mas/react-router`.
 *
 * All interfaces are kept in one file so consumers can import types without
 * pulling in any React or Redux runtime code.
 */
import type React from 'react';

// ── Route definition ──────────────────────────────────────────────────────────

/**
 * A single entry in the route tree.
 *
 * @example
 * ```ts
 * const routes: RouteConfig[] = [
 *   {
 *     path: '/',
 *     component: Home,
 *     meta: { breadcrumb: { label: 'Home' } },
 *     children: [
 *       {
 *         path: 'users/:id',
 *         component: UserDetail,
 *         meta: { breadcrumb: { label: (p) => `User ${p.id}` } },
 *       },
 *     ],
 *   },
 * ];
 * ```
 */
export interface RouteConfig {
  /** Path pattern. Supports named segments (`:id`), wildcards (`*`). */
  path: string;
  /** Component rendered when this route is active. */
  component: React.ComponentType;
  /** Nested routes. Each child's path is relative to the parent's. */
  children?: RouteConfig[];
  /** Optional navigation guard evaluated before rendering. */
  guard?: RouteGuard;
  /** Arbitrary metadata — title, breadcrumb label, required roles, etc. */
  meta?: RouteMeta;
}

// ── Route meta ────────────────────────────────────────────────────────────────

/**
 * Arbitrary metadata attached to a route.
 * Extend this interface via declaration merging in your app.
 */
export interface RouteMeta {
  /** Page title — set as `document.title` by {@link RouterProvider}. */
  title?: string;
  /** Breadcrumb configuration consumed by {@link useBreadcrumbs}. */
  breadcrumb?: BreadcrumbConfig;
  /** Required roles for {@link RouteGuard} implementations. */
  roles?: string[];
  [key: string]: unknown;
}

/**
 * Breadcrumb config attached to {@link RouteMeta}.
 *
 * @example static label
 * ```ts
 * meta: { breadcrumb: { label: 'Users' } }
 * ```
 *
 * @example dynamic label
 * ```ts
 * meta: { breadcrumb: { label: (params) => `User ${params.id}` } }
 * ```
 */
export interface BreadcrumbConfig {
  /** Static string or function receiving the current route params. */
  label: string | ((params: Record<string, string>) => string);
}

// ── Match ─────────────────────────────────────────────────────────────────────

/**
 * Result of matching a URL against a {@link RouteConfig}.
 */
export interface RouteMatch {
  /** The matched route definition. */
  route: RouteConfig;
  /** Extracted dynamic segments, e.g. `{ id: '42' }` for `/users/:id`. */
  params: Record<string, string>;
  /** Resolved pathname for this segment (ancestor paths included). */
  pathname: string;
}

// ── Location ──────────────────────────────────────────────────────────────────

/**
 * Represents a point in browser history.
 */
export interface RouterLocation {
  /** Current URL path, e.g. `/users/42`. */
  pathname: string;
  /** Raw query string, e.g. `?sort=asc`. */
  search: string;
  /** URL hash, e.g. `#section`. */
  hash: string;
  /** Arbitrary state payload passed to `navigate()`. */
  state: unknown;
  /** Unique key generated per navigation event. */
  key: string;
}

// ── Router state (Redux) ──────────────────────────────────────────────────────

/**
 * Shape of the `router` slice in the Redux store.
 *
 * Consumers must merge {@link routerReducer} into their store under the `router` key:
 * ```ts
 * const store = createAppStore({ router: routerReducer, ...otherReducers });
 * ```
 */
export interface RouterState {
  /** Current browser location. */
  location: RouterLocation;
  /**
   * Full ancestor chain from root to the deepest matched route.
   * Used by {@link Outlet} for nested rendering and by {@link useBreadcrumbs}.
   */
  matchedTree: RouteMatch[];
  /** Lifecycle status of the current navigation. */
  status: 'idle' | 'loading' | 'ready' | 'error';
  /** Error message when `status === 'error'`. */
  error: string | null;
}

// ── Guards ────────────────────────────────────────────────────────────────────

/**
 * Navigation guard evaluated before a route is rendered.
 *
 * @example
 * ```ts
 * const authGuard: RouteGuard = {
 *   canActivate: (match) => !!localStorage.getItem('token'),
 *   redirectTo: '/login',
 * };
 * ```
 */
export interface RouteGuard {
  /**
   * Return `true` (or a resolved `true`) to allow navigation.
   * Return `false` to block — the router will navigate to `redirectTo` if set.
   */
  canActivate: (match: RouteMatch) => boolean | Promise<boolean>;
  /** Path to redirect to when the guard blocks navigation. Defaults to `'/'`. */
  redirectTo?: string;
}

// ── Navigation ────────────────────────────────────────────────────────────────

/** Options accepted by `navigate()`. */
export interface NavigateOptions {
  /** Use `history.replaceState` instead of `pushState`. */
  replace?: boolean;
  /** Arbitrary state forwarded to {@link RouterLocation.state}. */
  state?: unknown;
}

// ── Component props ───────────────────────────────────────────────────────────

/** Props for {@link RouterProvider}. */
export interface RouterProviderProps {
  /** Flat or nested route tree. */
  routes: RouteConfig[];
  /** Redux store that includes `routerReducer` under the `router` key. */
  store: { dispatch: (action: unknown) => unknown; getState: () => { router: RouterState } };
  /** Subtree rendered while async guards are resolving. */
  fallback?: React.ReactNode;
  /** Component rendered when no route matches. */
  notFound?: React.ComponentType;
  /** Children rendered inside the provider (typically your app shell). */
  children: React.ReactNode;
}

/** Props for the {@link Link} component. */
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Target path, e.g. `'/users/42'`. */
  to: string;
  /** Use `replaceState` instead of `pushState`. */
  replace?: boolean;
  /** State payload forwarded to the location. */
  state?: unknown;
  /** Class applied when `to` matches the current pathname. */
  activeClassName?: string;
  /** Require an exact match for `activeClassName`. @default false */
  exact?: boolean;
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

/** A resolved breadcrumb item returned by {@link useBreadcrumbs}. */
export interface Breadcrumb {
  /** Display label (resolved from `meta.breadcrumb.label`). */
  label: string;
  /** Resolved path for this breadcrumb, e.g. `/users/42`. */
  path: string;
  /** `true` only for the last (current) breadcrumb. */
  active: boolean;
  /** Route params at this level, e.g. `{ id: '42' }`. */
  params: Record<string, string>;
}

// ── Root state helper ─────────────────────────────────────────────────────────

/**
 * Minimal root-state shape expected by all router selectors.
 * Merge into your app's `RootState` via intersection:
 * ```ts
 * type RootState = ReturnType<typeof store.getState> & RootWithRouter;
 * ```
 */
export interface RootWithRouter {
  router: RouterState;
}
