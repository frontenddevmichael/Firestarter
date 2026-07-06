import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import styles from './About.module.css';

export default function About() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <SparkMark />
          <span className="eyebrow">About the Prize</span>
          <h1 className={styles.heroTitle}>Why This Matters.</h1>
          <div className={styles.rule} />
          <p className={styles.heroText}>
            The Firestarter Young Poets Prize is not just a competition. It is a movement
            designed to give young Nigerian voices a national stage. We believe a single
            stanza has the power to shift how a country thinks about its own future.
          </p>
        </div>
      </section>

      <section className={styles.caseSection}>
        <div className="container">
          <blockquote className={styles.pullQuote}>
            Poetry is the spark that turns silence into truth.
          </blockquote>
          <div className={styles.twoCol}>
            <p>
              Nigeria's literary history is carved in resilience and brilliance — from
              oral tradition to our celebrated modern poets. We invite the next generation
              to reclaim that lineage. We look for voices that are honest, unpolished, and
              fiercely their own.
            </p>
            <p>
              Our judging panel isn't looking for perfect grammar. They're looking for the
              "fire" — the intersection of everyday Nigerian life and the timeless questions
              every young person carries. This prize offers more than recognition; it offers
              mentorship and a real platform to be heard.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.themeSection}>
        <div className={`container ${styles.themeInner}`}>
          <div>
            <SparkMark />
            <span className="eyebrow">2026 Theme</span>
            <h2 className={styles.themeTitle}>My Voice, My Future</h2>
            <p className={styles.themeText}>
              The 2026 theme challenges every applicant to project themselves forward. What
              does the landscape of your tomorrow look like? We ask you to speak your future
              into existence — your voice is the blueprint. We're looking for poems that
              tackle agency, identity, and what it means to grow up Nigerian in a changing
              world.
            </p>
          </div>
          <div className={`photoPlaceholder ${styles.themeImage}`}>
            Photo: open notebook with handwritten poetry, close detail
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2>Ready to enter?</h2>
          <p>Read the full submission guidelines and prepare your poem.</p>
          <div className={styles.ctaActions}>
            <Link to="/how-to-enter" className={styles.ctaBtnDark}>How to Enter</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
