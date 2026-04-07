import { useEffect, useRef, useState } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiBookOpen } from 'react-icons/fi';
import { SiMalt } from 'react-icons/si';
import { useNavigate } from '@mas/react-router';
import { useT } from '@mas/shared/i18n';
import { TypedText, Icon, Button } from '@mas/react-ui';
import styles from './HeroSection.module.scss';

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const [fadeOpacity, setFadeOpacity] = useState(0);

  useEffect(() => {
    // Walk up to find the scrollable parent
    const getScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
      if (!el) return window;
      const style = getComputedStyle(el);
      if (['auto', 'scroll'].includes(style.overflowY) && el.scrollHeight > el.clientHeight) {
        return el;
      }
      return getScrollParent(el.parentElement);
    };

    const section = sectionRef.current;
    if (!section) return;
    const scrollContainer = getScrollParent(section.parentElement);

    const onScroll = () => {
      const sectionH = section.offsetHeight;
      const scrollY =
        scrollContainer === window ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;
      // Fade starts at 10% of hero height, completes at 75% — power curve for strong effect
      const start = sectionH * 0.1;
      const end = sectionH * 0.75;
      const raw = (scrollY - start) / (end - start);
      setFadeOpacity(Math.min(1, Math.max(0, raw ** 1.5)));
    };

    (scrollContainer as EventTarget).addEventListener('scroll', onScroll, { passive: true });
    return () => (scrollContainer as EventTarget).removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="hero" className={styles.hero} ref={sectionRef}>
      <img src="/assets/landing-hero.png" alt="" className={styles.heroBg} />
      {/* Scroll-driven fade overlay — color matches next section bg via CSS var */}
      <div
        className={styles.heroFade}
        style={{ backgroundColor: `var(--color-background)`, opacity: fadeOpacity }}
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
          <a
            href="https://github.com/aitsaidmouaaddev-droid"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Icon type="vector" icon={FiGithub} size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/mouaad-a-82ba521a2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Icon type="vector" icon={FiLinkedin} size={24} />
          </a>
          <a href="mailto:aitsaidmouaad.dev@gmail.com" aria-label="Email">
            <Icon type="vector" icon={FiMail} size={24} />
          </a>
          <a
            href="https://www.malt.fr/profile/mouaadaitsaid"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Malt"
          >
            <Icon type="vector" icon={SiMalt} size={29} />
          </a>
        </div>
        {import.meta.env.MODE !== 'production' && (
          <>
            <p className={styles.heroLearnIntro}>{t('landing.learnIntro')}</p>
            <Button
              variant="primary"
              label={t('landing.startLearning')}
              startIcon={FiBookOpen}
              style={{ marginTop: 12 }}
              onClick={() => navigate('/learn')}
            />
          </>
        )}
      </div>
    </section>
  );
}
