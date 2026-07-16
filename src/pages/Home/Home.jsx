import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import DriftSpark from '../../components/DriftSpark';
import PassingSpark from '../../components/PassingSpark';
import SparkMark from '../../components/SparkMark';
import EmberField from '../../components/EmberField';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import RevealImage from '../../components/RevealImage';
import styles from './Home.module.css';

export default function Home() {
  const heroRef = useRef(null);
  // Ghost numeral drifts slower than the foreground as the hero scrolls
  // past — a cheap, single-layer parallax (transform only, no repaint cost).
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className={`${styles.hero} grain`}>
        <EmberField />
        <DriftSpark density="low" />
        <div className={`${styles.heroInner} container`}>
          <SparkMark interactive drawIn />
          <span className="eyebrow">The Firestarter Young Poets Prize 2026</span>
          <h1 className={styles.heroTitle}>
            My Voice, <br />
            <span className={styles.heroTitleAccent}>My Future.</span>
          </h1>
          <p className={styles.heroSub}>
            A national stage for the poems Nigerian students haven't been asked to write yet.
          </p>
          <div className={styles.heroActions}>
            <Link to="/prize/enter" className={`btnPrimary ${styles.btnIcon}`}>
              Enter Now <Icon name="arrowRight" size={16} />
            </Link>
            <Link to="/prize/spark-pack" className="btnSecondary">Download the Spark Pack</Link>
          </div>
        </div>
        <motion.span className={styles.heroGhostNumber} style={{ y: ghostY }}>
          01
        </motion.span>
      </section>

      <PassingSpark />

      {/* Why It Matters */}
      <section className={styles.whyMatters}>
        <div className="container">
          <Reveal>
            <SparkMark />
            <span className="eyebrow">Why It Matters</span>
          </Reveal>
          <Reveal delay={100} variant="clip" className={styles.quoteWrap}>
            {/* Ghost quote mark — static on purpose: parallax is reserved for hero-level ghosts (see heroGhostNumber above) to avoid fighting readability in content sections */}
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            <blockquote className={styles.pullQuote}>
              Your voice is not a whisper to be kept in classrooms. It is a spark that can
              ignite a nation. We aren't looking for grammar; we are looking for{' '}
              <em>courage</em>.
            </blockquote>
          </Reveal>
          <Reveal delay={200} variant="soft" className={styles.twoCol}>
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
          </Reveal>
        </div>
      </section>

      {/* Who Can Enter / What You Submit */}
      <section className={`${styles.whoCanEnter} grain`}>
        <div className="container">
          <Reveal className={styles.sectionHeading}>
            <SparkMark />
            <span className="eyebrow">Who Can Enter</span>
            <h2>Your Stage Awaits.</h2>
          </Reveal>
          <div className={styles.panels}>
            <Reveal className={styles.panel}>
              <span className={styles.panelBadge}>Category A</span>
              <RevealImage className={styles.panelImage} />
              <div className={styles.panelText}>
                <h3>Junior Poets</h3>
                <span className="eyebrow">Ages 10–13</span>
                <p>The early sparks — for students just discovering the power of observation.</p>
              </div>
            </Reveal>
            <Reveal delay={120} className={styles.panel}>
              <span className={styles.panelBadge}>Category B</span>
              <RevealImage className={styles.panelImage} />
              <div className={styles.panelText}>
                <h3>Senior Poets</h3>
                <span className="eyebrow">Ages 14–17</span>
                <p>The roaring flame — for voices ready to challenge and redefine the narrative.</p>
              </div>
            </Reveal>
          </div>

          <p className={styles.eligibilityNote}>
            Open to secondary school students across Lagos State, Nigeria.
          </p>

          <div className={styles.steps}>
            {[
              { icon: 'pen', title: 'The Poem', desc: 'Write one original poem exploring our 2026 theme.' },
              { icon: 'reflection', title: 'Voice Reflection', desc: 'A short written reflection on what your poem means to you.' },
              { icon: 'video', title: 'Performance Video', desc: 'A video of you performing the same poem aloud.' },
            ].map((s, i) => (
              <Reveal key={s.title} delay={[0, 150, 250][i]} className={styles.step}>
                {/* Ghost step numeral — static: parallax reserved for hero-level ghosts only (heroGhostNumber), inline numerals would drift awkwardly inside a grid */}
                <span className={styles.stepNumber}>0{i + 1}</span>
                <Icon name={s.icon} size={26} className={styles.stepIcon} />
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PassingSpark />

      {/* Theme Spotlight */}
      <section className={`${styles.theme}`}>
        <DriftSpark density="low" />
        <div className={`container ${styles.themeInner}`}>
          <Reveal className={styles.themeText}>
            <SparkMark />
            <span className="eyebrow">2026 Theme</span>
            <h2>My Voice, My Future.</h2>
            <p>
              This year, we ask you to look inward and forward. What do you see when you
              imagine the world of tomorrow? Who are you in that world? Use your pen to build
              the bridge between who you are now and who the future needs you to be.
            </p>
            <Link to="/prize/about" className={styles.themeLink}>
              Read the full theme <Icon name="arrowRight" size={14} />
            </Link>
          </Reveal>
          <RevealImage className={styles.themeImage}>
            <img src="/WEBSITEIMAGE.jpeg" alt="Theme visual" className={styles.panelPhoto} loading="lazy" decoding="async" />
          </RevealImage>
        </div>
      </section>

      <PassingSpark />

      {/* Key Dates snapshot — deliberately lighter than the Key Dates page.
          This is a static preview (simple grid, hardcoded active dot for Deadline).
          The full scroll-ignited timeline with fuse line lives on /key-dates. */}
      <section className={styles.datesSnapshot}>
        <div className="container">
          <h3 className={styles.sectionHeading}>Competition Timeline</h3>
          <div className={styles.datesRow}>
            {[
              { label: 'Entries Open', date: 'Now' },
              { label: 'Deadline', date: '30 Sept 2026', active: true },
              { label: 'Judging', date: 'October' },
              { label: 'Finalists & Creative Lab', date: 'November' },
              { label: 'Grand Final', date: 'December' },
            ].map((d, i) => (
              <Reveal key={d.label} delay={[0, 60, 140, 220, 280][i]} className={styles.dateItem}>
                <span className={`${styles.dateDot} ${d.active ? styles.dateDotActive : ''}`} />
                <span className="eyebrow">{d.date}</span>
                <p>{d.label}</p>
              </Reveal>
            ))}
          </div>
          <Link to="/prize/key-dates" className={styles.themeLink}>
            See full timeline <Icon name="arrowRight" size={14} />
          </Link>
        </div>
      </section>

      {/* Parents & Teachers teaser */}
      <section className={styles.parentsTeaser}>
        <Reveal className="container">
          <span className="eyebrow">For Parents &amp; Teachers</span>
          <p>
            Nurturing the next generation of Nigerian literature takes a village. See how you
            can support a young poet through the submission process.
          </p>
          <Link to="/prize/parents-and-teachers" className={styles.themeLink}>
            Learn more <Icon name="arrowRight" size={14} />
          </Link>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className={`${styles.finalCta} ${styles.finalCtaField}`}>
        <EmberField density="low" />
        <div className="container">
          <SparkMark size="large" className={styles.finalCtaSpark} drawIn />
          <h2>Ready to raise your voice?</h2>
          <p>Your journey from a blank page to a national stage starts here.</p>
          <Link to="/prize/enter" className={styles.finalCtaBtn}>
            Enter Now <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
