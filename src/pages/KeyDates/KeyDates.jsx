import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Icon from "../../components/Icon";
import Reveal from "../../components/Reveal";
import styles from "./KeyDates.module.css";

const milestones = [
  {
    label: "Entries Open",
    date: "Now",
    desc: "Submit one original poem and your Voice Reflection.",
  },
  {
    label: "Entries Close",
    date: "October 30, 2026",
    desc: "No entries can be accepted after this date.",
    highlight: true,
  },
  {
    label: "Judging and Shortlist",
    date: "November",
    desc: "Every entry is read. Shortlisted students are contacted and invited to record a performance video of their poem.",
  },
  {
    label: "Performance Videos Due",
    date: "Late November",
    desc: "Shortlisted students upload their video to YouTube as an unlisted link and share it with the Prize team.",
  },
  {
    label: "Finalists' Creative-Tech Lab",
    date: "Early December",
    desc: "A two-day lab where finalists work with mentors and creative technology to bring their poems to life.",
  },
  {
    label: "Grand Final and Prize-giving",
    date: "December",
    desc: "Finalists perform and winners in each category are celebrated, at an event connected to Firestarter: The Musical at MUSON Centre, Lagos.",
    star: true,
  },
];

function MilestoneDot({ progress, ratio, star, highlight }) {
  const glow = useTransform(
    progress,
    [Math.max(ratio - 0.1, 0), ratio],
    [0, 1],
  );

  return (
    <span
      className={`${styles.dot} ${highlight ? styles.dotHighlightBase : ""}`}
    >
      <motion.span
        className={styles.dotGlow}
        style={{ opacity: glow, scale: glow }}
      />
      {star && <Icon name="star" size={12} className={styles.starIcon} />}
    </span>
  );
}

export default function KeyDates() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.85", "end 0.4"],
  });

  return (
    <div>
      <section className={styles.hero}>
        <Reveal variant="up-large" className="container">
          <span className="eyebrow">Key Dates</span>
          <h1 className={styles.heroTitle}>Key dates</h1>
          <p className={styles.heroSub}>
            Exact dates for the videos, the lab and the grand final are shared
            directly with shortlisted students, their parents and their schools.
          </p>
        </Reveal>
      </section>

      <section className={styles.timelineSection}>
        <div className="container">
          <div className={styles.timeline} ref={timelineRef}>
            <div className={styles.timelineLine} />
            <motion.div
              className={styles.timelineFuse}
              style={{ scaleY: scrollYProgress }}
            />
            {milestones.map((m, i) => (
              <Reveal
                key={m.label}
                variant={["up", "soft", "up", "clip", "up", "up"][i]}
                delay={[0, 120, 260, 420, 500, 600][i]}
                className={`${styles.milestone} ${m.highlight ? styles.milestoneHighlight : ""}`}
              >
                <MilestoneDot
                  progress={scrollYProgress}
                  ratio={i / (milestones.length - 1)}
                  star={m.star}
                  highlight={m.highlight}
                />
                <span className="eyebrow">{m.date}</span>
                <h3>{m.label}</h3>
                <p>{m.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <Reveal className="container">
          <h2>Find your starting line.</h2>
          <p>Read the full submission guidelines and prepare your poem.</p>
          <div className={styles.ctaActions}>
            <Link
              to="/prize/enter"
              className={`${styles.ctaBtnDark} ${styles.btnIcon}`}
            >
              Enter now <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
