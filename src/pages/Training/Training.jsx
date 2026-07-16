import { Link } from 'react-router-dom';
import PrizeBanner from '../../components/PrizeBanner';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './Training.module.css';

const steps = [
  { icon: 'star', title: 'Watch the method in action', text: 'Fifteen minutes. One real life. I walk you through each of the five forces and show you exactly how they connect.' },
  { icon: 'pen', title: 'See where you are', text: 'Every force is a diagnosis. By the end of the training you will know which force is your next move — and what to do about it.' },
  { icon: 'arrowRight', title: 'Take the next step', text: 'The free training ends with a clear fork: start the Deluxe if you want the full system, or book The Forge if you need to break through a block.' },
];

export default function Training() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Free Training</span>
            <h1 className={styles.heroTitle}>Fifteen minutes.<br />The whole method.</h1>
            <p className={styles.heroSub}>
              One real life. All five forces. Watch how the Firestarter Method transforms
              what you have seen into what you can show.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.videoSection}>
        <div className="container">
          <Reveal>
            <div className={styles.videoWrap}>
              <iframe
                className={styles.videoIframe}
                src="https://www.youtube.com/embed/S8-nva4YA9k"
                title="Firestarter Method Training"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>Three moves in fifteen minutes</h2>
          </Reveal>
          <div className={styles.stepsGrid}>
            {steps.map((s, i) => (
              <Reveal key={s.title} variant={i === 1 ? 'clip' : 'up'} delay={i * 60}>
                <div className={styles.stepCard}>
                  <Icon name={s.icon} size={24} className={styles.stepIcon} />
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepText}>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

        <section className={styles.ctaSection}>
        <div className="container">
          <Reveal variant="up-large" delay={120}>
            <h2 className={styles.ctaTitle}>The map and the tools</h2>
            <p className={styles.ctaText}>
              The free training shows you the map. The Deluxe hands you the tools.
            </p>
            <Link to="/deluxe" className={styles.ctaBtn}>
              Explore the Firestarter Deluxe <Icon name="arrowRight" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <PrizeBanner />
    </>
  );
}
