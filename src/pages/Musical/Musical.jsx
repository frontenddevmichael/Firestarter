import { Link } from 'react-router-dom';
import PrizeBanner from '../../components/PrizeBanner';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './Musical.module.css';

export default function Musical() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Firestarter Musical</span>
            <h1 className={styles.heroTitle}>Edinburgh Fringe 2027.</h1>
            <p className={styles.heroSub}>
              A new musical born from the Firestarter Method. Five forces. Five stories. One stage.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className="container">
          <Reveal variant="soft">
            <h2 className={styles.sectionTitle}>The Fire Stories</h2>
            <p className={styles.storyText}>
              Five characters. Each one stuck in a different force. A poet who cannot start. A musician who
              cannot finish. A painter who cannot show her work. A dancer who has lost the rhythm. A teacher
              who needs to pass it on.
            </p>
            <p className={styles.storyText}>
              Over one night, their lives intersect. The method becomes the music.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.creditSection}>
        <div className="container">
          <Reveal variant="clip">
            <h2 className={styles.sectionTitle}>The founder behind it</h2>
            <p className={styles.creditText}>
              Book, music and lyrics by <strong>Shola Amaraibi</strong>. Developed through the Firestarter
              Method — each scene, each song, each movement forged through the five forces.
            </p>
            <p className={styles.creditText}>
              In development for Edinburgh Festival Fringe 2027. Cast and creative team to be announced.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.ctaTitle}>Follow the flame</h2>
            <p className={styles.ctaText}>
              Follow the development process. Behind-the-scenes content, early drafts, and work-in-progress
              showings.
            </p>
            <Link to="/contact" className={styles.ctaBtn}>
              Reach out <Icon name="arrowRight" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <PrizeBanner />
    </>
  );
}
