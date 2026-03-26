import { useMemo } from 'react';
import { FiMonitor, FiSmartphone, FiServer } from 'react-icons/fi';
import { useT } from '@mas/shared/i18n';
import { Container, Icon } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './ServicesSection.module.scss';

export default function ServicesSection() {
  const { t } = useT();

  const services = useMemo(
    () => [
      { icon: FiMonitor, title: t('landing.svcWeb'), desc: t('landing.svcWebDesc') },
      { icon: FiSmartphone, title: t('landing.svcMobile'), desc: t('landing.svcMobileDesc') },
      { icon: FiServer, title: t('landing.svcBackend'), desc: t('landing.svcBackendDesc') },
    ],
    [t],
  );

  return (
    <section id="services" className={shared.sectionAlt}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.servicesHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.servicesSubtitle')}</p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((svc) => (
            <div key={svc.title} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Icon type="vector" icon={svc.icon} size={40} />
              </div>
              <h4 className={styles.serviceTitle}>{svc.title}</h4>
              <p className={styles.serviceDesc}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
