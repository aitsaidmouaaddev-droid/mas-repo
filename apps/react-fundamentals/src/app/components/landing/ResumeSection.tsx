import { useT } from '@mas/shared/i18n';
import { Container, Timeline } from '@mas/react-ui';
import type { TimelineItem } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './ResumeSection.module.scss';

const EDUCATION: TimelineItem[] = [
  {
    title: 'Ingénieur d\'État en Génie Logiciels',
    subtitle: '2012 – 2018',
    location: 'ENSA Khouribga, Maroc',
  },
  {
    title: 'Baccalauréat S. Mathématiques',
    subtitle: '2012',
    location: 'Casablanca, Maroc',
  },
];

const EXPERIENCE: TimelineItem[] = [
  {
    title: 'Développeur React / NestJS',
    subtitle: 'Sept 2025 – Fév 2026',
    location: 'Breath, Paris',
    description: 'Conception et développement d\'un prototype de réseau social bien-être/santé : MVP, architecture, React (web), React Native (mobile), NestJS (API).',
  },
  {
    title: 'Ingénieur Fullstack NestJS – Angular',
    subtitle: 'Mars 2023 – Juil 2025',
    location: 'Saint-Gobain (Verifi), Paris',
    description: 'Plateforme IoT de suivi des opérations pour producteurs de béton. Back-office, scoping organisation/site, optimisation recherche/filtrage, cartographie temps réel.',
    bullets: ['Angular 19, Ionic, TypeScript, RxJS', 'NestJS, GraphQL, MS SQL Server', 'Design system Atomic Design + Storybook'],
  },
  {
    title: 'Ingénieur Front-End Angular',
    subtitle: 'Fév 2020 – Mars 2023',
    location: 'PointRD (ESN), Paris',
    description: 'Missions chez AFP, TooShare, Fujitsu/TotalEnergies, Sodexo.',
    bullets: [
      'AFP : plateforme BtoB dépêches/photos/vidéos, migration Angular 13, RTL/arabe',
      'TooShare : réseau social éducatif React, OAuth2, refactoring recherche/filtrage',
      'Sodexo : librairies Node/React, monorepos Lerna/JFrog, upgrade Node 10→12',
    ],
  },
  {
    title: 'Développeur Node.js',
    subtitle: 'Oct 2019 – Jan 2020',
    location: 'Docaposte, Casablanca',
    description: 'Application interne de digitalisation documentaire. Backend Node.js/TypeORM, frontend Vue.js.',
  },
  {
    title: 'Développeur FullStack',
    subtitle: 'Mars 2019 – Sept 2019',
    location: 'Taillis Labs, Casablanca',
    description: 'CRM pour centre d\'appel. React, Redux, Node.js, MongoDB, Kafka.',
  },
  {
    title: 'Développeur FullStack',
    subtitle: 'Jan 2018 – Fév 2019',
    location: 'FY Computing, Rabat',
    description: 'Application d\'études cliniques pour Sanofi. React, Redux, Node.js, MongoDB, Redis, Socket.io.',
  },
];

export default function ResumeSection() {
  const { t } = useT();

  return (
    <section id="resume" className={shared.sectionAlt}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.resumeHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.resumeSubtitle')}</p>
        </div>

        <div className={styles.resumeGrid}>
          <div className={styles.resumeCol}>
            <h3>{t('landing.education')}</h3>
            <Timeline items={EDUCATION} />
          </div>
          <div className={styles.resumeCol}>
            <h3>{t('landing.experience')}</h3>
            <Timeline items={EXPERIENCE} />
          </div>
        </div>
      </Container>
    </section>
  );
}
