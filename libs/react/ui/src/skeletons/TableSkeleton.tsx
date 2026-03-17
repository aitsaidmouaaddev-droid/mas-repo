import Skeleton from '../skeleton/Skeleton';

export default function TableSkeleton() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 640,
        padding: 16,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md, 12px)',
        boxSizing: 'border-box',
      }}
    >
      <Skeleton variant="text" width="100%" height={24} style={{ marginBottom: 12 }} />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} variant="text" width="100%" height={18} style={{ marginBottom: 8 }} />
      ))}
    </div>
  );
}
