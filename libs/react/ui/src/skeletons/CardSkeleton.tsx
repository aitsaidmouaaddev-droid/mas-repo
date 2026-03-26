import Skeleton from '../skeleton/Skeleton';

export default function CardSkeleton() {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 'var(--radius-lg, 20px)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* header row: index + tech tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width={24} height={14} />
        <Skeleton variant="rectangular" width={80} height={22} style={{ borderRadius: 999 }} />
      </div>
      {/* title */}
      <Skeleton variant="text" width="70%" height={20} />
      {/* description lines */}
      <Skeleton variant="text" width="100%" height={14} />
      <Skeleton variant="text" width="90%" height={14} />
      {/* spacer */}
      <div style={{ flex: 1 }} />
      {/* footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
        <Skeleton variant="text" width={80} height={14} />
        <Skeleton variant="rectangular" width={80} height={32} style={{ borderRadius: 'var(--radius-md, 8px)' }} />
      </div>
    </div>
  );
}
