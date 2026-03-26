import { useT } from '@mas/shared/i18n';
import { Container, ProgressBar } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './SkillsSection.module.scss';

const SKILLS = [
  { name: 'React / React Native (Expo)', pct: 90 },
  { name: 'Angular (19) / Ionic', pct: 85 },
  { name: 'TypeScript', pct: 92 },
  { name: 'Node.js / NestJS', pct: 88 },
  { name: 'GraphQL', pct: 80 },
  { name: 'Redux / NgXS / RxJS', pct: 82 },
  { name: 'Jest / Testing', pct: 85 },
  { name: 'CI/CD / DevOps (AWS, Azure, GitLab CI)', pct: 75 },
  { name: 'Nx Monorepo', pct: 80 },
  { name: 'Next.js', pct: 70 },
];

export default function SkillsSection() {
  const { t } = useT();

  return (
    <section id="skills" className={shared.section}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.skillsHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.skillsSubtitle')}</p>
        </div>

        <div className={styles.skillsGrid}>
          {SKILLS.map((skill) => (
            <div key={skill.name} className={styles.skillItem}>
              <div className={styles.skillHeader}>
                <span>{skill.name}</span>
                <span>{skill.pct}%</span>
              </div>
              <ProgressBar value={skill.pct / 100} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
