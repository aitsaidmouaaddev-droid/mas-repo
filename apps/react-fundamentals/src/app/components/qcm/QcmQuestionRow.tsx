import { Typography, Stack, Card, Badge, Tag } from '@mas/react-ui';
import { FiArrowRight } from 'react-icons/fi';
import { difficultyVariant } from '../../utils';
import styles from './QcmQuestionRow.module.scss';

interface QcmQuestionRowProps {
  index: number;
  question: string;
  difficulty: string;
  type: string;
  tags: string[];
  onClick: () => void;
}

export function QcmQuestionRow({ index, question, difficulty, type, tags, onClick }: QcmQuestionRowProps) {
  return (
    <Card className={styles.questionCard} onClick={onClick}>
      <Stack direction="horizontal" gap={12} align="center">
        <Typography variant="caption" className={styles.index}>{index}</Typography>
        <Typography variant="body" className={styles.questionText}>{question}</Typography>
        <Stack direction="horizontal" gap={6} className={styles.badges}>
          <Badge
            label={difficulty}
            variant={difficultyVariant[difficulty as keyof typeof difficultyVariant] ?? 'secondary'}
          />
          <Badge label={type === 'multi' ? 'Multi' : 'Single'} variant="secondary" />
          {tags.map((tag) => <Tag key={tag} label={tag} variant="info" />)}
        </Stack>
        <FiArrowRight size={16} className={styles.chevron} />
      </Stack>
    </Card>
  );
}
