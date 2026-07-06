import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <SparkMark />
          <span className="eyebrow">The Firestarter Young Poets Prize 2026</span>
          <h1 className={styles.heroTitle}>My Voice, My Future.</h1>
          <p className={styles.heroSub}>
            A national stage for the poems Nigerian students haven't been asked to write yet.
          </p>
          <div className={styles.heroActions}>
            <Link to="/how-to-enter" className="btnPrimary">Enter Now</Link>
            <a href="#spark-pack" className="btnSecondary">Download the Spark Pack</a>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className={styles.whyMatters}>
        <div className="container">
          <SparkMark />
          <span className="eyebrow">Why It Matters</span>
          <blockquote className={styles.pullQuote}>
            Your voice is not a whisper to be kept in classrooms. It is a spark that can ignite
            a nation. We aren't looking for grammar; we are looking for <em>courage</em>.
          </blockquote>
          <div className={styles.twoCol}>
            <p>
              In the heart of every Nigerian student lies a narrative shaped by history,
              resilience, and the vibrant pulse of our streets. The Firestarter Young Poets
              Prize was founded to bridge the gap between creative impulse and national
              visibility.
            </p>
            <p>
              By providing a platform for students aged 10 to 17, we are investing in the
              intellectual architects of tomorrow. This is more than a competition — it's a
              movement to reclaim our stories, one stanza at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Who Can Enter / What You Submit */}
      <section className={styles.whoCanEnter}>
        <div className="container">
          <div className={styles.panels}>
            <div className={styles.panel}>
              <div className={`photoPlaceholder ${styles.panelImage}`}>
                Photo: Junior Poet, ages 10–13, mid-performance
              </div>
              <div className={styles.panelText}>
                <h3>Junior Poets</h3>
                <span className="eyebrow">Ages 10–13</span>
                <p>The early sparks — for students just discovering the power of observation.</p>
              </div>
            </div>
            <div className={styles.panel}>
              <div className={`photoPlaceholder ${styles.panelImage}`}>
                Photo: Senior Poet, ages 14–17, mid-performance
              </div>
              <div className={styles.panelText}>
                <h3>Senior Poets</h3>
                <span className="eyebrow">Ages 14–17</span>
                <p>The roaring flame — for voices ready to challenge and redefine the narrative.</p>
              </div>
            </div>
          </div>

          <p className={styles.eligibilityNote}>
            Open to secondary school students across Lagos State, Nigeria.
          </p>

          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1.</span>
              <div>
                <h4>The Poem</h4>
                <p>Write one original poem exploring our 2026 theme.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>2.</span>
              <div>
                <h4>Voice Reflection</h4>
                <p>A short written reflection on what your poem means to you.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>3.</span>
              <div>
                <h4>Performance Video</h4>
                <p>A video of you performing the same poem aloud.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Spotlight */}
      <section className={styles.theme}>
        <div className={`container ${styles.themeInner}`}>
          <div className={styles.themeText}>
            <SparkMark />
            <span className="eyebrow">2026 Theme</span>
            <h2>My Voice, My Future.</h2>
            <p>
              This year, we ask you to look inward and forward. What do you see when you
              imagine the world of tomorrow? Who are you in that world? Use your pen to build
              the bridge between who you are now and who the future needs you to be.
            </p>
            <Link to="/about" className={styles.themeLink}>Read the full theme →</Link>
          </div>
          <div className={`photoPlaceholder ${styles.themeImage}`}>
            Photo: hand writing in a notebook, close-up detail shot
          </div>
        </div>
      </section>

      {/* Key Dates snapshot */}
      <section className={styles.datesSnapshot}>
        <div className="container">
          <h3 className={styles.sectionHeading}>Competition Timeline</h3>
          <div className={styles.datesRow}>
            <div className={styles.dateItem}>
              <span className={styles.dateDot} />
              <span className="eyebrow">Now</span>
              <p>Entries Open</p>
            </div>
            <div className={styles.dateItem}>
              <span className={`${styles.dateDot} ${styles.dateDotActive}`} />
              <span className="eyebrow">30 Sept 2026</span>
              <p>Deadline</p>
            </div>
            <div className={styles.dateItem}>
              <span className={styles.dateDot} />
              <span className="eyebrow">October</span>
              <p>Judging</p>
            </div>
            <div className={styles.dateItem}>
              <span className={styles.dateDot} />
              <span className="eyebrow">November</span>
              <p>Finalists &amp; Creative Lab</p>
            </div>
            <div className={styles.dateItem}>
              <span className={styles.dateDot} />
              <span className="eyebrow">December</span>
              <p>Grand Final</p>
            </div>
          </div>
          <Link to="/key-dates" className={styles.themeLink}>See full timeline →</Link>
        </div>
      </section>

      {/* Parents & Teachers teaser */}
      <section className={styles.parentsTeaser}>
        <div className="container">
          <span className="eyebrow">For Parents &amp; Teachers</span>
          <p>
            Nurturing the next generation of Nigerian literature takes a village. See how you
            can support a young poet through the submission process.
          </p>
          <Link to="/parents-and-teachers" className={styles.themeLink}>Learn more →</Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <SparkMark size="large" className={styles.finalCtaSpark} />
          <h2>Ready to raise your voice?</h2>
          <p>Your journey from a blank page to a national stage starts here.</p>
          <Link to="/how-to-enter" className={styles.finalCtaBtn}>Enter Now</Link>
        </div>
      </section>
    </div>
  );
}
