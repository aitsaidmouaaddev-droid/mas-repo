import { useT } from '@mas/shared/i18n';
import { Container, Carousel } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './TestimonialsSection.module.scss';

const TESTIMONIALS = [
  {
    quote: 'Working with this developer was a game-changer. Our platform performance improved by 40% after the refactor.',
    name: 'Sarah Johnson',
    role: 'CTO, TechStartup',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    quote: 'Delivered our mobile app ahead of schedule with exceptional quality. Highly recommended.',
    name: 'Marc Dupont',
    role: 'Product Manager, FinCo',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    quote: 'A rare full-stack talent who understands both frontend UX and backend architecture deeply.',
    name: 'Linda Chen',
    role: 'Engineering Lead, CloudBase',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
];

export default function TestimonialsSection() {
  const { t } = useT();

  return (
    <section id="testimonials" className={shared.section}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.testimonialsHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.testimonialsSubtitle')}</p>
        </div>

        <Carousel autoplay autoplayInterval={6000} loop>
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className={styles.testimonialSlide}>
              <div>
                <p className={styles.testimonialQuote}>&ldquo;{item.quote}&rdquo;</p>
                <p className={styles.testimonialName}>{item.name}</p>
                <p className={styles.testimonialRole}>{item.role}</p>
              </div>
              <img src={item.avatar} alt={item.name} className={styles.testimonialAvatar} />
            </div>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
