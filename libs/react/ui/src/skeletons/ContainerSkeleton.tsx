import Skeleton from '../skeleton/Skeleton';

export default function ContainerSkeleton() {
  return (
    <div style={{ padding: 24, borderRadius: 8, background: '#fff', width: '100%' }}>
      <Skeleton variant="rectangular" width="100%" height={120} />
    </div>
  );
}