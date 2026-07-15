import { Link } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import styles from './SparkPack.module.css';

export default function SparkPack() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">Free Resource</span>
            <h1 className={styles.heroTitle}>The Spark Pack.</h1>
            <p className={styles.heroSub}>
              A free toolkit for teachers, parents, and young poets — packed with writing
              prompts, tips, and everything you need to craft a winning entry.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.whatsInside}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionHeading}>What's Inside</h2>
            <ul className={styles.list}>
              <li><Icon name="pen" size={18} className={styles.listIcon} /> Writing prompts to spark your first draft</li>
              <li><Icon name="star" size={18} className={styles.listIcon} /> Tips from past finalists and judges</li>
              <li><Icon name="heart" size={18} className={styles.listIcon} /> A guide for parents and teachers supporting young poets</li>
              <li><Icon name="check" size={18} className={styles.listIcon} /> Submission checklist so you don't miss a thing</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className={styles.download}>
        <div className="container">
          <Reveal className={styles.downloadInner}>
            <h2 className={styles.downloadTitle}>Ready to get started?</h2>
            <p className={styles.downloadSub}>
              Download the Spark Pack and take the first step toward the national stage.
            </p>
            <a
              href="/spark-pack.pdf"
              download
              className={`btnPrimary ${styles.downloadBtn}`}
            >
              <Icon name="arrowRight" size={16} /> Download Spark Pack (PDF)
            </a>
            <p className={styles.downloadNote}>
              You'll need a PDF reader to open the file. The pack is free — share it with
              your class, club, or child.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.cta}>
        <Reveal className="container">
          <h2>Your voice is the spark.</h2>
          <p>When you're ready, submit your entry.</p>
          <Link to="/prize/enter" className="btnPrimary">
            Enter Now <Icon name="arrowRight" size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
