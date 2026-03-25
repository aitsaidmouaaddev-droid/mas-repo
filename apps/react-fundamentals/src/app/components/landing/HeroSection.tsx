import { FiGithub, FiLinkedin, FiMail, FiBookOpen } from 'react-icons/fi';
import { useNavigate } from '@mas/react-router';
import { useT } from '@mas/shared/i18n';
import { TypedText, Icon, Button } from '@mas/react-ui';
import styles from './HeroSection.module.scss';

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useT();

  return (
    <section id="hero" className={styles.hero}>
      <img
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
        alt=""
        className={styles.heroBg}
      />
      <div className={styles.heroContent}>
        <h1 className={styles.heroName}>Mouaad AIT SAID</h1>
        <p className={styles.heroTagline}>
          <TypedText
            strings={[
              t('landing.heroRole1'),
              t('landing.heroRole2'),
              t('landing.heroRole3'),
              t('landing.heroRole4'),
            ]}
            typeSpeed={70}
            deleteSpeed={40}
            pauseDuration={1800}
          />
        </p>
        <div className={styles.socialLinks}>
          <a href="https://github.com/aitsaidmouaaddevdroid" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Icon type="vector" icon={FiGithub} size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Icon type="vector" icon={FiLinkedin} size={24} />
          </a>
          <a href="mailto:aitsaidmouaad.dev@gmail.com" aria-label="Email">
            <Icon type="vector" icon={FiMail} size={24} />
          </a>
        </div>
        <p className={styles.heroLearnIntro}>{t('landing.learnIntro')}</p>
        <Button
          variant="primary"
          label={t('landing.startLearning')}
          startIcon={FiBookOpen}
          style={{ marginTop: 12 }}
          onClick={() => navigate('/learn')}
        />
      </div>
    </section>
  );
}
