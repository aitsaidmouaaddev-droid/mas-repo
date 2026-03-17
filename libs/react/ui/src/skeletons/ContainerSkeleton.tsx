import Skeleton from '../skeleton/Skeleton';

export default function ContainerSkeleton() {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 'var(--radius-md, 12px)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        width: '100%',
        maxWidth: 600,
        boxSizing: 'border-box',
      }}
    >
      <Skeleton variant="rectangular" width="100%" height={120} />
    </div>
  );
}
