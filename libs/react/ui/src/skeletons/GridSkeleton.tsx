import Skeleton from '../skeleton/Skeleton';

export default function GridSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        padding: 16,
        width: '100%',
        maxWidth: 640,
        boxSizing: 'border-box',
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" width="100%" height={120} />
      ))}
    </div>
  );
}
