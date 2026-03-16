import Skeleton from '../skeleton/Skeleton';

export default function NavBarSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 16, padding: 8 }}>
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" width={64} height={32} style={{ borderRadius: 16 }} />
      ))}
    </div>
  );
}