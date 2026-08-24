import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './About.module.css';

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div>
      <section ref={heroRef} className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">About &amp; Theme</span>
            <h1 className={styles.heroTitle}>Built on poetry. Aimed at the future.</h1>
            <div className={styles.rule} />
            <p className={styles.heroText}>
              The Firestarter Young Poets Prize gives young people in Lagos a serious
              creative challenge: write something original, understand your own thinking
              well enough to explain it, and carry your words with confidence. Those three
              acts, repeated, build the skills every future will reward: original thinking,
              clear communication, creativity, reflection, and good judgement with powerful
              tools.
            </p>
          </Reveal>
        </div>
        <motion.span className={styles.heroGhostWord} style={{ y: ghostY }}>
          Why
        </motion.span>
      </section>

      {/* Why It Matters */}
      <section className={styles.caseSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>Why it matters</h2>
            <p className={styles.bodyText}>
              The world our students are growing into is full of new tools that can produce
              words, images and answers on demand. That is not a threat. It is an
              invitation to raise the value of what only a person can bring: a real
              question, an honest observation, an idea worth making, and the voice to carry
              it.
            </p>
            <p className={styles.bodyText}>
              The Prize is informed by UNESCO's work on the ethical use of artificial
              intelligence and the future skills young people need to thrive in a rapidly
              changing world.*
            </p>
          </Reveal>
        </div>
      </section>

      {/* What the Prize Develops */}
      <section className={styles.developsSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>What the Prize develops</h2>
            <div className={styles.skillsGrid}>
              {[
                { skill: 'Voice', desc: 'Finding and trusting a perspective that is truly your own.' },
                { skill: 'Thinking', desc: 'Questioning, interpreting, and forming original ideas.' },
                { skill: 'Communication', desc: 'Expressing complex feeling and thought with clarity.' },
                { skill: 'Imagination', desc: 'Picturing what does not yet exist and giving it shape.' },
                { skill: 'Judgement', desc: 'Sensing what is meaningful, honest, and worth saying.' },
                { skill: 'Presence', desc: 'Carrying your voice in front of others with confidence.' },
              ].map((item) => (
                <Reveal key={item.skill} variant="soft" className={styles.skillItem}>
                  <h3>{item.skill}</h3>
                  <p>{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why We Ask for More Than a Poem */}
      <section className={styles.caseSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>Why we ask for more than a poem</h2>
            <p className={styles.bodyText}>
              Every entrant submits a poem and a short Voice Reflection: what is this poem
              really about, and why did you write it? The reflection is not a test. It
              makes your thinking visible, and your thinking is part of the work. We do not
              reward polished language alone. We reward originality, insight, observation,
              emotional intelligence and imagination. The story behind a piece is part of
              what makes it matter.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Technology as Amplifier */}
      <section className={styles.techSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>Technology as amplifier</h2>
            <p className={styles.bodyText}>
              Firestarter's creative signature, Creative-TechFormance™, rests on a simple
              principle: the human provides the spark, and technology does the amplifying.
              Tools can help you check a spelling or learn a new word. The ideas, the
              feeling and the voice must be yours. Shortlisted finalists take this further
              at the Creative-Tech Lab, working with mentors and creative technology to
              bring their poems to life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The 2026 Theme */}
      <section className={styles.themeSection}>
        <div className="container">
          <Reveal>
            <SparkMark />
            <span className="eyebrow">The 2026 theme in full</span>
            <h2 className={styles.themeTitle}>My Voice, My Future.</h2>
            <p className={styles.themeIntro}>
              My Voice, My Future is an invitation to say something only you can say. Every
              invention began as an idea. Every movement began with someone willing to
              speak. Every change began with a person who chose to put what they saw,
              felt, or hoped for into words. This is your turn.
            </p>
          </Reveal>

          <div className={styles.themePrompts}>
            <Reveal variant="soft" className={styles.promptCard}>
              <span className="eyebrow">Junior Poets · ages 10 to 13</span>
              <p>
                Write a poem about a future you can picture. It might be the person you
                want to become, a change you want to see in your home, your school, your
                street, or your country, or a moment when you felt brave, seen, or full of
                hope. Begin with something real, something you have felt or noticed, and
                let it grow. You don't have to write about the whole world. Start with
                your corner of it.
              </p>
            </Reveal>
            <Reveal variant="soft" delay={120} className={styles.promptCard}>
              <span className="eyebrow">Senior Poets · ages 14 to 17</span>
              <p>
                Write a poem that speaks into the future. What do you want to build, change,
                protect, or become? What do you see that others around you are not yet
                saying? You might write about identity, family, community, technology,
                leadership, the environment, or the Nigeria you imagine. Whatever you
                choose, make it yours: say the thing only you can say, in language only you
                would use.
              </p>
            </Reveal>
          </div>

          <Reveal>
            <p className={styles.promptNote}>
              The prompt is a door, not a fence. Start there, then take it wherever your
              voice leads.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.cta}>
        <Reveal className="container">
          <h2>Find your starting line.</h2>
          <p>Read the full submission guidelines and prepare your poem.</p>
          <div className={styles.ctaActions}>
            <Link to="/prize/enter" className={`${styles.ctaBtnDark} ${styles.btnIcon}`}>
              Enter now <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className={styles.footnote}>
        <div className="container">
          <p>
            *UNESCO, Recommendation on the Ethics of Artificial Intelligence, adopted by
            all member states in November 2021; UNESCO AI Competency Framework for
            Students, which frames young people as responsible citizens and co-creators in
            the age of artificial intelligence.
          </p>
        </div>
      </section>
    </div>
  );
}
