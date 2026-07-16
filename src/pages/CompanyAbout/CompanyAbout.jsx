import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import styles from './CompanyAbout.module.css';

export default function CompanyAbout() {
  return (
    <>
      {/* Hero */}
      <section className={`${styles.hero} grain`}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SparkMark drawIn />
            <span className="eyebrow">About the Method</span>
            <h1 className={styles.heroTitle}>The Firestarter Method</h1>
            <p className={styles.heroSub}>
              A philosophy of creative ignition — building stages for young voices
              that didn't exist before.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className={styles.story}>
        <div className={`container ${styles.storyInner}`}>
          <motion.div
            className={styles.storyImage}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src="/WEBSITEIMAGE.jpeg" alt="Shola Amaraibi" className={styles.panelPhoto} loading="lazy" decoding="async" />
          </motion.div>
          <motion.div
            className={styles.storyText}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <SparkMark />
            <span className="eyebrow">The Spark</span>
            <h2>Shola Amaraibi</h2>
            <p>
              The Firestarter Method was not written in a classroom. It was forged in
              the space between breakthrough and proof — the gap where insight lives
              but nothing gets built. Shola Amaraibi built it because she needed it
              herself: a system that turns what you have seen into what you can show.
            </p>
            <p>
              What began as a poem became a practice. What became a practice is now a
              complete five-force method taught to founders, creatives, and leaders
              across Nigeria and beyond. The work continues to evolve — through the
              prize, the musical, and every method still being written.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className={`${styles.philosophy} grain`}>
        <div className="container">
          <motion.div
            className={styles.philosophyInner}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          >
            <SparkMark />
            <span className="eyebrow">The Philosophy</span>
            <h2>Why 'Method'?</h2>
            <p>
              Every voice is a spark. But a spark needs fuel, space, and direction
              to become a flame. The Firestarter Method provides the structure —
              the stage, the prompt, the audience — so young creatives can focus
              on what matters: finding and sharing their truth.
            </p>
            <p>
              Each method — whether poetry, music, or what comes next — is designed
              around the same core belief: that every young person has a voice worth
              igniting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <motion.div
            className={styles.ctaInner}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <SparkMark />
            <h2>The stage is already burning.</h2>
            <p>
              Whether you're a student ready to enter the prize, a parent supporting
              a young poet, or a partner who shares the vision — there's a place
              for you here.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/prize" className="btnPrimary">
                Enter the Prize <Icon name="arrowRight" size={16} />
              </Link>
              <Link to="/contact" className="btnSecondary">
                Write to us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
