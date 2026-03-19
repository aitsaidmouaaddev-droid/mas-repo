/**
 * Root layout rendered for every route.
 *
 * - Shows a breadcrumb nav bar on any page deeper than Home.
 * - Renders {@link Home} directly at `/` (no nested outlet needed).
 * - Renders `<Outlet />` for all other routes so children can paint themselves.
 */
import { Outlet, useNavigate, useBreadcrumbs, useLocation } from '@mas/react-router';
import { Breadcrumb, Container, FloatingMenuButton } from '@mas/react-ui';
import { FiUser, FiBarChart2, FiHome, FiMenu } from 'react-icons/fi';
import { Home } from './home/home';
import styles from './AppLayout.module.scss';

const FAB_ITEMS = [
  { name: 'home', label: 'Home', icon: FiHome },
  { name: 'profile', label: 'Profile', icon: FiUser },
  { name: 'summary', label: 'My Progress', icon: FiBarChart2 },
];

export function AppLayout() {
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const handleFabItem = (name: string) => {
    if (name === 'home') navigate('/');
    else if (name === 'profile') navigate('/profile');
    else if (name === 'summary') navigate('/summary');
  };

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

      <FloatingMenuButton items={FAB_ITEMS} onItemClick={handleFabItem} fabIcon={FiMenu} testId="app-fab" />
    </div>
  );
}
