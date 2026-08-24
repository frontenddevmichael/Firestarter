import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import DriftSpark from '../../components/DriftSpark';
import PassingSpark from '../../components/PassingSpark';
import SparkMark from '../../components/SparkMark';
import EmberField from '../../components/EmberField';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './Home.module.css';

export default function Home() {
  const heroRef = useRef(null);
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
            For secondary school students across Lagos State, ages 10 to 17. Write one
            original poem. Share the thinking behind it. Build original thinking, confident
            communication and the responsible use of technology, through poetry, reflection
            and spoken-word performance.
          </p>
          <div className={styles.heroActions}>
            <Link to="/prize/enter" className={`btnPrimary ${styles.btnIcon}`}>
              Enter now <Icon name="arrowRight" size={16} />
            </Link>
            <Link to="/prize/spark-pack" className="btnSecondary">Download the Spark Pack</Link>
          </div>
          <p className={styles.heroFine}>Free to enter. Entries close October 30, 2026.</p>
        </div>
        <motion.span className={styles.heroGhostNumber} style={{ y: ghostY }}>
          01
        </motion.span>
      </section>

      <PassingSpark />

      {/* What This Is */}
      <section className={styles.whyMatters}>
        <div className="container">
          <Reveal>
            <SparkMark />
            <span className="eyebrow">What this is</span>
          </Reveal>
          <Reveal delay={100} variant="soft" className={styles.twoCol}>
            <p>
              The Firestarter Young Poets Prize is a future-skills programme that uses
              poetry, reflection and spoken-word performance to help young people develop
              original thinking, confident communication and the responsible use of
              technology.
            </p>
            <p>
              These abilities grow more valuable as the world changes, not less. A young
              person who can observe closely, form an idea of their own, express it clearly,
              and stand behind it in front of others is ready for any future. Poetry,
              reflection and spoken-word performance are how we build those abilities. The
              stage, the mentors and the Prize are how we honour them.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className={styles.deliveredBy}>Delivered by The Firestarter Collective Africa.</p>
          </Reveal>
        </div>
      </section>

      {/* Who Can Enter */}
      <section className={`${styles.whoCanEnter} grain`}>
        <div className="container">
          <Reveal className={styles.sectionHeading}>
            <SparkMark />
            <span className="eyebrow">Who can enter</span>
            <h2>Your Stage Awaits.</h2>
          </Reveal>
          <div className={styles.panels}>
            <Reveal className={styles.panel}>
              <span className={styles.panelBadge}>Category A</span>
              <div className={styles.panelText}>
                <h3>Junior Poets</h3>
                <span className="eyebrow">Ages 10–13</span>
                <p>For younger writers discovering the power of their own voice.</p>
              </div>
            </Reveal>
            <Reveal delay={120} className={styles.panel}>
              <span className={styles.panelBadge}>Category B</span>
              <div className={styles.panelText}>
                <h3>Senior Poets</h3>
                <span className="eyebrow">Ages 14–17</span>
                <p>For older students ready to shape ideas and influence the future.</p>
              </div>
            </Reveal>
          </div>

          <p className={styles.eligibilityNote}>
            Open to secondary school students across Lagos State.
          </p>

          <div className={styles.steps}>
            {[
              { icon: 'pen', title: 'Stage One. Write.', desc: 'Submit one original poem on this year\'s theme, plus a short Voice Reflection: three to five sentences on what your poem is really about and why you wrote it. That is all. No video is needed to enter.' },
              { icon: 'video', title: 'Stage Two. Perform.', desc: 'If you are shortlisted, we invite you to record yourself performing the same poem and share the video with us as a YouTube link. Winners in each category are chosen from these performances.' },
            ].map((s, i) => (
              <Reveal key={s.title} delay={[0, 150][i]} className={styles.step}>
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
              Every generation inherits a world shaped by the voices that came before it.
              The future will be shaped by the voices that speak today. Yours is one of
              them. Write honestly. Imagine boldly. Use your words to help shape the future
              you want to see.
            </p>
            <Link to="/prize/about" className={styles.themeLink}>
              Read the full theme and your age-group prompt <Icon name="arrowRight" size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      <PassingSpark />

      {/* Key Dates snapshot */}
      <section className={styles.datesSnapshot}>
        <div className="container">
          <h3 className={styles.sectionHeading}>Timeline</h3>
          <div className={styles.datesRow}>
            {[
              { label: 'Entries Open', date: 'Now' },
              { label: 'Entries Close', date: 'Oct 30', active: true },
              { label: 'Judging & Shortlist', date: 'November' },
              { label: 'Creative-Tech Lab', date: 'Early Dec' },
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
          <span className="eyebrow">For parents and teachers</span>
          <p>
            Behind every young voice is someone who believed it mattered. See what your
            child or student gains from taking part, and how to support their entry.
          </p>
          <Link to="/prize/parents-and-teachers" className={styles.themeLink}>
            Parents & Teachers <Icon name="arrowRight" size={14} />
          </Link>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className={`${styles.finalCta} ${styles.finalCtaField}`}>
        <EmberField density="low" />
        <div className="container">
          <SparkMark size="large" className={styles.finalCtaSpark} drawIn />
          <h2>Every voice begins somewhere.</h2>
          <p>This could be where yours begins.</p>
          <Link to="/prize/enter" className={styles.finalCtaBtn}>
            Enter now <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
