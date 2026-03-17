/**
 * @module useBreadcrumbs
 * @description Derive breadcrumb items from the current matched route tree.
 */
import { useSelector } from 'react-redux';
import { selectMatchedTree } from '../router.slice';
import type { Breadcrumb, RootWithRouter } from '../types';

/**
 * Returns an ordered array of {@link Breadcrumb} items from root to the
 * current route, derived from `meta.breadcrumb` on each matched route.
 *
 * Routes without `meta.breadcrumb` are skipped.
 *
 * @example route config
 * ```ts
 * const routes = [
 *   {
 *     path: '/',
 *     component: Home,
 *     meta: { breadcrumb: { label: 'Home' } },
 *     children: [
 *       {
 *         path: 'users',
 *         component: UserList,
 *         meta: { breadcrumb: { label: 'Users' } },
 *         children: [
 *           {
 *             path: ':id',
 *             component: UserDetail,
 *             meta: { breadcrumb: { label: (p) => `User ${p.id}` } },
 *           },
 *         ],
 *       },
 *     ],
 *   },
 * ];
 * ```
 *
 * @example component
 * ```tsx
 * function Breadcrumbs() {
 *   const crumbs = useBreadcrumbs();
 *   return (
 *     <nav>
 *       {crumbs.map((crumb) =>
 *         crumb.active
 *           ? <span key={crumb.path}>{crumb.label}</span>
 *           : <Link key={crumb.path} to={crumb.path}>{crumb.label}</Link>
 *       )}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useBreadcrumbs(): Breadcrumb[] {
  const matchedTree = useSelector((state: RootWithRouter) => selectMatchedTree(state));

  return matchedTree.reduce<Breadcrumb[]>((acc, match, index) => {
    const breadcrumb = match.route.meta?.breadcrumb;
    if (!breadcrumb) return acc;

    const label =
      typeof breadcrumb.label === 'function' ? breadcrumb.label(match.params) : breadcrumb.label;

    acc.push({
      label,
      path: match.pathname,
      active: index === matchedTree.length - 1,
      params: match.params,
    });

    return acc;
  }, []);
}
