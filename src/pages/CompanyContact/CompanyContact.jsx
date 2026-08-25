import { useEffect, useRef, useState } from 'react';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './CompanyContact.module.css';

function DrawnCheck() {
  const pathRef = useRef(null);

  useEffect(() => {
    const node = pathRef.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const length = node.getTotalLength();
    node.style.strokeDasharray = length;
    node.style.strokeDashoffset = length;
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
    q: 'What is the Firestarter Method?',
    a: 'A five-force system that helps you name the life you want, own the choices it requires, and make it real. Forge, Illuminate, Enact, Regenerate, Amplify.',
  },
  {
    q: 'Is this coaching, therapy, or a course?',
    a: 'It is a structured method with a clear sequence and a standard of proof at each stage. It is not therapy and does not replace therapy.',
  },
  {
    q: 'Do I have to be creative or a poet?',
    a: 'No. The Method began in poetry, but it is designed for anyone willing to examine their choices honestly and do the work.',
  },
  {
    q: 'Where are you based? Can I do this online?',
    a: 'Shola is based between Lagos and Paris. The Method can be taught and completed online, in English.',
  },
  {
    q: 'How long does it take?',
    a: 'Each force has its own pace. Some move faster, some take longer. The full Method is not designed to be completed in a weekend.',
  },
];

export default function CompanyContact() {
  const [openIndex, setOpenIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [fields, setFields] = useState({
    name: { value: '', touched: false },
    email: { value: '', touched: false },
    inquiry: { value: '', touched: false },
  });

  const setField = (name, key, val) => {
    setFields(prev => ({ ...prev, [name]: { ...prev[name], [key]: val } }));
  };

  const validators = {
    name: (v) => v.trim().length > 0,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    inquiry: (v) => v.trim().length > 0,
  };

  const fieldErrors = {
    name: "What's your name?",
    email: 'Please provide a valid email address.',
    inquiry: "Don't leave the message blank.",
  };

  const getError = (name) => {
    const f = fields[name];
    if (!f.touched) return '';
    if (validators[name](f.value)) return '';
    return fieldErrors[name];
  };

  const getInputClass = (name) => {
    const f = fields[name];
    const err = getError(name);
    if (err) return styles.inputError;
    if (f.touched && f.value) return styles.inputValid;
    return '';
  };

  const isValid = () =>
    validators.name(fields.name.value) &&
    validators.email(fields.email.value) &&
    validators.inquiry(fields.inquiry.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFields(prev => ({
      name: { ...prev.name, touched: true },
      email: { ...prev.email, touched: true },
      inquiry: { ...prev.inquiry, touched: true },
    }));
    if (!isValid()) return;
    const body = encodeURIComponent(
      `Name: ${fields.name.value}\nEmail: ${fields.email.value}\n\n${fields.inquiry.value}`
    );
    window.location.href = `mailto:contactfirestartermethod@gmail.com?subject=Firestarter%20Enquiry&body=${body}`;
    setSubmitted(true);
    setFields({ name: { value: '', touched: false }, email: { value: '', touched: false }, inquiry: { value: '', touched: false } });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <section className={`${styles.hero} grain`}>
        <div className="container">
          <Reveal>
            <SparkMark />
            <span className="eyebrow">Contact</span>
            <h1 className={styles.heroTitle}>Get in touch.</h1>
            <p className={styles.heroSub}>
              Whether you have a question about the Method, want to work together, or
              just want to say hello, I'd like to hear from you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className={`container ${styles.grid}`}>
          <Reveal variant="soft" className={styles.faqCol}>
            <h2>Common Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((item, i) => {
                const panelId = `faq-panel-${i}`;
                return (
                <div key={item.q} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    aria-expanded={openIndex === i}
                    aria-controls={panelId}
                  >
                    <span>{item.q}</span>
                    <Icon
                      name={openIndex === i ? 'minus' : 'plus'}
                      size={18}
                      className={styles.chevron}
                    />
                  </button>
                  <div
                    id={panelId}
                    className={styles.faqAnswerWrap}
                    style={{ gridTemplateRows: openIndex === i ? '1fr' : '0fr' }}
                  >
                    <p className={styles.faqAnswer}>{item.a}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={120} className={styles.contactCol}>
            <h2>Send a Message</h2>
            <p className={styles.contactSub}>I usually respond within a few days.</p>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <label>
                Your Name
                <input
                  type="text"
                  required
                  value={fields.name.value}
                  onChange={(e) => setField('name', 'value', e.target.value)}
                  onBlur={() => setField('name', 'touched', true)}
                  className={getInputClass('name')}
                />
                {getError('name') && <span className={styles.fieldError}>{getError('name')}</span>}
              </label>
              <label>
                Email Address
                <input
                  type="email"
                  required
                  value={fields.email.value}
                  onChange={(e) => setField('email', 'value', e.target.value)}
                  onBlur={() => setField('email', 'touched', true)}
                  className={getInputClass('email')}
                />
                {getError('email') && <span className={styles.fieldError}>{getError('email')}</span>}
              </label>
              <label>
                Your Message
                <textarea
                  rows="4"
                  required
                  value={fields.inquiry.value}
                  onChange={(e) => setField('inquiry', 'value', e.target.value)}
                  onBlur={() => setField('inquiry', 'touched', true)}
                  className={getInputClass('inquiry')}
                />
                {getError('inquiry') && <span className={styles.fieldError}>{getError('inquiry')}</span>}
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
              <p><Icon name="mail" size={16} /> contactfirestartermethod@gmail.com</p>
              <p><Icon name="pin" size={16} /> Lagos, Nigeria</p>
              <p><Icon name="phone" size={16} /> +234 703 934 3468</p>
              <p><Icon name="instagram" size={16} /> @firestartercollectiveafrica</p>
              <p><Icon name="video" size={16} /> youtube.com/@sholaamaraibi</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
