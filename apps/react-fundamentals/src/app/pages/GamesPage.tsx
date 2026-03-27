/**
 * Games page — placeholder.
 */
import { Typography, Container } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import styles from './GamesPage.module.scss';

export function GamesPage() {
  const { t } = useT();

  return (
    <div className={styles.page}>
      <Container maxWidth="lg">
        <Typography variant="title">{t('games.title')}</Typography>
      </Container>
    </div>
  );
}
