import Skeleton from '../skeleton/Skeleton';

export default function HeaderSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="text" width={120} height={20} />
      <div style={{ flex: 1 }} />
      <Skeleton variant="rectangular" width={80} height={32} />
    </div>
  );
}