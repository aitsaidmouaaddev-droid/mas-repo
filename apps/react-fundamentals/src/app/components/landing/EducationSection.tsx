import { useMemo } from 'react';
import { useT } from '@mas/shared/i18n';
import { Container, Timeline } from '@mas/react-ui';
import type { TimelineItem } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './ResumeSection.module.scss';

export default function EducationSection() {
  const { t } = useT();

  const education = useMemo<TimelineItem[]>(
    () => [
      {
        title: t('landing.eduEngineer'),
        subtitle: '2012 – 2018',
        location: t('landing.eduEngineerLoc'),
        description: t('landing.eduEngineerDesc'),
        bullets: [
          t('landing.eduEngineerB1'),
          t('landing.eduEngineerB2'),
          t('landing.eduEngineerB3'),
        ],
      },
      {
        title: t('landing.eduBac'),
        subtitle: '2012',
        location: t('landing.eduBacLoc'),
        description: t('landing.eduBacDesc'),
      },
    ],
    [t],
  );

  return (
    <section id="education" className={shared.sectionAlt}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.education')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.educationSubtitle')}</p>
        </div>
        <div className={styles.resumeCol}>
          <Timeline items={education} />
        </div>
      </Container>
    </section>
  );
}
