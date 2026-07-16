import { Link } from 'react-router-dom';
import PrizeBanner from '../../components/PrizeBanner';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './Forge.module.css';

const sections = [
  { title: 'One force at a time', text: 'We pick the force that is blocking you — usually Force One — and we work it until it moves. Three hours straight.' },
  { title: 'You bring the thing', text: 'A project. A decision. Something you have been stuck on. We apply the method to it in real time.' },
  { title: 'You leave with proof', text: 'Not notes. Not a plan. Something finished — a page, a decision, a thing you can point to.' },
];

export default function Forge() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">The Forge Intensive</span>
            <h1 className={styles.heroTitle}>Three hours. One to one.<br />Force One.</h1>
            <p className={styles.heroSub}>
              The fastest way to break through a creative block. You and me. One session. One force.
            </p>
            <div className={styles.priceRow}>
              <span className={styles.price}>$250</span>
              <span className={styles.priceNote}>per session, one to one</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.howSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>The session</h2>
          </Reveal>
          <div className={styles.sectionsList}>
            {sections.map((s, i) => (
              <Reveal key={s.title} variant={i === 2 ? 'soft' : 'up'} delay={i * 90}>
                <div className={styles.sectionCard}>
                  <span className={styles.sectionNum}>0{i + 1}</span>
                  <div>
                    <h3 className={styles.sectionCardTitle}>{s.title}</h3>
                    <p className={styles.sectionCardText}>{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

        <section className={styles.ctaSection}>
        <div className="container">
          <Reveal variant="up-large" delay={140}>
            <h2 className={styles.ctaTitle}>Bookings opening soon</h2>
            <p className={styles.ctaText}>
              The Forge Intensive is currently being scheduled. Join the waitlist to be notified.
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
