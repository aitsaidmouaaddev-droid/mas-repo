/**
 * @module Outlet
 * @description Renders the matched component at the current nesting depth.
 *
 * Place `<Outlet />` inside a layout component to render its matched child.
 * Each nested `<Outlet />` automatically increments the depth counter so the
 * correct level of {@link RouterState.matchedTree} is rendered.
 *
 * @example layout with nested outlet
 * ```tsx
 * function DashboardLayout() {
 *   return (
 *     <div>
 *       <Sidebar />
 *       <main>
 *         <Outlet /> {/* renders /dashboard/settings, /dashboard/profile, etc. *\/}
 *       </main>
 *     </div>
 *   );
 * }
 * ```
 */
import { useSelector } from 'react-redux';
import { RouterContext, useRouterContext } from './RouterContext';
import { selectMatchedTree } from './router.slice';
import type { RootWithRouter } from './types';

export function Outlet() {
  const { depth, routes } = useRouterContext();
  const matchedTree = useSelector((state: RootWithRouter) => selectMatchedTree(state));

  const match = matchedTree[depth];
  if (!match) return null;

  const Component = match.route.component;

  return (
    <RouterContext.Provider value={{ depth: depth + 1, routes }}>
      <Component />
    </RouterContext.Provider>
  );
}
