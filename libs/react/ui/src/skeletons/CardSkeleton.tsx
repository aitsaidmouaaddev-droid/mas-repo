import Skeleton from '../skeleton/Skeleton';

export default function CardSkeleton() {
  return (
    <div style={{ padding: 16, borderRadius: 8, background: '#915353', width: 320 }}>
      <Skeleton variant="rectangular" width="100%" height={160} style={{ marginBottom: 16 }} />
      <Skeleton variant="text" width="60%" height={18} style={{ marginBottom: 8 }} />
      <Skeleton variant="text" width="90%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton variant="text" width="40%" height={12} />
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Skeleton variant="rectangular" width={64} height={32} />
        <Skeleton variant="rectangular" width={64} height={32} />
      </div>
    </div>
  );
}