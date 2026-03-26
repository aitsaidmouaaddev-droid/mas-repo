import { useMemo } from 'react';
import { useT } from '@mas/shared/i18n';
import { Container, AnimatedCounter } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './StatsSection.module.scss';

export default function StatsSection() {
  const { t } = useT();

  const stats = useMemo(() => [
    { end: 6,  suffix: '+', label: t('landing.statsYearsExp') },
    { end: 10, suffix: '+', label: t('landing.statsProjects') },
    { end: 6,  suffix: '',  label: t('landing.statsCompanies') },
    { end: 3,  suffix: '',  label: t('landing.statsLanguages') },
  ], [t]);

  return (
    <section id="stats" className={shared.sectionAlt}>
      <Container>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <AnimatedCounter end={stat.end} suffix={stat.suffix} className={styles.statValue} />
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
