import { Link } from 'react-router-dom';
import PrizeBanner from '../../components/PrizeBanner';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './Deluxe.module.css';

const includes = [
  { icon: 'video', title: 'Full training video', text: 'The complete Firestarter Method taught in one sitting. Watch at your own pace.' },
  { icon: 'pen', title: 'Workbook', text: 'Forty-five exercises — one for every step across all five forces. Write in it. Finish things.' },
  { icon: 'star', title: 'Force-by-force breakdown', text: 'Each force unpacked with real examples, diagnostics, and your next move.' },
  { icon: 'check', title: 'Lifetime access', text: 'Watch it once. Watch it again. The method stays with you.' },
];

export default function Deluxe() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">The Firestarter Deluxe</span>
            <h1 className={styles.heroTitle}>The complete method, in your hands.</h1>
            <p className={styles.heroSub}>
              Training video plus workbook. Watch it in an evening. Work it for a lifetime.
            </p>
            <div className={styles.priceRow}>
              <span className={styles.price}>$135</span>
              <span className={styles.priceNote}>one-time payment, lifetime access</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.includesSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>The full kit</h2>
          </Reveal>
          <div className={styles.includesGrid}>
            {includes.map((item, i) => (
              <Reveal key={item.title} variant={i % 2 === 0 ? 'up' : 'soft'} delay={i * 70}>
                <div className={styles.includeCard}>
                  <Icon name={item.icon} size={24} className={styles.includeIcon} />
                  <h3 className={styles.includeTitle}>{item.title}</h3>
                  <p className={styles.includeText}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

        <section className={styles.ctaSection}>
        <div className="container">
          <Reveal variant="up-large" delay={160}>
            <h2 className={styles.ctaTitle}>Coming</h2>
            <p className={styles.ctaSub}>
              The Firestarter Deluxe is being prepared for launch. Leave your email to be notified.
            </p>
            <Link to="/training" className={styles.ctaBtn}>
              Start with the free training <Icon name="arrowRight" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <PrizeBanner />
    </>
  );
}
