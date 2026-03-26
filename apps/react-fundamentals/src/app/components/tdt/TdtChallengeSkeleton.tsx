import { Skeleton, CodeEditorWithSkeleton } from '@mas/react-ui';
import styles from './TdtChallengeSkeleton.module.scss';

/** Mirrors TdtTopBar layout while data loads */
function TdtTopBarSkeleton() {
  return (
    <div className={styles.topBar}>
      {/* Back button */}
      <Skeleton variant="rectangular" width={72} height={32} style={{ borderRadius: 6 }} />

      {/* Title + 2 badges */}
      <div className={styles.titleGroup}>
        <Skeleton variant="rectangular" width={180} height={20} style={{ borderRadius: 4 }} />
        <Skeleton variant="rectangular" width={90} height={22} style={{ borderRadius: 12 }} />
        <Skeleton variant="rectangular" width={56} height={22} style={{ borderRadius: 12 }} />
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        <Skeleton variant="rectangular" width={80} height={32} style={{ borderRadius: 6 }} />
        <Skeleton variant="rectangular" width={96} height={32} style={{ borderRadius: 6 }} />
      </div>
    </div>
  );
}

/** Mirrors TdtDescBar layout while data loads */
function TdtDescBarSkeleton() {
  return (
    <div className={styles.descBar}>
      <Skeleton variant="rectangular" width="60%" height={14} style={{ borderRadius: 4 }} />
    </div>
  );
}

/** Mirrors TdtSplitEditor layout — two editors side by side + right sidebar */
function TdtSplitEditorSkeleton() {
  return (
    <div className={styles.editors}>
      {/* Left panel: test code (read-only) */}
      <div className={styles.editorPanel}>
        <div className={styles.panelLabel}>
          <Skeleton variant="rectangular" width={120} height={12} style={{ borderRadius: 4 }} />
        </div>
        <div className={styles.editorWrapper}>
          <CodeEditorWithSkeleton loading code="" language="typescript" mode="view" />
        </div>
      </div>

      <div className={styles.divider} />

      {/* Right panel: implementation */}
      <div className={styles.editorPanel}>
        <div className={styles.panelLabel}>
          <Skeleton variant="rectangular" width={160} height={12} style={{ borderRadius: 4 }} />
        </div>
        <div className={styles.editorWrapper}>
          <CodeEditorWithSkeleton loading code="" language="typescript" mode="write" />
        </div>
      </div>

      {/* Results sidebar placeholder */}
      <div className={styles.sidebar}>
        <Skeleton variant="rectangular" width="100%" height="100%" style={{ borderRadius: 0 }} />
      </div>
    </div>
  );
}

/** Full-page skeleton for TdtChallengePage — shown while challenge data is loading */
export function TdtChallengeSkeleton() {
  return (
    <div className={styles.page}>
      <TdtTopBarSkeleton />
      <TdtDescBarSkeleton />
      <TdtSplitEditorSkeleton />
    </div>
  );
}
