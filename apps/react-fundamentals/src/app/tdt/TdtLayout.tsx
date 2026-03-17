/**
 * Passthrough layout for the `/tdt` section.
 *
 * - At `/tdt` (no child matched): renders {@link TdtCatalogView}.
 * - At `/tdt/:id` (child matched): renders `<Outlet />` → {@link TdtChallengeRoute}.
 */
import { Outlet, useMatch } from '@mas/react-router';
import { TdtCatalogView } from './tdt-catalog-view';

export function TdtLayout() {
  const match = useMatch('/tdt/:id');
  if (!match) return <TdtCatalogView />;
  return <Outlet />;
}
