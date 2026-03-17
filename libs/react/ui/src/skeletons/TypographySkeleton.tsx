import Skeleton from '../skeleton/Skeleton';

export default function TypographySkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column',minHeight: 50,width: 240}}>
      <Skeleton variant="text" width="80%" height={16} style={{ marginBottom: 6 }} />
      <Skeleton variant="text" width="60%" height={12} />
    </div>
  );
}