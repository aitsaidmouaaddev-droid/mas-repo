/**
 * Passthrough layout for the `/tdt` section.
 */
import { Outlet, useMatch } from '@mas/react-router';
import { TdtListPage } from '../pages/TdtListPage';

export function TdtLayout() {
  const match = useMatch('/tdt/:id');
  if (!match) return <TdtListPage />;
  return <Outlet />;
}
