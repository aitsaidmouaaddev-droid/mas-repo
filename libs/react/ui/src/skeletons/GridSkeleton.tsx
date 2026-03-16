import Skeleton from '../skeleton/Skeleton';

export default function GridSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 16 }}>
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" width="100%" height={120} />
      ))}
    </div>
  );
}