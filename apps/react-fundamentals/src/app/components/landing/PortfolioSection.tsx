import { useT } from '@mas/shared/i18n';
import { Container, CardDeck } from '@mas/react-ui';
import type { CardDeckItem } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './PortfolioSection.module.scss';

const PORTFOLIO_ITEMS: CardDeckItem[] = [
  {
    key: 'breath',
    image: '/assets/protfolio-stuff/breath.webp',
    title: 'Breath',
  },
  {
    key: 'tooshare',
    image: '/assets/protfolio-stuff/tooshare.webp',
    title: 'TooShare',
  },
  {
    key: 'verifi',
    image: '/assets/protfolio-stuff/verifi.png',
    title: 'Verifi',
  },
];

export default function PortfolioSection() {
  const { t } = useT();

  return (
    <section id="portfolio" className={shared.section}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.portfolioHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.portfolioSubtitle')}</p>
        </div>

        <div className={styles.deckWrapper}>
          <CardDeck items={PORTFOLIO_ITEMS} autoplay autoplayInterval={3000} loop />
        </div>
      </Container>
    </section>
  );
}
