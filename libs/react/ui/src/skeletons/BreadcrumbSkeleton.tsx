import Skeleton from '../skeleton/Skeleton';

export default function BreadcrumbSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Skeleton variant="text" width={48} height={12} />
      <Skeleton variant="text" width={32} height={12} />
      <Skeleton variant="text" width={40} height={12} />
    </div>
  );
}