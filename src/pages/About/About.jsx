import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import RevealImage from '../../components/RevealImage';
import styles from './About.module.css';

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div>
      <section ref={heroRef} className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">About the Prize</span>
            <h1 className={styles.heroTitle}>Why This Matters.</h1>
            <div className={styles.rule} />
            <p className={styles.heroText}>
              The Firestarter Young Poets Prize is not just a competition. It is a movement
              designed to give young Nigerian voices a national stage. We believe a single
              stanza has the power to shift how a country thinks about its own future.
            </p>
          </Reveal>
        </div>
        <motion.span className={styles.heroGhostWord} style={{ y: ghostY }}>
          Why
        </motion.span>
      </section>

      <section className={styles.caseSection}>
        <div className="container">
          <Reveal variant="clip" className={styles.quoteWrap}>
            {/* Ghost quote mark — static: parallax is reserved for hero-level ghosts only (heroGhostWord above), content-section quotes stay fixed for legibility */}
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            <blockquote className={styles.pullQuote}>
              Poetry is the spark that turns silence into truth.
            </blockquote>
          </Reveal>
          <Reveal delay={120} variant="soft" className={styles.twoCol}>
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
          </Reveal>
        </div>
      </section>

      <section className={styles.themeSection}>
        <div className={`container ${styles.themeInner}`}>
          <Reveal>
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
          </Reveal>
          <RevealImage className={styles.themeImage}>
            <img src="/WEBSITEIMAGE.jpeg" alt="Theme visual" className={styles.panelPhoto} loading="lazy" decoding="async" />
          </RevealImage>
        </div>
      </section>

      <section className={styles.cta}>
        <Reveal className="container">
          <h2>Find your starting line.</h2>
          <p>Read the full submission guidelines and prepare your poem.</p>
          <div className={styles.ctaActions}>
            <Link to="/prize/how-to-enter" className={`${styles.ctaBtnDark} ${styles.btnIcon}`}>
              How to Enter <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
