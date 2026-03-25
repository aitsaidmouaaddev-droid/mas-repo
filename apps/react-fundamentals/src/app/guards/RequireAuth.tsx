import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from '@mas/react-router';
import { TOKEN_KEYS } from '@mas/front-auth';

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? Date.now() / 1000 < payload.exp : true;
  } catch {
    return false;
  }
}

export function RequireAuth() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const authenticated = isTokenValid(localStorage.getItem(TOKEN_KEYS.ACCESS));

  useEffect(() => {
    if (!authenticated) {
      const intended = pathname + (search || '');
      navigate(`/auth?redirect=${encodeURIComponent(intended)}`, { replace: true });
    }
  }, [authenticated, pathname, search, navigate]);

  if (!authenticated) return null;

  return <Outlet />;
}
