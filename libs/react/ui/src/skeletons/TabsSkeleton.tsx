import Skeleton from '../skeleton/Skeleton';

export default function TabsSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 8 }}>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" width={72} height={28} style={{ borderRadius: 14 }} />
      ))}
    </div>
  );
}