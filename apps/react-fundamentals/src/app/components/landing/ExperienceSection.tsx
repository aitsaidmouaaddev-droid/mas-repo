import { useMemo } from 'react';
import { useT } from '@mas/shared/i18n';
import { Container, Timeline } from '@mas/react-ui';
import type { TimelineItem } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './ResumeSection.module.scss';

export default function ExperienceSection() {
  const { t } = useT();

  const experience = useMemo<TimelineItem[]>(
    () => [
      {
        title: t('landing.expBreathTitle'),
        subtitle: t('landing.expBreathDate'),
        location: t('landing.expBreathLoc'),
        description: t('landing.expBreathDesc'),
        bullets: [
          t('landing.expBreathB1'),
          t('landing.expBreathB2'),
          t('landing.expBreathB3'),
          t('landing.expBreathB4'),
        ],
      },
      {
        title: t('landing.expVerifiTitle'),
        subtitle: t('landing.expVerifiDate'),
        location: t('landing.expVerifiLoc'),
        description: t('landing.expVerifiDesc'),
        bullets: [
          t('landing.expVerifiB1'),
          t('landing.expVerifiB2'),
          t('landing.expVerifiB3'),
          t('landing.expVerifiB4'),
          t('landing.expVerifiB5'),
        ],
      },
      {
        title: t('landing.expPointrdTitle'),
        subtitle: t('landing.expPointrdDate'),
        location: t('landing.expPointrdLoc'),
        description: t('landing.expPointrdDesc'),
        subItems: [
          {
            title: t('landing.expMissionAfpTitle'),
            subtitle: t('landing.expMissionAfpDate'),
            description: t('landing.expMissionAfpDesc'),
            bullets: [
              t('landing.expMissionAfpB1'),
              t('landing.expMissionAfpB2'),
              t('landing.expMissionAfpB3'),
              t('landing.expMissionAfpB4'),
            ],
          },
          {
            title: t('landing.expMissionTooshareTitle'),
            subtitle: t('landing.expMissionTooshareDate'),
            description: t('landing.expMissionTooshareDesc'),
            bullets: [
              t('landing.expMissionTooshareB1'),
              t('landing.expMissionTooshareB2'),
              t('landing.expMissionTooshareB3'),
            ],
          },
          {
            title: t('landing.expMissionFujitsuTitle'),
            subtitle: t('landing.expMissionFujitsuDate'),
            description: t('landing.expMissionFujitsuDesc'),
            bullets: [t('landing.expMissionFujitsuB1'), t('landing.expMissionFujitsuB2')],
          },
          {
            title: t('landing.expMissionSodexoTitle'),
            subtitle: t('landing.expMissionSodexoDate'),
            description: t('landing.expMissionSodexoDesc'),
            bullets: [
              t('landing.expMissionSodexoB1'),
              t('landing.expMissionSodexoB2'),
              t('landing.expMissionSodexoB3'),
            ],
          },
        ],
      },
      {
        title: t('landing.expDocaposteTitle'),
        subtitle: t('landing.expDocaposteDate'),
        location: t('landing.expDocaposteLoc'),
        description: t('landing.expDocaposteDesc'),
        bullets: [t('landing.expDocaposteB1'), t('landing.expDocaposteB2')],
      },
      {
        title: t('landing.expTaillisTitle'),
        subtitle: t('landing.expTaillisDate'),
        location: t('landing.expTaillisLoc'),
        description: t('landing.expTaillisDesc'),
        bullets: [t('landing.expTaillisB1'), t('landing.expTaillisB2'), t('landing.expTaillisB3')],
      },
      {
        title: t('landing.expFyTitle'),
        subtitle: t('landing.expFyDate'),
        location: t('landing.expFyLoc'),
        description: t('landing.expFyDesc'),
        bullets: [t('landing.expFyB1'), t('landing.expFyB2'), t('landing.expFyB3')],
      },
    ],
    [t],
  );

  return (
    <section id="experience" className={shared.section}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.experience')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.experienceSubtitle')}</p>
        </div>
        <div className={styles.resumeCol}>
          <Timeline items={experience} animate />
        </div>
      </Container>
    </section>
  );
}
