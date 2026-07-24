import { motion } from 'framer-motion';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import styles from './WorkWithMe.module.css';

const WHATSAPP = 'https://wa.me/2347039343468?text=';

function waMsg(msg) {
  return `${WHATSAPP}${encodeURIComponent(msg)}`;
}

const cards = [
  {
    title: 'Unstoppable Workshop',
    desc: 'Unstoppable Workshop is a monthly, 90-minute group session built around the Firestarter Method.',
    msg: "Hi, I'd like to talk about the Unstoppable Workshop",
  },
  {
    title: 'Forge Intensive',
    desc: 'Three hours, one to one. We work Force One properly: who you are under pressure, and the standard you will hold to. You leave with your Forge Standard started, in writing.',
    msg: "Hi, I'd like to talk about the Forge Intensive",
  },
  {
    title: 'Firestarter Deluxe',
    desc: 'The complete method, taught in one sitting. Training and workbook. Watch it in an evening.',
    msg: "Hi, I'd like to talk about the Firestarter Deluxe",
  },
  {
    title: 'Firestarter Business Lane',
    desc: 'Finds the money hiding in your business using the Firestarter Method, then helps you go get it. One scan shows you where. One 14-day sprint makes it real. You leave with proof you can build with.',
    msg: "Hi, I'd like to talk about the Firestarter Business Lane",
  },
];

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function WorkWithMe() {
  return (
    <>
      <section className={`${styles.hero} grain`}>
        <div className="container">
          <Reveal>
            <SparkMark />
            <span className="eyebrow">Work with me</span>
            <h1 className={styles.heroTitle}>Pick the path that fits where you are.</h1>
            <p className={styles.heroSub}>Each path is built around a different entry point. Same method underneath.</p>
          </Reveal>
        </div>
      </section>

      <section className={`${styles.cardsSection} grain`}>
        <div className="container">
          <div className={styles.grid}>
            {cards.map((c, i) => (
              <div key={c.title} className={styles.card}>
                <div className={styles.cardVisual}>
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    {i === 0 && <><circle cx="24" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="M14 38 Q24 28 34 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M24 12 L24 4 M20 8 L28 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></>}
                    {i === 1 && <><rect x="12" y="10" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M20 10 V6 H28 V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M20 22 L28 22 M20 28 L26 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></>}
                    {i === 2 && <><path d="M14 24 Q6 14 18 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M18 8 H28 Q34 8 34 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M34 18 V40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 36 H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></>}
                    {i === 3 && <><path d="M24 6 V42 M6 24 H42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" /></>}
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>{c.title}</h2>
                <p className={styles.cardDesc}>{c.desc}</p>
                <a
                  href={waMsg(c.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cta}
                >
                  Talk to me about this <Icon name="arrowRight" size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.contactHeading}>Not sure which path fits?</h2>
            <p className={styles.contactText}>
              Send a message on WhatsApp or email. We will help you find the right starting point.
            </p>
            <div className={styles.contactLinks}>
              <a
                href="https://wa.me/2347039343468?text=Hi%2C%20I'd%20like%20to%20know%20more%20about%20working%20with%20Shola"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactBtn}
              >
                <Icon name="phone" size={16} /> Chat on WhatsApp
              </a>
              <a href="mailto:contact@firestartermethod.com" className={styles.contactBtnOutline}>
                <Icon name="mail" size={16} /> contact@firestartermethod.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
