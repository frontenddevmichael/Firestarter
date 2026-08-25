import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import Reveal from '../../components/Reveal';
import styles from './HowToEnter.module.css';

export default function HowToEnter() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">How to Enter</span>
            <h1 className={styles.heroTitle}>How to enter</h1>
            <p className={styles.heroSub}>
              Entering is free, and everything you need is on this page.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>Who can enter</h2>
            <p className={styles.bodyText}>
              Secondary school students across Lagos State, in two categories:{' '}
              <strong>Junior Poets, ages 10 to 13</strong>, and{' '}
              <strong>Senior Poets, ages 14 to 17</strong>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>Stage One: Write</h2>
            <p className={styles.bodyText}>Prepare two things:</p>

            <div className={styles.numberedBlock}>
              <span className={styles.number}>1</span>
              <div>
                <h3>Your poem</h3>
                <p>
                  One original poem on this year's theme, <em>My Voice, My Future</em>,
                  up to 40 lines. It must be your own work, written in your own voice.
                </p>
              </div>
            </div>

            <div className={styles.numberedBlock}>
              <span className={styles.number}>2</span>
              <div>
                <h3>Your Voice Reflection</h3>
                <p>
                  Three to five sentences answering one question: what is this poem really
                  about, and why did you write it? This is not a test, and there is no
                  right answer. It helps us hear the thinking behind your words.
                </p>
              </div>
            </div>

            <h3 className={styles.subHeading}>Submitting your entry</h3>
            <p className={styles.bodyText}>
              Go to the entry page, fill in your details and your school's name, add your
              poem and your Voice Reflection, and submit before October 30, 2026.
            </p> 
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>Stage Two: Perform</h2>
            <p className={styles.bodyText}>
              Every entry is read. If you are shortlisted, we will contact you and invite
              you to record a video of yourself performing the same poem. Upload it to
              YouTube as an unlisted video and share the link with us. Winners in each
              category are chosen from these performances.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>Write it in your own voice</h2>
            <p className={styles.bodyText}>
              The whole point of this Prize is your voice: the way you see things, the
              words only you would choose. Tools can help you check your spelling or learn
              a new word, but the ideas, the feeling, and the voice must be your own.
            </p>
            <p className={styles.bodyText}>
              We are not looking for the most polished poem. We are looking for the most
              honest, original, and alive one. That is something only you can write.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>The essentials</h2>
            <ul className={styles.essentialsList}>
              <li>One entry per student.</li>
              <li>Your poem must be your own original work.</li>
              <li>Junior Poets: ages 10 to 13. Senior Poets: ages 14 to 17.</li>
              <li>Free to enter.</li>
              <li>Entries close October 30, 2026.</li>
              <li>Questions? Visit the <Link to="/prize/contact" className={styles.inlineLink}>Contact</Link> page.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className={styles.entryCta}>
        <div className="container">
          <h2>Every voice begins somewhere.</h2>
          <p>This could be where yours begins.</p>
          <Link to="/prize/enter" className="btnPrimary">Enter now</Link>
        </div>
      </section>
    </div>
  );
}
