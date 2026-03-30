/**
 * Games page — lists available games.
 */
import { useNavigate } from '@mas/react-router';
import { Typography, Container, Card, Button, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { FiPlay } from 'react-icons/fi';
import styles from './GamesPage.module.scss';

export function GamesPage() {
  const { t } = useT();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Typography variant="title">{t('games.title')}</Typography>
        <div className={styles.grid}>
          <Card className={styles.gameCard}>
            <Stack direction="vertical" gap={12}>
              <Typography variant="label">{t('games.snake.title')}</Typography>
              <Typography variant="caption">{t('games.snake.desc')}</Typography>
              <Button
                variant="primary"
                size="sm"
                startIcon={FiPlay}
                label={t('games.snake.start')}
                onClick={() => navigate('/games/snake')}
              />
            </Stack>
          </Card>
        </div>
      </Container>
    </div>
  );
}
