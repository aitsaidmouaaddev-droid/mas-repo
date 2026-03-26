import React from 'react';
import { CardWithSkeleton } from '@mas/react-ui';
import styles from './StatCard.module.scss';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
  color?: string;
  loading?: boolean;
}

export function StatCard({ icon, value, label, sub, color, loading }: StatCardProps) {
  return (
    <CardWithSkeleton loading={loading} className={styles.statCard}>
      <div className={styles.statIcon} style={{ color: color ?? 'var(--color-primary)' }}>
        {icon}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </CardWithSkeleton>
  );
}
