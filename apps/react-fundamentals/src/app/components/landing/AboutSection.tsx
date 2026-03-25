import { useMemo } from 'react';
import { useT } from '@mas/shared/i18n';
import { Container } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './AboutSection.module.scss';

export default function AboutSection() {
  const { t } = useT();

  const aboutInfo = useMemo(() => [
    { label: t('landing.aboutAge'), value: '32' },
    { label: t('landing.aboutCity'), value: 'Nangis (77370), Île-de-France' },
    { label: t('landing.aboutPhone'), value: '07 66 29 14 17' },
    { label: t('landing.aboutEmail'), value: 'aitsaidmouaad.dev@gmail.com' },
    { label: t('landing.aboutDegree'), value: t('landing.degreeEngineer') },
    { label: t('landing.aboutDriving'), value: t('landing.drivingLicenseB') },
    { label: t('landing.aboutFreelance'), value: t('landing.freelanceAvailable') },
    { label: t('landing.aboutLanguages'), value: t('landing.languagesList') },
  ], [t]);

  return (
    <section id="about" className={shared.section}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.aboutHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.aboutSubtitle')}</p>
        </div>

        <div className={styles.aboutGrid}>
          <img src="/assets/profile.jpg" alt="Mouaad AIT SAID" className={styles.aboutPhoto} />

          <div>
            <h3 className={styles.aboutRole}>{t('landing.aboutRole')}</h3>
            <div className={styles.aboutInfo}>
              {aboutInfo.map((item) => (
                <p key={item.label} className={styles.aboutItem}>
                  <strong>{item.label}:</strong> <span>{item.value}</span>
                </p>
              ))}
            </div>
            <p className={styles.aboutBio}>{t('landing.aboutBio')}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
