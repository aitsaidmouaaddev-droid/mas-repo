import Skeleton from '../skeleton/Skeleton';

export default function SideBarSkeleton() {
  return (
    <div style={{ width: 220, padding: 16 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="text" width="70%" height={16} />
        </div>
      ))}
    </div>
  );
}