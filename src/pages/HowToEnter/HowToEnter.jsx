import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import Reveal from '../../components/Reveal';
import RevealImage from '../../components/RevealImage';
import Icon from '../../components/Icon';
import styles from './HowToEnter.module.css';

const guidelines = [
  'All entries must be original, unpublished work by the entrant.',
  'Poems may be written in English, with Pidgin or indigenous Nigerian languages welcome for stylistic emphasis.',
  'Submissions must be made through the official entry portal.',
  'Entrants must be secondary school students across Lagos State, Nigeria.',
];

const steps = [
  { icon: 'pen', title: 'The Written Poem', desc: 'One original poem exploring the 2026 theme, submitted as a PDF.' },
  { icon: 'reflection', title: 'Voice Reflection', desc: 'A short written reflection on what your poem means to you and why you wrote it.' },
  { icon: 'video', title: 'Performance Video', desc: 'A video of you performing the same poem — presence matters more than production value.' },
];

export default function HowToEnter() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">How to Enter</span>
            <h1 className={styles.heroTitle}>Three Steps to the Stage.</h1>
            <p className={styles.heroSub}>
              Entries close <strong>30 September 2026, 11:59 PM (WAT)</strong>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.whoCanEnter}>
        <div className="container">
          <h2 className={styles.sectionHeading}>Two Categories, One Stage</h2>
            <div className={styles.panels}>
            <div className={styles.panel}>
              <span className={styles.panelBadge}>Category A</span>
              <RevealImage className={styles.panelImage} />
              <div className={styles.panelText}>
                <h3>Junior Poets</h3>
                <span className="eyebrow">Ages 10–13</span>
                <p>The early sparks — for students just discovering the power of observation.</p>
              </div>
            </div>
            <div className={styles.panel}>
              <span className={styles.panelBadge}>Category B</span>
              <RevealImage className={styles.panelImage} />
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
        </div>
      </section>

      <section className={styles.submission}>
        <div className="container">
          <h2 className={styles.sectionHeading}>The Three Parts</h2>
          <div className={styles.stepsRow}>
            {steps.map((s, i) => (
              <Reveal key={s.title} variant={['up', 'soft', 'clip'][i]} delay={[0, 130, 280][i]} className={styles.step}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <Icon name={s.icon} size={24} className={styles.stepIcon} />
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.guidelines}>
        <div className="container">
          <h2 className={styles.sectionHeading}>Submission Rules</h2>
          <ul className={styles.list}>
            {guidelines.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.entryCta}>
        <div className="container">
          <h2>The deadline is approaching.</h2>
          <p>Entries close 30 September 2026, 11:59 PM (WAT).</p>
          <Link to="/prize/enter" className="btnPrimary">Enter Now</Link>
        </div>
      </section>
    </div>
  );
}
