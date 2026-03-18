import type { ReactNode } from 'react';
import styles from './auth-page.module.scss';

/**
 * Props for {@link AuthPage}.
 */
export interface AuthPageProps {
  /** Auth card or other content to center on screen. */
  children: ReactNode;
}

/**
 * Full-viewport layout that centers auth content over a gradient background.
 *
 * Place an {@link AuthCard} containing a {@link LoginForm} or {@link RegisterForm}
 * as the direct child.
 *
 * @example
 * ```tsx
 * <AuthPage>
 *   <AuthCard title="Welcome back">
 *     <LoginForm onSubmit={handleLogin} isLoading={loading} error={error} />
 *   </AuthCard>
 * </AuthPage>
 * ```
 */
export function AuthPage({ children }: AuthPageProps) {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
