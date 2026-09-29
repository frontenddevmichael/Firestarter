import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './EnterNow.module.css';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/EDm92HpP6k26FCbvWq5V7P';

export default function EnterNow() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Submit Your Entry</span>
            <h1 className={styles.heroTitle}>Your Voice, Submitted.</h1>
            <p className={styles.heroSub}>
              Entries close <strong>October 30, 2026</strong>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <Reveal>
            <div className={styles.submitCard}>
              <Icon name="fileText" size={32} className={styles.submitIcon} />
              <h2 className={styles.submitTitle}>Submit through the Prize Platform</h2>
              <p className={styles.submitDesc}>
                Create your free account to get your personal dashboard. Explore the Spark
                Pack, save a draft, and submit your poem whenever you're ready — your
                guardian verifies with an email code before anything is submitted.
              </p>
              <Link to="/prize/auth" className="btnPrimary">
                Create Account / Sign In <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className={styles.afterForm}>
              <div className={styles.afterFormLine} />
              <h2 className={styles.afterFormTitle}>You're in good company</h2>
              <p className={styles.afterFormSub}>
                Join <strong>200+ young poets</strong> in the Firestarter WhatsApp Community for
                real-time updates, writing prompts, and prize announcements.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <Icon name="heart" size={18} />
                Join the WhatsApp Community
                <Icon name="arrowRight" size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
