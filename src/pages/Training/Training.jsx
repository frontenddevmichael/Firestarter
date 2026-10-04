import { useState } from 'react';
import SparkMark from '../../components/SparkMark';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import styles from './Training.module.css';

const POSTER = '/newimage.jpeg';

const cards = [
  { icon: 'star', title: 'Watch the method in action', text: 'Two client stories and the five forces of the Firestarter Method. Set your foundation, see what you\u2019re here to build, make it happen, sustain it without burning out, and carry it into rooms that don\u2019t know you yet.' },
  { icon: 'pen', title: 'See where you are', text: 'Whether it\u2019s your life\u2019s mission or this season\u2019s goal, you\u2019ll see what\u2019s really standing between you and it. It\u2019s rarely what you\u2019ve been calling the problem.' },
  { icon: 'arrowRight', title: 'Take the next step', text: 'The briefing ends with one clear next step: a one-hour, one-to-one Pathfinding Session with me, where we name the real constraint and decide your first true move.' },
];

function VideoPlayer({ customVideo }) {
  const [playing, setPlaying] = useState(false);
  const driveMatch = customVideo.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  const ytMatch = customVideo.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);

  let src = null;
  if (driveMatch) {
    src = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  } else if (ytMatch) {
    src = `https://www.youtube.com/embed/${ytMatch[1]}${playing ? '?autoplay=1' : ''}&cc_load_policy=1&rel=0`;
  }
  const isFile = !driveMatch && !ytMatch && customVideo;

  if ((src || isFile) && !playing) {
    const poster = ytMatch
      ? `https://i.ytimg.com/vi/${ytMatch[1]}/maxresdefault.jpg`
      : driveMatch
        ? `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1280`
        : POSTER;
    return (
      <button type="button" className={styles.posterBtn} onClick={() => setPlaying(true)} aria-label="Play The Firestarter Briefing">
        {isFile && !ytMatch ? (
          <video className={styles.posterImg} src={customVideo} preload="metadata" muted playsInline aria-hidden="true" tabIndex={-1} />
        ) : (
          <img
            className={styles.posterImg}
            src={poster}
            alt="The Firestarter Briefing"
            loading="eager"
            onError={(e) => {
              if (ytMatch && e.currentTarget.src.includes('maxresdefault')) {
                e.currentTarget.src = `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`;
              }
            }}
          />
        )}
        <span className={styles.playBadge}>
          <Icon name="arrowRight" size={28} />
        </span>
      </button>
    );
  }

  if (src) {
    return (
      <iframe
        className={styles.videoIframe}
        src={src}
        title="The Firestarter Briefing"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isFile) {
    return (
      <video
        className={styles.videoIframe}
        src={customVideo}
        title="The Firestarter Briefing"
        poster={POSTER}
        controls
        autoPlay
        playsInline
        preload="metadata"
      />
    );
  }

  return null;
}

export default function Training() {
  const { setting } = useSiteSettings();
  const customVideo = (setting('briefing.video_url', '') || '').trim();
  const bookUrl = setting('briefing.book_url', 'https://mainstack.com/p/pathfinding-session?utm_source=website');

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <Reveal variant="up-large">
            <SparkMark />
            <span className="eyebrow">The Firestarter Briefing</span>
            <p className={styles.qualifier}>
              For capable people who keep describing a future they are not yet building.
            </p>
            <h1 className={styles.heroTitle}>The work only you can make.</h1>
            <p className={styles.heroSub}>
              Somewhere in you is work that only you can make. It will either leave with
              you, unfinished, or you will name it, own it, and make it real.
            </p>
            <p className={styles.heroSub}>
              In this 17-minute briefing, I show you the method that carries a life from
              foundation to impact, whether you&apos;re pursuing your life&apos;s mission or
              the goal that matters this season.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.videoSection}>
        <div className="container">
          <Reveal>
            <div className={styles.videoWrap}>
              <VideoPlayer customVideo={customVideo} />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className={styles.videoCta}>
              <a href={bookUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
                Book Your Pathfinding Session <Icon name="arrowRight" size={16} />
              </a>
              <p className={styles.videoFine}>
                One hour, one-to-one with me. It&apos;s a paid session:{' '}
                <a href={bookUrl} target="_blank" rel="noopener noreferrer">book here</a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>Three things in seventeen minutes</h2>
          </Reveal>
          <div className={styles.stepsGrid}>
            {cards.map((s, i) => (
              <Reveal key={s.title} variant={i === 1 ? 'clip' : 'up'} delay={i * 60}>
                <div className={styles.stepCard}>
                  <Icon name={s.icon} size={24} className={styles.stepIcon} />
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepText}>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <Reveal variant="up-large" delay={120}>
            <h2 className={styles.ctaTitle}>Your next step: the Pathfinding Session</h2>
            <p className={styles.ctaText}>
              One hour, one-to-one with me. Before we meet, you complete a short intake,
              so we start with an accurate read, not introductions.
            </p>
            <p className={styles.ctaText}>
              Inside the hour, we locate exactly where you are, name the real constraint
              beneath what you&apos;ve been calling the problem, and decide your first true
              move. Within three days, you receive your Pathfinding Note: that move, in
              writing.
            </p>
            <p className={styles.ctaText}>
              This is for you if you&apos;re done circling, done describing, done collecting
              breakthroughs.
            </p>
            <p className={styles.ctaText}>
              It\u2019s not for you if you want hype, shortcuts, or motivation without
              responsibility.
            </p>
            <a href={bookUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
              Book Your Pathfinding Session <Icon name="arrowRight" size={16} />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
