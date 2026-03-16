import Skeleton from '../skeleton/Skeleton';

export default function BadgeSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width={56}
      height={24}
      style={{ borderRadius: 12, border: '1px solid #e2e8f0', background: 'rgba(226,232,240,0.5)' }}
    />
  );
}
