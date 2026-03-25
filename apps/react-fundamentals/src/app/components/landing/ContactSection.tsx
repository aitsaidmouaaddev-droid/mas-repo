import { FiMapPin, FiMail, FiPhone, FiGithub } from 'react-icons/fi';
import { useT } from '@mas/shared/i18n';
import { Container, Icon, Button } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './ContactSection.module.scss';

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontSize: '0.9rem',
};

export default function ContactSection() {
  const { t } = useT();

  return (
    <section id="contact" className={shared.sectionAlt}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.contactHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.contactSubtitle')}</p>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.contactItemIcon}>
                <Icon type="vector" icon={FiMapPin} size={20} />
              </span>
              <div className={styles.contactItemText}>
                <h4>{t('landing.contactLocation')}</h4>
                <p>Nangis (77370), Île-de-France</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactItemIcon}>
                <Icon type="vector" icon={FiMail} size={20} />
              </span>
              <div className={styles.contactItemText}>
                <h4>{t('landing.contactEmail')}</h4>
                <p>aitsaidmouaad.dev@gmail.com</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactItemIcon}>
                <Icon type="vector" icon={FiPhone} size={20} />
              </span>
              <div className={styles.contactItemText}>
                <h4>{t('landing.contactCall')}</h4>
                <p>07 66 29 14 17</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactItemIcon}>
                <Icon type="vector" icon={FiGithub} size={20} />
              </span>
              <div className={styles.contactItemText}>
                <h4>GitHub</h4>
                <p>
                  <a href="https://github.com/aitsaidmouaaddevdroid" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                    aitsaidmouaaddevdroid
                  </a>
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input type="text" placeholder={t('landing.formName')} style={inputStyle} />
              <input type="email" placeholder={t('landing.formEmail')} style={inputStyle} />
            </div>
            <input type="text" placeholder={t('landing.formSubject')} style={inputStyle} />
            <textarea rows={5} placeholder={t('landing.formMessage')} style={{ ...inputStyle, resize: 'vertical' as const }} />
            <Button variant="primary" type="submit" style={{ alignSelf: 'flex-start' }}>
              {t('landing.formSend')}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
