import styles from './KeyDates.module.css';

const milestones = [
  { label: 'Entries Open', date: 'Now', desc: 'The portal is open for Lagos State secondary school students to submit.' },
  { label: 'Deadline', date: '30 Sept 2026, 11:59 PM (WAT)', desc: 'All entries must be received by this time. No extensions.', highlight: true },
  { label: 'Judging', date: 'October', desc: 'Our panel reviews every submission across both categories.' },
  { label: 'Finalists Announced & Creative Lab', date: 'November', desc: 'Finalists are revealed and take part in a creative workshop.' },
  { label: 'Grand Final', date: 'December', desc: 'A night of performance and recognition in Lagos.' },
];

export default function KeyDates() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Key Dates</span>
          <h1 className={styles.heroTitle}>The Road to the Grand Final.</h1>
          <p className={styles.heroSub}>
            Mark your calendar for the defining moments of the 2026 Prize.
          </p>
        </div>
      </section>

      <section className={styles.timelineSection}>
        <div className="container">
          <div className={styles.timeline}>
            <div className={styles.timelineLine} />
            {milestones.map((m) => (
              <div
                key={m.label}
                className={`${styles.milestone} ${m.highlight ? styles.milestoneHighlight : ''}`}
              >
                <span className={styles.dot} />
                <span className="eyebrow">{m.date}</span>
                <h3>{m.label}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.closingCta}>
        <div className="container">
          <p>
            Haven't entered yet?{' '}
            <a href="/how-to-enter" className={styles.link}>See How to Enter</a>
          </p>
        </div>
      </section>
    </div>
  );
}
