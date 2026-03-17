import Skeleton from '../skeleton/Skeleton';

export default function ModalSkeleton() {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 'var(--radius-lg, 20px)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        width: 400,
      }}
    >
      <Skeleton variant="text" width="50%" height={24} style={{ marginBottom: 16 }} />
      <Skeleton variant="text" width="100%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton variant="text" width="90%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton variant="text" width="80%" height={16} style={{ marginBottom: 24 }} />
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}
