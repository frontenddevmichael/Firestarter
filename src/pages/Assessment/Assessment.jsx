import { Link } from 'react-router-dom';
import PrizeBanner from '../../components/PrizeBanner';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './Assessment.module.css';

const forces = [
  { name: 'Forge', desc: 'How do you start things? Do you wait for the right moment, or do you strike while the metal is hot?' },
  { name: 'Illuminate', desc: 'Can you name what you have seen? Not what you know — what you have actually witnessed with your own eyes.' },
  { name: 'Enact', desc: 'Do you turn seeing into doing? What is the gap between what you know and what you make?' },
  { name: 'Regenerate', desc: 'How do you sustain your work? Do you have a rhythm that carries you through the dry months?' },
  { name: 'Amplify', desc: 'Whose work does your work lift? The last force is not about you — it is about what you leave behind.' },
];

export default function Assessment() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Creative Assessment</span>
            <h1 className={styles.heroTitle}>Where are you in the five forces?</h1>
            <p className={styles.heroSub}>
              A short diagnostic to show you which force is your next move. Ten questions. Five minutes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.diagSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>Whichever force is next</h2>
          </Reveal>
          <div className={styles.forcesList}>
            {forces.map((f, i) => (
              <Reveal key={f.name} variant={i === 4 ? 'clip' : 'up'} delay={i * 60}>
                <div className={styles.forceCard}>
                  <div className={styles.forceHeader}>
                    <span className={styles.forceNum}>Force {i + 1}</span>
                    <h3 className={styles.forceName}>{f.name}</h3>
                  </div>
                  <p className={styles.forceDesc}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

        <section className={styles.ctaSection}>
        <div className="container">
          <Reveal variant="up-large" delay={100}>
            <h2 className={styles.ctaTitle}>The assessment is coming</h2>
            <p className={styles.ctaText}>
              The full diagnostic tool is being built. In the meantime, take the free training.
            </p>
            <Link to="/training" className={styles.ctaBtn}>
              Watch the free training <Icon name="arrowRight" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <PrizeBanner />
    </>
  );
}
