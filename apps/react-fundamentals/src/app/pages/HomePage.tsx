/**
 * Home / mode-selection screen.
 */
import { Button, Typography, Card, Container, Stack, Icon } from '@mas/react-ui';
import { FiBookOpen, FiTerminal } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import { useDispatch } from 'react-redux';
import { resetSession } from '@mas/shared/qcm';
import type { AppDispatch } from '../../store';
import styles from './HomePage.module.scss';

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const startQcm = () => {
    dispatch(resetSession());
    navigate('/qcm');
  };
  const startTdt = () => navigate('/tdt');

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

          <Stack direction="horizontal" gap={20} wrap>
            <Card className={styles.modeCard}>
              <div className={styles.modeCardContent}>
                <Icon type="vector" icon={FiBookOpen} size={36} className={styles.modeIcon} />
                <Typography variant="subtitle">QCM Mode</Typography>
                <Typography variant="caption" className={styles.modeDesc}>
                  Test your knowledge with quizzes
                </Typography>
                <Button variant="primary" size="md" label="Start" onClick={startQcm} />
              </div>
            </Card>
            <Card className={styles.modeCard}>
              <div className={styles.modeCardContent}>
                <Icon type="vector" icon={FiTerminal} size={36} className={styles.modeIcon} />
                <Typography variant="subtitle">TDT Mode</Typography>
                <Typography variant="caption" className={styles.modeDesc}>
                  Make failing tests pass
                </Typography>
                <Button variant="primary" size="md" label="Start" onClick={startTdt} />
              </div>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
