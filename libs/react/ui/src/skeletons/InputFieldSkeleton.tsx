import Skeleton from '../skeleton/Skeleton';

export default function InputFieldSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column',minHeight: 50,width: 240}}>
      <Skeleton variant="text" width="40%" height={14} style={{ marginBottom: 6 }} />
      <Skeleton variant="rectangular" width="100%" height={32} />
    </div>
  );
}