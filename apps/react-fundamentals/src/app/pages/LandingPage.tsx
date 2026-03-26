import { useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
import {
  FiHome,
  FiUser,
  FiBarChart2,
  FiFileText,
  FiBookOpen,
  FiBriefcase,
  FiImage,
  FiLayers,
  FiMessageSquare,
  FiMail,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useT } from '@mas/shared/i18n';
import { ScrollSpyNav, LocalePicker, Container } from '@mas/react-ui';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import StatsSection from '../components/landing/StatsSection';
import SkillsSection from '../components/landing/SkillsSection';
import EducationSection from '../components/landing/EducationSection';
import ExperienceSection from '../components/landing/ExperienceSection';
import PortfolioSection from '../components/landing/PortfolioSection';
import ServicesSection from '../components/landing/ServicesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import ContactSection from '../components/landing/ContactSection';
import styles from './LandingPage.module.scss';

/* ─── Section visibility config ─────────────────────────── */
interface SectionDef {
  id: string;
  labelKey: string;
  icon: IconType;
  component: ComponentType;
  enabled: boolean;
}

const SECTIONS: SectionDef[] = [
  { id: 'hero', labelKey: 'nav.home', icon: FiHome, component: HeroSection, enabled: true },
  {
    id: 'about',
    labelKey: 'landing.aboutHeading',
    icon: FiUser,
    component: AboutSection,
    enabled: true,
  },
  {
    id: 'stats',
    labelKey: 'landing.statsHeading',
    icon: FiBarChart2,
    component: StatsSection,
    enabled: true,
  },
  {
    id: 'skills',
    labelKey: 'landing.skillsHeading',
    icon: FiFileText,
    component: SkillsSection,
    enabled: true,
  },
  {
    id: 'education',
    labelKey: 'landing.education',
    icon: FiBookOpen,
    component: EducationSection,
    enabled: true,
  },
  {
    id: 'experience',
    labelKey: 'landing.experience',
    icon: FiBriefcase,
    component: ExperienceSection,
    enabled: true,
  },
  {
    id: 'portfolio',
    labelKey: 'landing.portfolioHeading',
    icon: FiImage,
    component: PortfolioSection,
    enabled: false,
  },
  {
    id: 'services',
    labelKey: 'landing.servicesHeading',
    icon: FiLayers,
    component: ServicesSection,
    enabled: true,
  },
  {
    id: 'testimonials',
    labelKey: 'landing.testimonialsHeading',
    icon: FiMessageSquare,
    component: TestimonialsSection,
    enabled: false,
  },
  {
    id: 'contact',
    labelKey: 'landing.contactHeading',
    icon: FiMail,
    component: ContactSection,
    enabled: false,
  },
];

/* ─── SEO ───────────────────────────────────────────────── */
const META = {
  title: 'Mouaad AIT SAID — Ingénieur Full-Stack JS',
  description:
    'Portfolio & learning platform — React, Angular, NestJS, Node.js, GraphQL, TypeScript.',
  ogType: 'website',
};

export function LandingPage() {
  const { t } = useT();

  useEffect(() => {
    document.title = META.title;
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta('description', META.description);
    setMeta('og:title', META.title, 'property');
    setMeta('og:description', META.description, 'property');
    setMeta('og:type', META.ogType, 'property');
  }, []);

  const activeSections = useMemo(() => SECTIONS.filter((s) => s.enabled), []);

  const spyItems = useMemo(
    () => activeSections.map((s) => ({ id: s.id, label: t(s.labelKey), icon: s.icon })),
    [t, activeSections],
  );

  return (
    <div style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}>
      <div className={styles.localePicker}>
        <LocalePicker display="flag-label" menuPosition="bottom" flagSize={18} />
      </div>

      <ScrollSpyNav items={spyItems} />

      {activeSections.map(({ id, component: Section }) => (
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
