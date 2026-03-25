/**
 * Home / mode-selection screen.
 */
import { Button, Typography, Card, Container, Stack, Icon } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { FiBookOpen, FiTerminal } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import { useDispatch } from 'react-redux';
import { resetSession } from '@mas/shared/qcm';
import type { AppDispatch } from '../../store';
import styles from './HomePage.module.scss';

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useT();
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
              {t('app.title')}
            </Typography>
            <Typography variant="body" className={styles.subtitle}>
              {t('home.subtitle')}
            </Typography>
          </Stack>

          <div className={styles.cardsRow}>
            <Card className={styles.modeCard}>
              <div className={styles.modeCardContent}>
                <Icon type="vector" icon={FiBookOpen} size={36} className={styles.modeIcon} />
                <Typography variant="subtitle">{t('home.qcmMode')}</Typography>
                <Typography variant="caption" className={styles.modeDesc}>
                  {t('home.qcmDesc')}
                </Typography>
                <Button variant="primary" size="md" label={t('home.start')} onClick={startQcm} />
              </div>
            </Card>
            <Card className={styles.modeCard}>
              <div className={styles.modeCardContent}>
                <Icon type="vector" icon={FiTerminal} size={36} className={styles.modeIcon} />
                <Typography variant="subtitle">{t('home.tdtMode')}</Typography>
                <Typography variant="caption" className={styles.modeDesc}>
                  {t('home.tdtDesc')}
                </Typography>
                <Button variant="primary" size="md" label={t('home.start')} onClick={startTdt} />
              </div>
            </Card>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
