import { useState } from 'react';
import SparkMark from '../../components/SparkMark';
import styles from './Contact.module.css';

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
          <SparkMark />
          <span className="eyebrow">Contact &amp; FAQ</span>
          <h1 className={styles.heroTitle}>Questions? We've Got Answers.</h1>
          <p className={styles.heroSub}>
            Whether it's eligibility, the judging process, or a technical hiccup during
            submission, our team is here to help.
          </p>
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.faqCol}>
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
                    <span className={styles.chevron}>{openIndex === i ? '−' : '+'}</span>
                  </button>
                  {openIndex === i && <p className={styles.faqAnswer}>{item.a}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.contactCol}>
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
              <button type="submit" className="btnPrimary">
                {submitted ? 'Message Sent' : 'Send Message'}
              </button>
            </form>

            <div className={styles.contactDetails}>
              <p>contact@firestartermethod.com</p>
              <p>firestartermethod.com</p>
              <p>@firestartercollectiveafrica</p>
              <p>Lagos, Nigeria</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
