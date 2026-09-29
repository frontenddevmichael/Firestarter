import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import styles from './EnterNow.module.css';

export default function EnterNow() {
  const { setting } = useSiteSettings();
  const whatsappLink = setting('community.whatsapp_link');
  const showWhatsapp = setting('show.whatsapp', true);
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Submit Your Entry</span>
            <h1 className={styles.heroTitle}>Your Voice, Submitted.</h1>
            <p className={styles.heroSub}>
              {setting('enter.hero_sub')}
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
                {setting('enter.card_desc')}
              </p>
              <Link to="/prize/auth" className="btnPrimary">
                Create Account / Sign In <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </Reveal>

          {showWhatsapp && (
          <Reveal delay={200}>
            <div className={styles.afterForm}>
              <div className={styles.afterFormLine} />
              <h2 className={styles.afterFormTitle}>You're in good company</h2>
              <p className={styles.afterFormSub}>
                Join <strong>{setting('community.whatsapp_count')} young poets</strong> in the Firestarter WhatsApp Community for
                real-time updates, writing prompts, and prize announcements.
              </p>
              <a
                href={whatsappLink}
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
          )}
        </div>
      </section>
    </div>
  );
}
