/**
 * Passthrough layout for the `/qcm` section.
 * Child routes are fully specified in routes.ts — this component just
 * renders the matched child via {@link Outlet}.
 */
import { Outlet } from '@mas/react-router';

export function QcmLayout() {
  return <Outlet />;
}
