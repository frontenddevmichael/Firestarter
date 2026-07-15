import { useEffect, useRef } from 'react';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './EnterNow.module.css';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/EDm92HpP6k26FCbvWq5V7P';

const FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfkva7q_WdzZEdqqDzzr05CHbuMWHnIZAl_Q1VmRsXTj6H1-A/viewform?embedded=true';

export default function EnterNow() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        e.origin !== 'https://docs.google.com' ||
        !iframeRef.current ||
        !Array.isArray(e.data)
      )
        return;
      const maybeHeight = Number(e.data[0]);
      if (maybeHeight > 100 && maybeHeight < 5000) {
        iframeRef.current.style.height = maybeHeight + 'px';
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Submit Your Entry</span>
            <h1 className={styles.heroTitle}>Your Voice, Submitted.</h1>
            <p className={styles.heroSub}>
              Entries close <strong>30 September 2026, 11:59 PM (WAT)</strong>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <Reveal>
            <div className={styles.embedWrap}>
              <iframe
                ref={iframeRef}
                src={FORM_EMBED_URL}
                className={styles.formIframe}
                title="Firestarter Competition Form"
              >
                Loading…
              </iframe>
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
