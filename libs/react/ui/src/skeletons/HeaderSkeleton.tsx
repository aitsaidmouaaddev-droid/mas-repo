import Skeleton from '../skeleton/Skeleton';

export default function HeaderSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        width: '100%',
        maxWidth: 640,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md, 12px)',
        boxSizing: 'border-box',
      }}
    >
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="text" width={120} height={20} />
      <div style={{ flex: 1 }} />
      <Skeleton variant="rectangular" width={80} height={32} />
    </div>
  );
}
