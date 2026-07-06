import SparkMark from '../../components/SparkMark';
import styles from './ForParentsTeachers.module.css';

export default function ForParentsTeachers() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <SparkMark />
          <span className="eyebrow">For Parents &amp; Teachers</span>
          <h1 className={styles.heroTitle}>Give Their Voice a Stage.</h1>
          <p className={styles.heroSub}>
            Nurturing the next generation of Nigerian voices takes more than paper — it takes
            your encouragement.
          </p>
        </div>
      </section>

      <section className={styles.impact}>
        <div className="container">
          <div className={styles.impactGrid}>
            <h2>The Impact of Entering</h2>
            <div className={styles.impactText}>
              <p>
                For guardians, the Firestarter Prize is a validation of the quiet hours a
                young person spends with their own thoughts. Encouraging a student to enter
                signals that their perspective on Nigeria, their heritage, and their future
                matters.
              </p>
              <p>
                Participation builds confidence and communication skills that carry far beyond
                the page. Finalists gain a genuine platform — we provide the stage, they
                provide the voice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.forSchools}>
        <div className="container">
          <h2 className={styles.sectionHeading}>For Schools</h2>
          <p className={styles.schoolsText}>
            Teachers are our primary partners in discovering untapped talent. Encourage
            students in your class or literary club to take part — entry is straightforward,
            and every submission goes through the same official portal.
          </p>
        </div>
      </section>

      <section className={styles.closingCta}>
        <div className="container">
          <h2>The world is waiting for what they have to say.</h2>
          <a href="/how-to-enter" className={styles.link}>Encourage a student to enter →</a>
        </div>
      </section>
    </div>
  );
}
