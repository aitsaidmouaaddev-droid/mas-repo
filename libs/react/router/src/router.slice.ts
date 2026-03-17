/**
 * @module router.slice
 * @description Redux slice for `@mas/react-router`.
 *
 * Consumers register this reducer under the `router` key using
 * `createAppStore` from `@mas/shared/store`:
 *
 * ```ts
 * import { createAppStore } from '@mas/shared/store';
 * import { routerReducer } from '@mas/react-router';
 *
 * const store = createAppStore({
 *   router: routerReducer,
 *   // ...your other reducers
 * });
 * ```
 *
 * All router selectors expect a root state that includes the `router` key
 * (see {@link RootWithRouter}).
 */
import { createSlice, type PayloadAction } from '@mas/shared/store';
import type { RouterState, RouterLocation, RouteMatch, RootWithRouter } from './types';

// ── Initial state ─────────────────────────────────────────────────────────────

function buildInitialLocation(): RouterLocation {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', hash: '', state: null, key: 'default' };
  }
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: null,
    key: 'initial',
  };
}

const initialState: RouterState = {
  location: buildInitialLocation(),
  matchedTree: [],
  status: 'idle',
  error: null,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeKey(): string {
  return Math.random().toString(36).slice(2, 8);
}

// ── Slice ─────────────────────────────────────────────────────────────────────

export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    /**
     * Push a new entry onto the browser history stack.
     * Dispatched by {@link RouterProvider} and the `navigate()` hook.
     */
    push(
      state,
      action: PayloadAction<{ pathname: string; search?: string; hash?: string; state?: unknown }>,
    ) {
      const { pathname, search = '', hash = '', state: locationState = null } = action.payload;
      state.location = { pathname, search, hash, state: locationState, key: makeKey() };
      state.status = 'loading';
      state.error = null;
    },

    /**
     * Replace the current history entry without adding a new one.
     * Used by {@link Redirect} and `navigate(to, { replace: true })`.
     */
    replace(
      state,
      action: PayloadAction<{ pathname: string; search?: string; hash?: string; state?: unknown }>,
    ) {
      const { pathname, search = '', hash = '', state: locationState = null } = action.payload;
      state.location = { pathname, search, hash, state: locationState, key: makeKey() };
      state.status = 'loading';
      state.error = null;
    },

    /**
     * Sync the Redux state with the browser after a `popstate` event
     * (back / forward button).
     */
    pop(
      state,
      action: PayloadAction<{ pathname: string; search: string; hash: string; state: unknown }>,
    ) {
      state.location = { ...action.payload, key: makeKey() };
      state.status = 'loading';
      state.error = null;
    },

    /**
     * Set the resolved match tree after the route has been matched
     * (and any async guards resolved).
     */
    setMatchedTree(state, action: PayloadAction<RouteMatch[]>) {
      state.matchedTree = action.payload;
      state.status = 'ready';
      state.error = null;
    },

    /** Mark navigation as failed (e.g. guard threw, no route found). */
    setError(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
      state.matchedTree = [];
    },

    /** Reset to idle — used internally between navigations. */
    setIdle(state) {
      state.status = 'idle';
    },
  },
});

export const { push, replace, pop, setMatchedTree, setError, setIdle } = routerSlice.actions;

/** The reducer to register under the `router` key in your store. */
export const routerReducer = routerSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Select the full {@link RouterState}. */
export const selectRouter = (state: RootWithRouter): RouterState => state.router;

/** Select the current {@link RouterLocation}. */
export const selectLocation = (state: RootWithRouter): RouterLocation => state.router.location;

/** Select the current pathname string. */
export const selectPathname = (state: RootWithRouter): string => state.router.location.pathname;

/** Select the full ancestor match chain (root → leaf). */
export const selectMatchedTree = (state: RootWithRouter): RouteMatch[] => state.router.matchedTree;

/** Select the deepest (leaf) matched route, or `null` if nothing matched. */
export const selectCurrentMatch = (state: RootWithRouter): RouteMatch | null =>
  state.router.matchedTree[state.router.matchedTree.length - 1] ?? null;

/** Select the merged params from all ancestor matches. */
export const selectParams = (state: RootWithRouter): Record<string, string> =>
  state.router.matchedTree.reduce(
    (acc, m) => ({ ...acc, ...m.params }),
    {} as Record<string, string>,
  );

/** Select the navigation status. */
export const selectRouterStatus = (state: RootWithRouter) => state.router.status;

/** Select the router error message, or `null`. */
export const selectRouterError = (state: RootWithRouter) => state.router.error;
