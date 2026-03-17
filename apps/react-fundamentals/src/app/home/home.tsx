/**
 * Home / mode-selection screen.
 *
 * Fetches the list of enabled modes from the API on mount and renders a
 * card for each one. Shows {@link CardSkeleton} placeholders while loading.
 */
import { useEffect, useState } from 'react';
import { Button, Typography, Card, Container, Stack, Icon, CardSkeleton } from '@mas/react-ui';
import { FiCode, FiBookOpen } from 'react-icons/fi';
import { qcmRepository } from '../../api';
import styles from './home.module.scss';

interface HomeProps {
  onStartCode: () => void;
  onStartQcm: () => void;
}

export function Home({ onStartCode, onStartQcm }: HomeProps) {
  const [modes, setModes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    qcmRepository
      .getModes()
      .then(setModes)
      .catch(() => setModes(['code', 'qcm']))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <Stack direction="vertical" gap={40} align="center">
          <Stack direction="vertical" gap={4} align="center">
            <Typography variant="title" className={styles.heading}>
              React Fundamentals
            </Typography>
            <Typography variant="body" className={styles.subtitle}>
              Choose a mode to start learning.
            </Typography>
          </Stack>

          {loading ? (
            <Stack direction="horizontal" gap={20} wrap>
              <CardSkeleton />
              <CardSkeleton />
            </Stack>
          ) : (
            <Stack direction="horizontal" gap={20} wrap>
              {modes.includes('code') && (
                <Card className={styles.modeCard}>
                  <div className={styles.modeCardContent}>
                    <Icon type="vector" icon={FiCode} size={36} className={styles.modeIcon} />
                    <Typography variant="subtitle">Code Mode</Typography>
                    <Typography variant="caption" className={styles.modeDesc}>
                      Solve exercises and run tests
                    </Typography>
                    <Button variant="primary" size="md" label="Start" onClick={onStartCode} />
                  </div>
                </Card>
              )}
              {modes.includes('qcm') && (
                <Card className={styles.modeCard}>
                  <div className={styles.modeCardContent}>
                    <Icon type="vector" icon={FiBookOpen} size={36} className={styles.modeIcon} />
                    <Typography variant="subtitle">QCM Mode</Typography>
                    <Typography variant="caption" className={styles.modeDesc}>
                      Test your knowledge with quizzes
                    </Typography>
                    <Button variant="primary" size="md" label="Start" onClick={onStartQcm} />
                  </div>
                </Card>
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </div>
  );
}
