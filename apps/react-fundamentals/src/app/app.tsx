// trigger ci
/**
 * Root application component — the single entry point for the React tree.
 *
 * ## Architecture
 *
 * The app is structured around three layers:
 *
 * 1. **Routing** (`@mas/react-router`)
 *    All route definitions live in `src/app/routes/`. The router renders a
 *    depth-0 `<Outlet />` here, delegating the full route tree to the matched
 *    child. This keeps `App` intentionally thin — no providers, no layout logic.
 *
 * 2. **Layout** (`AppLayout`)
 *    The actual shell (navbar, breadcrumbs, auth guard) wraps the outlet one
 *    level down. Separating layout from routing lets public pages (landing,
 *    auth) opt out of the shell without nested-route gymnastics.
 *
 * 3. **Data & State** (Redux + GraphQL)
 *    Global store is provided at `src/main.tsx`. Components fetch via
 *    Apollo hooks and dispatch to `@mas/rn-store` selectors. Side-effects
 *    (auth token refresh, socket reconnect) are handled in dedicated
 *    middleware, not in component lifecycle hooks.
 *
 * ## Adding a new page
 *
 * 1. Create `src/app/pages/YourPage.tsx`
 * 2. Add a route in `src/app/routes/` (or extend an existing route file)
 * 3. If the page needs auth, wrap with `<ProtectedRoute />` in the route config
 * 4. If the page needs a new GQL query, run `npm run codegen` after updating
 *    `graphql/schema.gql` and adding the query to `graphql/queries/`
 */
import { Outlet } from '@mas/react-router';

export function App() {
  return <Outlet />;
}

export default App;
