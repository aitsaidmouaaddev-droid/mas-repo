import Skeleton from '../skeleton/Skeleton';

export default function TableSkeleton() {
  return (
    <div style={{ width: '100%', padding: 16 }}>
      <Skeleton variant="text" width="100%" height={24} style={{ marginBottom: 12 }} />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} variant="text" width="100%" height={18} style={{ marginBottom: 8 }} />
      ))}
    </div>
  );
}