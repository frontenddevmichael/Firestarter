import { useEffect, useRef, useState } from 'react';

/**
 * Reveal — wraps content and animates it into place the first time it
 * scrolls into view. Respects prefers-reduced-motion.
 *
 * variant controls *how* it enters, so six pages of sections don't all
 * move identically:
 *   'up'       — default. Small fade-up (24px). Body copy, cards, lists.
 *   'up-large' — bigger rise (44px) + slight scale. Hero titles, big statements.
 *   'clip'     — clip-path wipe from the left. Pull-quotes, editorial moments.
 *   'soft'     — fade only, no movement. Dense text blocks where a rise reads busy.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
  className = '',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);

    const fallback = setTimeout(() => {
      if (!visible) {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
          setVisible(true);
          observer.disconnect();
        }
      }
    }, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const variantClass = {
    up: 'revealUp',
    'up-large': 'revealUpLarge',
    clip: 'revealClip',
    soft: 'revealSoft',
  }[variant] || 'revealUp';

  return (
    <Tag
      ref={ref}
      className={`${visible ? `revealVisible ${variantClass}` : 'revealHidden'} ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
