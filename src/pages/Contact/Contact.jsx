import { useEffect, useRef, useState } from 'react';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './Contact.module.css';

/**
 * DrawnCheck — small self-drawing checkmark for the form's success state.
 * Same stroke-dasharray/dashoffset technique as SparkMark's drawIn, scoped
 * locally here since it's a one-off tied to submit feedback, not a
 * recurring brand mark.
 */
function DrawnCheck() {
  const pathRef = useRef(null);

  useEffect(() => {
    const node = pathRef.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const length = node.getTotalLength();
    node.style.strokeDasharray = length;
    node.style.strokeDashoffset = length;
    // Force reflow, then animate — same two-step pattern as SparkMark.
    node.getBoundingClientRect();
    node.style.transition = 'stroke-dashoffset 0.4s cubic-bezier(0.65, 0, 0.35, 1)';
    node.style.strokeDashoffset = '0';
  }, []);

  return (
    <svg
      className={styles.checkIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path ref={pathRef} d="M4 12.5 L9.5 18 L20 6" />
    </svg>
  );
}

const faqs = [
  {
    q: 'Who can enter the 2026 Prize?',
    a: 'The Firestarter Young Poets Prize is open to secondary school students across Lagos State, Nigeria — Junior Poets (ages 10–13) and Senior Poets (ages 14–17).',
  },
  {
    q: 'What do I need to submit?',
    a: 'One original poem, a short Voice Reflection, and a performance video of you reading the same poem aloud.',
  },
  {
    q: 'Is there an entry fee?',
    a: 'This will be confirmed before launch — check back or contact us directly for the latest.',
  },
  {
    q: 'How is judging decided?',
    a: 'Our judging panel reviews every entry blind, focused on voice and honesty over technical polish.',
  },
];

export default function Contact() {
  const [openIndex, setOpenIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    e.target.reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Contact &amp; FAQ</span>
            <h1 className={styles.heroTitle}>Questions? We've Got Answers.</h1>
            <p className={styles.heroSub}>
              Whether it's eligibility, the judging process, or a technical hiccup during
              submission, our team is here to help.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className={`container ${styles.grid}`}>
          <Reveal className={styles.faqCol}>
            <h2>Frequently Asked</h2>
            <div className={styles.faqList}>
              {faqs.map((item, i) => (
                <div key={item.q} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    aria-expanded={openIndex === i}
                  >
                    <span>{item.q}</span>
                    <Icon
                      name={openIndex === i ? 'minus' : 'plus'}
                      size={18}
                      className={styles.chevron}
                    />
                  </button>
                  <div
                    className={styles.faqAnswerWrap}
                    style={{ gridTemplateRows: openIndex === i ? '1fr' : '0fr' }}
                  >
                    <p className={styles.faqAnswer}>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className={styles.contactCol}>
            <h2>Ignite a Conversation</h2>
            <p className={styles.contactSub}>We usually respond within 48 business hours.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                Your Name
                <input type="text" required />
              </label>
              <label>
                Email Address
                <input type="email" required />
              </label>
              <label>
                Your Inquiry
                <textarea rows="4" required />
              </label>
              <button type="submit" className={`btnPrimary ${styles.submitBtn}`}>
                {submitted ? (
                  <span className={styles.submitSuccess}>
                    <DrawnCheck /> Message Sent
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>

            <div className={styles.contactDetails}>
              <p><Icon name="mail" size={16} /> contact@firestartermethod.com</p>
              <p>firestartermethod.com</p>
              <p><Icon name="instagram" size={16} /> @firestartercollectiveafrica</p>
              <p><Icon name="pin" size={16} /> Lagos, Nigeria</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
