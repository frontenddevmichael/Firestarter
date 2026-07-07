import { useEffect, useRef, useState } from 'react';
import styles from './SparkMark.module.css';

/**
 * SparkMark — the site's recurring signature accent.
 * A short, slightly curved ember-orange stroke used above section
 * eyebrows/headlines (Hero, Why It Matters, Theme Spotlight, Final CTA, etc.).
 *
 * NOTE: this is NOT used on the Key Dates page — that page uses a full-length
 * connecting timeline instead, since it's a literal sequence of dates.
 *
 * Usage:
 *   <SparkMark />                // default size
 *   <SparkMark size="large" />   // bigger version, e.g. Final CTA
 *   <SparkMark interactive />    // subtle cursor-parallax — use on ONE
 *                                // hero only, or it stops feeling special
 *   <SparkMark drawIn />         // self-draws once on mount, like a struck
 *                                // match catching — use on ONE hero only,
 *                                // same restraint rule as `interactive`
 */
export default function SparkMark({
  size = 'default',
  interactive = false,
  drawIn = false,
  className = '',
}) {
  const ref = useRef(null);
  const pathRef = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const sizeClass = size === 'large' ? styles.large : styles.default;

  useEffect(() => {
    if (!interactive) return;
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      node.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [interactive]);

  useEffect(() => {
    if (!drawIn) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDrawn(true);
      return;
    }
    // Measure the real path length so the dash animation matches this
    // exact curve rather than an eyeballed constant.
    const length = pathRef.current?.getTotalLength?.() ?? 110;
    pathRef.current.style.setProperty('--spark-length', length);
    // Trigger on next frame so the browser registers the starting
    // dasharray/dashoffset before the animation class is applied.
    const raf = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(raf);
  }, [drawIn]);

  return (
    <svg
      ref={ref}
      className={`${styles.sparkMark} ${sizeClass} ${className}`}
      viewBox="0 0 100 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M2 15 Q 25 4, 50 14 T 98 7"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className={drawIn ? `${styles.drawPath} ${drawn ? styles.drawPathLit : ''}` : undefined}
      />
    </svg>
  );
}
