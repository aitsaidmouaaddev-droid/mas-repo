import Skeleton from '../skeleton/Skeleton';

export default function AccordionSkeleton() {
  return (
    <div style={{ width: '100%', maxWidth: 480, padding: 8, boxSizing: 'border-box' }}>
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width="100%"
          height={32}
          style={{ marginBottom: 12 }}
        />
      ))}
    </div>
  );
}
