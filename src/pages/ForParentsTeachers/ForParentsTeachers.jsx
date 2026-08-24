import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import Reveal from '../../components/Reveal';
import styles from './ForParentsTeachers.module.css';

export default function ForParentsTeachers() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">For Parents &amp; Teachers</span>
            <h1 className={styles.heroTitle}>Give Their Voice a Stage.</h1>
            <p className={styles.heroSub}>
              Every young voice grows because someone believed it was worth hearing. As a
              parent, guardian or teacher, your encouragement can help a young person
              discover the confidence to think independently, express themselves clearly and
              step forward with their own ideas.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <p className={styles.leadText}>
              The Firestarter Young Poets Prize is a future-skills programme that uses
              poetry, reflection and spoken-word performance to help young people develop
              original thinking, confident communication and the responsible use of
              technology.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>Why it matters</h2>
            <p className={styles.bodyText}>
              Young people are growing up in a rapidly changing world where technology is
              part of everyday life. The ability to think independently, communicate
              confidently, create original ideas and use technology responsibly will keep
              mattering, whatever path they choose.
            </p>
            <p className={styles.bodyText}>
              Through the Prize, students develop original thinking, confident
              communication, creativity, reflection, and the responsible use of technology.
              These skills reach far beyond poetry.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>How the Prize works</h2>
            <p className={styles.bodyText}>The competition takes place in two stages.</p>

            <div className={styles.numberedBlock}>
              <span className={styles.number}>1</span>
              <div>
                <h3>Stage One</h3>
                <p>
                  Students submit one original poem and a short Voice Reflection explaining
                  the thinking behind it. Entries close Friday, October 30, 2026.
                </p>
              </div>
            </div>

            <div className={styles.numberedBlock}>
              <span className={styles.number}>2</span>
              <div>
                <h3>Stage Two</h3>
                <p>
                  Shortlisted students are invited to perform the same poem and share it as
                  an unlisted YouTube video for the final stage of judging. Simple phone
                  footage is welcome. Judges watch the performance, the voice and the
                  presence.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>What you can expect from us</h2>
            <ul className={styles.commitmentList}>
              <li>
                Entry is free, and payment is never requested at any stage. If anyone asks a
                family for money to enter or advance, please contact us directly.
              </li>
              <li>
                Parental or guardian consent is required for every entry before a student's
                work is judged.
              </li>
              <li>
                Your child's poem and Reflection are read by Firestarter judges for scoring.
                A child's name, image, video or written work is shared publicly only with
                your separate, explicit consent.
              </li>
              <li>
                Videos submitted at the shortlist stage are used for judging only, unless
                you give further specific permission. We will always ask first.
              </li>
              <li>
                Any concern about a child's safety or wellbeing connected to this programme
                should be raised immediately with the Firestarter team through the{' '}
                <Link to="/prize/contact" className={styles.inlineLink}>Contact</Link> page.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>For schools</h2>
            <p className={styles.bodyText}>
              Teachers are our partners in discovering young voices. The Prize complements
              the work already happening in classrooms by giving students an opportunity to
              apply their creativity, communication and critical thinking through a
              meaningful real-world challenge. Entry is straightforward, and every
              submission follows the same official process. To involve your school, reach us
              through the{' '}
              <Link to="/prize/contact" className={styles.inlineLink}>Contact</Link> page.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>A note to parents</h2>
            <p className={styles.bodyText}>
              The greatest support you can give is believing your child has something worth
              saying. The words themselves are your child's to find. Listen to their ideas.
              Encourage them to write honestly. Celebrate the effort they make, whether or
              not they become finalists.
            </p>
            <p className={styles.bodyText}>
              The quiet hours a young person spends reading, thinking and writing matter. For
              finalists, we provide the stage. They provide the voice.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.entryCta}>
        <div className="container">
          <h2>Ready to support a young voice?</h2>
          <Link to="/prize/enter" className="btnPrimary">Enter now</Link>
        </div>
      </section>
    </div>
  );
}
