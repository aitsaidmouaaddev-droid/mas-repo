import { useMemo } from 'react';
import type { ComponentType } from 'react';
import { FiUser, FiFileText, FiBookOpen, FiBriefcase, FiArrowLeft } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useNavigate } from '@mas/react-router';
import { useT } from '@mas/shared/i18n';
import { ScrollSpyNav, LocalePicker, Container, Button } from '@mas/react-ui';
import AboutSection from '../components/landing/AboutSection';
import SkillsSection from '../components/landing/SkillsSection';
import ExperienceSection from '../components/landing/ExperienceSection';
import EducationSection from '../components/landing/EducationSection';
import styles from './AboutPage.module.scss';

interface SectionDef {
  id: string;
  labelKey: string;
  icon: IconType;
  component: ComponentType;
}

const SECTIONS: SectionDef[] = [
  { id: 'about', labelKey: 'landing.aboutHeading', icon: FiUser, component: AboutSection },
  { id: 'skills', labelKey: 'landing.skillsHeading', icon: FiFileText, component: SkillsSection },
  {
    id: 'experience',
    labelKey: 'landing.experience',
    icon: FiBriefcase,
    component: ExperienceSection,
  },
  { id: 'education', labelKey: 'landing.education', icon: FiBookOpen, component: EducationSection },
];

export function AboutPage() {
  const { t } = useT();
  const navigate = useNavigate();

  const spyItems = useMemo(
    () => SECTIONS.map((s) => ({ id: s.id, label: t(s.labelKey), icon: s.icon })),
    [t],
  );

  return (
    <div style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}>
      <title>{t('nav.about')} — Mouaad AIT SAID</title>
      <meta name="description" content={t('landing.aboutSubtitle')} />

      <div className={styles.topBar}>
        <Container>
          <Button
            variant="ghost"
            label={t('nav.back')}
            startIcon={FiArrowLeft}
            onClick={() => navigate('/')}
          />
        </Container>
      </div>

      <div className={styles.localePicker}>
        <LocalePicker display="flag-label" menuPosition="bottom" flagSize={18} />
      </div>

      <ScrollSpyNav items={spyItems} />

      {SECTIONS.map(({ id, component: Section }) => (
        <Section key={id} />
      ))}

      <footer className={styles.footer}>
        <Container>
          &copy; {new Date().getFullYear()} Mouaad AIT SAID. {t('landing.footerRights')}
        </Container>
      </footer>
    </div>
  );
}
