/**
 * Root layout rendered for every route.
 *
 * - Shows a breadcrumb nav bar on any page deeper than Home.
 * - Renders {@link Home} directly at `/` (no nested outlet needed).
 * - Renders `<Outlet />` for all other routes so children can paint themselves.
 */
import { Outlet, useNavigate, useBreadcrumbs, useLocation } from '@mas/react-router';
import { Breadcrumb, Container } from '@mas/react-ui';
import { Home } from './home/home';
import styles from './AppLayout.module.scss';

export function AppLayout() {
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className={styles.layout}>
      {!isHome && crumbs.length > 1 && (
        <div className={styles.breadcrumbBar}>
          <Container maxWidth="lg">
            <Breadcrumb
              items={crumbs.map((c) => ({
                label: c.label,
                href: c.active ? undefined : c.path,
                onClick: c.active ? undefined : () => navigate(c.path),
              }))}
            />
          </Container>
        </div>
      )}

      <div className={styles.content}>{isHome ? <Home /> : <Outlet />}</div>
    </div>
  );
}
