// trigger ci
/**
 * Root application component.
 *
 * Renders the depth-0 `<Outlet />` so `@mas/react-router` can paint the
 * matched route tree into the page.  The actual layout (breadcrumbs, home
 * guard) lives in {@link AppLayout}.
 */
import { Outlet } from '@mas/react-router';

export function App() {
  return <Outlet />;
}

export default App;
