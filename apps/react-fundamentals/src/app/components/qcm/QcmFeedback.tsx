import { Alert, Typography, Stack } from '@mas/react-ui';
import { FiExternalLink } from 'react-icons/fi';
import type { AnswerFeedback } from '@mas/shared/qcm';
import styles from './QcmFeedback.module.scss';

interface QcmFeedbackProps {
  feedback: AnswerFeedback;
  isCorrect: boolean;
  docs?: string;
}

export function QcmFeedback({ feedback, isCorrect, docs }: QcmFeedbackProps) {
  return (
    <Alert variant={isCorrect ? 'success' : 'error'}>
      <Stack direction="vertical" gap={4}>
        <strong>{isCorrect ? 'Correct!' : 'Wrong'}</strong>
        {feedback.explanation && (
          <Typography variant="body">{feedback.explanation}</Typography>
        )}
        {docs && (
          <a
            href={docs}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsLink}
          >
            <FiExternalLink size={12} />
            Read the docs
          </a>
        )}
      </Stack>
    </Alert>
  );
}
