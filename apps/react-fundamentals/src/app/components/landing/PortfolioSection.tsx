import { useState, useMemo } from 'react';
import { useT } from '@mas/shared/i18n';
import { Container, FilterTabs, Lightbox } from '@mas/react-ui';
import type { FilterTab } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './PortfolioSection.module.scss';

interface PortfolioEntry {
  src: string;
  title: string;
  category: string;
  tag: string;
}

const PORTFOLIO_ITEMS: PortfolioEntry[] = [
  { src: 'https://picsum.photos/seed/p1/600/450', title: 'App 1', category: 'app', tag: 'App' },
  { src: 'https://picsum.photos/seed/p2/600/450', title: 'Web 1', category: 'web', tag: 'Web' },
  { src: 'https://picsum.photos/seed/p3/600/450', title: 'Card 1', category: 'card', tag: 'Card' },
  { src: 'https://picsum.photos/seed/p4/600/450', title: 'App 2', category: 'app', tag: 'App' },
  { src: 'https://picsum.photos/seed/p5/600/450', title: 'Web 2', category: 'web', tag: 'Web' },
  { src: 'https://picsum.photos/seed/p6/600/450', title: 'Card 2', category: 'card', tag: 'Card' },
];

export default function PortfolioSection() {
  const { t } = useT();

  const tabs: FilterTab[] = useMemo(() => [
    { key: 'all', label: t('landing.filterAll') },
    { key: 'app', label: t('landing.filterApp') },
    { key: 'web', label: t('landing.filterWeb') },
    { key: 'card', label: t('landing.filterCard') },
  ], [t]);

  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((p) => p.category === filter);

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <section id="portfolio" className={shared.section}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.portfolioHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.portfolioSubtitle')}</p>
        </div>

        <FilterTabs tabs={tabs} activeKey={filter} onTabChange={setFilter} />

        <div className={styles.portfolioGrid}>
          {filtered.map((item) => (
            <div key={item.src} className={styles.portfolioItem} onClick={() => setLightboxSrc(item.src)}>
              <img src={item.src} alt={item.title} />
              <div className={styles.portfolioOverlay}>
                <h4>{item.title}</h4>
                <p>{item.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Lightbox src={lightboxSrc ?? ''} open={!!lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </section>
  );
}
