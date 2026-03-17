/**
 * @packageDocumentation
 * @module @mas/react-router
 *
 * Lightweight Redux-backed React router for the MAS monorepo.
 *
 * ## Features
 * - Nested routes with `<Outlet />`
 * - Dynamic segments (`/users/:id`)
 * - Async navigation guards
 * - Breadcrumbs via `useBreadcrumbs()`
 * - URL search params with `useSearchParams()`
 * - Fully Redux-driven — register `routerReducer` in your store and go
 *
 * ## Quick start
 * ```tsx
 * import { Provider } from 'react-redux';
 * import { RouterProvider, Outlet, Link, routerReducer } from '@mas/react-router';
 * import { createAppStore } from '@mas/shared/store';
 *
 * const store = createAppStore({ router: routerReducer });
 *
 * const routes = [
 *   { path: '/', component: Home },
 *   { path: '/users/:id', component: UserDetail },
 * ];
 *
 * export function App() {
 *   return (
 *     <Provider store={store}>
 *       <RouterProvider routes={routes} store={store}>
 *         <Outlet />
 *       </RouterProvider>
 *     </Provider>
 *   );
 * }
 * ```
 */

// ── Redux slice ───────────────────────────────────────────────────────────────
export {
  routerReducer,
  routerSlice,
  push,
  replace,
  pop,
  setMatchedTree,
  setError,
  setIdle,
  selectRouter,
  selectLocation,
  selectPathname,
  selectMatchedTree,
  selectCurrentMatch,
  selectParams,
  selectRouterStatus,
  selectRouterError,
} from './router.slice';

// ── Components ────────────────────────────────────────────────────────────────
export { RouterProvider } from './RouterProvider';
export { Outlet } from './Outlet';
export { Link } from './Link';
export { Redirect } from './Redirect';

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { useNavigate } from './hooks/useNavigate';
export { useParams } from './hooks/useParams';
export { useLocation } from './hooks/useLocation';
export { useMatch } from './hooks/useMatch';
export { useSearchParams } from './hooks/useSearchParams';
export { useBreadcrumbs } from './hooks/useBreadcrumbs';

// ── Utilities ─────────────────────────────────────────────────────────────────
export { matchSegment, matchRoute, matchTree, resolvePath } from './matcher';

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  RouteConfig,
  RouteMeta,
  BreadcrumbConfig,
  RouteMatch,
  RouterLocation,
  RouterState,
  RootWithRouter,
  RouteGuard,
  NavigateOptions,
  RouterProviderProps,
  LinkProps,
  Breadcrumb,
} from './types';
