/**
 * @module RouterContext
 * @description Internal React context for `@mas/react-router`.
 *
 * Carries the current nesting depth so each {@link Outlet} knows which
 * level of {@link RouterState.matchedTree} to render.
 * Also exposes the route config array for hooks like {@link useMatch}.
 */
import { createContext, useContext } from 'react';
import type { RouteConfig } from './types';

export interface RouterContextValue {
  /** Current depth in the matched tree (0 = root outlet). */
  depth: number;
  /** Top-level route configuration array. */
  routes: RouteConfig[];
}

export const RouterContext = createContext<RouterContextValue>({
  depth: 0,
  routes: [],
});

/** Read the current router context. Throws if used outside {@link RouterProvider}. */
export function useRouterContext(): RouterContextValue {
  return useContext(RouterContext);
}
