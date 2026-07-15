import { useEffect, useRef, useState } from 'react';
import styles from './PassingSpark.module.css';

export default function PassingSpark({ className = '' }) {
  const ref = useRef(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setLit(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);

    const fallback = setTimeout(() => {
      if (!lit) {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
          setLit(true);
          observer.disconnect();
        }
      }
    }, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.wrap} ${lit ? styles.lit : ''} ${className}`} aria-hidden="true">
      <svg
        className={styles.line}
        viewBox="0 0 240 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M4 6 H236"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 8"
          opacity="0.15"
        />
        <path
          className={styles.fuse}
          d="M4 6 H236"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 8"
          opacity="0.6"
        />
        <circle
          className={styles.ember}
          cx="4"
          cy="6"
          r="3"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
