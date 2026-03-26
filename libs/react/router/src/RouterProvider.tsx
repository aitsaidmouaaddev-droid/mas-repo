/**
 * @module RouterProvider
 * @description Root provider for `@mas/react-router`.
 *
 * Responsibilities:
 * - Listens to `popstate` (browser back/forward) and dispatches {@link pop}.
 * - On every location change, runs {@link matchTree} and evaluates guards.
 * - Dispatches {@link setMatchedTree} when navigation resolves.
 * - Sets `document.title` from `meta.title` when available.
 * - Passes routes + depth-0 context to children via {@link RouterContext}.
 *
 * @example
 * ```tsx
 * import { Provider } from 'react-redux';
 * import { RouterProvider, routerReducer } from '@mas/react-router';
 * import { createAppStore } from '@mas/shared/store';
 *
 * const store = createAppStore({ router: routerReducer });
 *
 * const routes = [
 *   { path: '/', component: Home },
 *   { path: '/users/:id', component: UserDetail },
 * ];
 *
 * function App() {
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
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RouterContext } from './RouterContext';
import { matchTree } from './matcher';
import {
  replace,
  pop,
  setMatchedTree,
  setError,
  selectRouterStatus,
  selectMatchedTree,
} from './router.slice';
import type { RouterProviderProps, RouteMatch, RootWithRouter } from './types';

export function RouterProvider({
  routes,
  store,
  fallback,
  notFound: NotFound,
  children,
}: RouterProviderProps) {
  const resolving = useRef(false);
  const pendingPathname = useRef<string | null>(null);

  /** Run match + guards for a given pathname, then update the store. */
  async function navigate(pathname: string): Promise<void> {
    if (resolving.current) {
      pendingPathname.current = pathname;
      return;
    }
    resolving.current = true;

    try {
      const tree = matchTree(routes, pathname);

      if (!tree) {
        store.dispatch(setError(`No route matched: ${pathname}`));
        return;
      }

      // Evaluate guards sequentially
      for (const match of tree) {
        const guard = match.route.guard;
        if (!guard) continue;

        let allowed: boolean;
        try {
          allowed = await guard.canActivate(match);
        } catch {
          allowed = false;
        }

        if (!allowed) {
          const redirectTo = guard.redirectTo ?? '/';
          store.dispatch(replace({ pathname: redirectTo }));
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', redirectTo);
          }
          resolving.current = false;
          await navigate(redirectTo);
          return;
        }
      }

      // Set document title from the deepest matched route with a title
      const titleMatch = [...tree].reverse().find((m) => m.route.meta?.title);
      if (titleMatch?.route.meta?.title && typeof document !== 'undefined') {
        document.title = titleMatch.route.meta.title;
      }

      store.dispatch(setMatchedTree(tree as RouteMatch[]));
    } finally {
      resolving.current = false;

      // Process any navigation that arrived while we were resolving
      const queued = pendingPathname.current;
      if (queued !== null) {
        pendingPathname.current = null;
        await navigate(queued);
      }
    }
  }

  // Initial navigation
  useEffect(() => {
    const { pathname } = store.getState().router.location;
    navigate(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to location changes dispatched by push/replace/pop
  useEffect(() => {
    let lastPathname = store.getState().router.location.pathname;

    const unsubscribe = (
      store as unknown as { subscribe: (cb: () => void) => () => void }
    ).subscribe(() => {
      const { location, status } = store.getState().router;
      if (location.pathname !== lastPathname && status === 'loading') {
        lastPathname = location.pathname;

        // Sync browser URL
        if (typeof window !== 'undefined') {
          const current = window.location.pathname + window.location.search + window.location.hash;
          const next = location.pathname + location.search + location.hash;
          if (current !== next) {
            window.history.pushState(location.state, '', next);
          }
        }

        navigate(location.pathname);
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browser back/forward
  useEffect(() => {
    if (typeof window === 'undefined') return;

    function onPopState(event: PopStateEvent) {
      store.dispatch(
        pop({
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          state: event.state,
        }),
      );
      navigate(window.location.pathname);
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = useSelector((s: RootWithRouter) => selectRouterStatus(s));
  const matchedTree = useSelector((s: RootWithRouter) => selectMatchedTree(s));

  // Show fallback only on initial load (no previous content to keep visible)
  if (status === 'idle') return <>{fallback ?? null}</>;
  if (status === 'error' && matchedTree.length === 0) {
    return NotFound ? <NotFound /> : null;
  }
  // During 'loading' keep rendering previous matchedTree to avoid blank flashes

  return <RouterContext.Provider value={{ depth: 0, routes }}>{children}</RouterContext.Provider>;
}
