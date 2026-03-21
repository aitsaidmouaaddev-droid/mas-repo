import { Typography, Stack, Button, Badge } from '@mas/react-ui';
import { FiArrowLeft, FiXCircle } from 'react-icons/fi';
import styles from './QcmSessionHeader.module.scss';

interface QcmSessionHeaderProps {
  questionNum: number;
  total: number;
  remaining: number;
  isResumed: boolean;
  abandonPending: boolean;
  onBack: () => void;
  onAbandon: () => void;
  onAbandonCancel: () => void;
  onAbandonConfirm: () => void;
}

export function QcmSessionHeader({
  questionNum,
  total,
  remaining,
  isResumed,
  abandonPending,
  onBack,
  onAbandon,
  onAbandonCancel,
  onAbandonConfirm,
}: QcmSessionHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <Button variant="ghost" label="Back to modules" startIcon={FiArrowLeft} onClick={onBack} />
      <Stack direction="horizontal" gap={8} align="center">
        {isResumed && <Badge label="Resumed" variant="warning" />}
        <Typography variant="caption" className={styles.questionCounter}>
          Question {questionNum} / {total} · {remaining} remaining
        </Typography>
        {abandonPending ? (
          <div className={styles.abandonConfirmRow}>
            <Typography variant="caption" className={styles.abandonConfirm}>Abandon session?</Typography>
            <Button variant="danger" size="sm" label="Yes, abandon" onClick={onAbandonConfirm} />
            <Button variant="ghost" size="sm" label="Cancel" onClick={onAbandonCancel} />
          </div>
        ) : (
          <Button
            variant="danger"
            size="sm"
            label="Abandon"
            startIcon={FiXCircle}
            onClick={onAbandon}
          />
        )}
      </Stack>
    </div>
  );
}
