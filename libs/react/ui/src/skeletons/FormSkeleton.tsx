import Skeleton from '../skeleton/Skeleton';

export default function FormSkeleton() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <Skeleton variant="text" width="40%" height={14} style={{ marginBottom: 6 }} />
          <Skeleton variant="rectangular" width="100%" height={32} />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}