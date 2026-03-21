import { Button, Typography, Stack, Badge } from '@mas/react-ui';
import { FiArrowLeft, FiPlay, FiRotateCcw } from 'react-icons/fi';
import type { GqlTdtChallenge } from '../../pages/TdtListPage';
import { difficultyVariant } from '../../utils';
import styles from './TdtTopBar.module.scss';

const categoryLabel: Record<string, string> = {
  'react-hooks': 'React & Hooks',
  architecture: 'Architecture',
};

interface TdtTopBarProps {
  challenge: GqlTdtChallenge;
  running: boolean;
  onBack: () => void;
  onReset: () => void;
  onRun: () => void;
}

export function TdtTopBar({ challenge, running, onBack, onReset, onRun }: TdtTopBarProps) {
  const difficulty = challenge.difficulty as keyof typeof difficultyVariant;

  return (
    <div className={styles.topBar}>
      <Button variant="ghost" label="Back" startIcon={FiArrowLeft} onClick={onBack} />

      <Stack direction="horizontal" gap={8} align="center">
        <Typography variant="subtitle" className={styles.challengeTitle}>
          {challenge.title}
        </Typography>
        <Badge label={categoryLabel[challenge.category] ?? challenge.category} variant="secondary" />
        <Badge
          label={challenge.difficulty}
          variant={difficultyVariant[difficulty] ?? 'primary'}
        />
      </Stack>

      <Stack direction="horizontal" gap={8}>
        <Button
          variant="ghost"
          size="sm"
          label="Reset"
          startIcon={FiRotateCcw}
          onClick={onReset}
        />
        <Button
          variant="primary"
          size="sm"
          label={running ? 'Running…' : 'Run tests'}
          startIcon={FiPlay}
          disabled={running}
          onClick={onRun}
        />
      </Stack>
    </div>
  );
}
