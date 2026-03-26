import type { ReactNode } from 'react';
import { Divider, Typography } from '@mas/react-ui';
import styles from './auth-card.module.scss';

/**
 * Props for {@link AuthCard}.
 */
export interface AuthCardProps {
  /** Page title shown below the logo, e.g. "Welcome back". */
  title: string;
  /** Optional subtitle / tagline shown below the title. */
  subtitle?: string;
  /**
   * Emoji or short text rendered inside the brand icon box.
   * @default '✦'
   */
  icon?: string;
  /** Form or other content to render inside the card body. */
  children: ReactNode;
}

/**
 * Glassmorphism card used as the container for auth forms.
 *
 * Renders a brand icon, title, optional subtitle, a divider, then children.
 *
 * @example
 * ```tsx
 * <AuthCard title="Welcome back" subtitle="Sign in to continue">
 *   <LoginForm … />
 * </AuthCard>
 * ```
 */
export function AuthCard({ title, subtitle, icon = '✦', children }: AuthCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.logoWrap} aria-hidden="true">
          {icon}
        </div>
        <Typography variant="subtitle" align="center">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" align="center" style={{ color: 'var(--color-muted-text)' }}>
            {subtitle}
          </Typography>
        )}
      </div>
      <Divider className={styles.divider} />
      {children}
    </div>
  );
}
