import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './KeyDates.module.css';

const milestones = [
  { label: 'Entries Open', date: 'Now', desc: 'The portal is open for Lagos State secondary school students to submit.' },
  { label: 'Deadline', date: '30 Sept 2026, 11:59 PM (WAT)', desc: 'All entries must be received by this time. No extensions.', highlight: true },
  { label: 'Judging', date: 'October', desc: 'Our panel reviews every submission across both categories.' },
  { label: 'Finalists Announced & Creative Lab', date: 'November', desc: 'Finalists are revealed and take part in a creative workshop.' },
  { label: 'Grand Final', date: 'December', desc: 'A night of performance and recognition in Lagos.', star: true },
];

/**
 * MilestoneDot — the grey base dot is always visible; the ember "lit"
 * overlay fades/scales in as the fuse line's scroll progress passes this
 * milestone's position along the timeline, so each date visibly catches
 * as the reader scrolls to it.
 */
function MilestoneDot({ progress, ratio, star, highlight }) {
  const glow = useTransform(progress, [Math.max(ratio - 0.1, 0), ratio], [0, 1]);

  return (
    <span className={`${styles.dot} ${highlight ? styles.dotHighlightBase : ''}`}>
      <motion.span className={styles.dotGlow} style={{ opacity: glow, scale: glow }} />
      {star && <Icon name="star" size={12} className={styles.starIcon} />}
    </span>
  );
}

export default function KeyDates() {
  const timelineRef = useRef(null);
  // Progress runs 0→1 as the timeline scrolls from just entering view to
  // just leaving it — this single value drives both the fuse fill and
  // each dot's ignition point below.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  return (
    <div>
      <section className={styles.hero}>
        <Reveal variant="up-large" className="container">
          <span className="eyebrow">Key Dates</span>
          <h1 className={styles.heroTitle}>The Road to the Grand Final.</h1>
          <p className={styles.heroSub}>
            Mark your calendar for the defining moments of the 2026 Prize.
          </p>
        </Reveal>
      </section>

      <section className={styles.timelineSection}>
        <div className="container">
          <div className={styles.timeline} ref={timelineRef}>
            <div className={styles.timelineLine} />
            <motion.div
              className={styles.timelineFuse}
              style={{ scaleY: scrollYProgress }}
            />
            {milestones.map((m, i) => (
              <Reveal
                key={m.label}
                delay={i * 100}
                className={`${styles.milestone} ${m.highlight ? styles.milestoneHighlight : ''}`}
              >
                <MilestoneDot
                  progress={scrollYProgress}
                  ratio={i / (milestones.length - 1)}
                  star={m.star}
                  highlight={m.highlight}
                />
                <span className="eyebrow">{m.date}</span>
                <h3>{m.label}</h3>
                <p>{m.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.closingCta}>
        <div className="container">
          <p>
            Haven't entered yet?{' '}
            <a href="/how-to-enter" className={styles.link}>
              See How to Enter <Icon name="arrowRight" size={14} />
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
