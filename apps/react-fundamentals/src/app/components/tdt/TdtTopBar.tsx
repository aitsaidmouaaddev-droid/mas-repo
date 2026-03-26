import { Button, Typography, Stack, Badge } from '@mas/react-ui';
import { FiArrowLeft, FiPlay, FiRotateCcw, FiCheck } from 'react-icons/fi';
import { useT } from '@mas/shared/i18n';
import type { TdtChallenge } from '@mas/react-fundamentals-sot';
import { difficultyVariant } from '../../utils';
import styles from './TdtTopBar.module.scss';

const categoryLabel: Record<string, string> = {
  'react-hooks': 'React & Hooks',
  architecture: 'Architecture',
};

interface TdtTopBarProps {
  challenge: TdtChallenge;
  running: boolean;
  submitting: boolean;
  allPassed: boolean;
  onBack: () => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
}

export function TdtTopBar({
  challenge,
  running,
  submitting,
  allPassed,
  onBack,
  onReset,
  onRun,
  onSubmit,
}: TdtTopBarProps) {
  const { t } = useT();
  const difficulty = challenge.difficulty as keyof typeof difficultyVariant;

  return (
    <div className={styles.topBar}>
      <Button variant="ghost" label={t('nav.back')} startIcon={FiArrowLeft} onClick={onBack} />

      <Stack direction="horizontal" gap={8} align="center">
        <Typography variant="subtitle" className={styles.challengeTitle}>
          {challenge.title}
        </Typography>
        <Badge
          label={categoryLabel[challenge.category] ?? challenge.category}
          variant="secondary"
        />
        <Badge label={challenge.difficulty} variant={difficultyVariant[difficulty] ?? 'primary'} />
      </Stack>

      <Stack direction="horizontal" gap={8}>
        {!allPassed && (
          <Button
            variant="ghost"
            size="sm"
            label={t('tdt.reset')}
            startIcon={FiRotateCcw}
            onClick={onReset}
          />
        )}
        {allPassed ? (
          <Button
            variant="primary"
            size="sm"
            label={submitting ? t('tdt.submitting') : t('tdt.submit')}
            startIcon={FiCheck}
            disabled={submitting}
            onClick={onSubmit}
          />
        ) : (
          <Button
            variant="primary"
            size="sm"
            label={running ? t('tdt.running') : t('tdt.runTests')}
            startIcon={FiPlay}
            disabled={running}
            onClick={onRun}
          />
        )}
      </Stack>
    </div>
  );
}
