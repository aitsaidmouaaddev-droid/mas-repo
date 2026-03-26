import { Typography, Stack, Button, Badge } from '@mas/react-ui';
import { FiArrowLeft, FiXCircle } from 'react-icons/fi';
import { useT } from '@mas/shared/i18n';
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
  const { t } = useT();

  return (
    <div className={styles.pageHeader}>
      <Button variant="ghost" label={t('qcm.backToModules')} startIcon={FiArrowLeft} onClick={onBack} />
      <Stack direction="horizontal" gap={8} align="center">
        {isResumed && <Badge label={t('qcm.resumed')} variant="warning" />}
        <Typography variant="caption" className={styles.questionCounter}>
          {t('qcm.questionProgress', { num: questionNum, total, remaining })}
        </Typography>
        {abandonPending ? (
          <div className={styles.abandonConfirmRow}>
            <Typography variant="caption" className={styles.abandonConfirm}>{t('qcm.abandonSession')}</Typography>
            <Button variant="danger" size="sm" label={t('qcm.yesAbandon')} onClick={onAbandonConfirm} />
            <Button variant="ghost" size="sm" label={t('common.cancel')} onClick={onAbandonCancel} />
          </div>
        ) : (
          <Button
            variant="danger"
            size="sm"
            label={t('qcm.abandon')}
            startIcon={FiXCircle}
            onClick={onAbandon}
          />
        )}
      </Stack>
    </div>
  );
}
