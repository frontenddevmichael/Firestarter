import styles from './EmberField.module.css';

// Fixed, deterministic positions — a handful of embers, not a particle-system
// gimmick. Restrained on purpose: this is the one atmospheric touch in the hero.
const embers = [
  { top: '18%', left: '82%', size: 4, delay: 0 },
  { top: '32%', left: '90%', size: 6, delay: 1.2 },
  { top: '58%', left: '85%', size: 3, delay: 2.1 },
  { top: '72%', left: '93%', size: 5, delay: 0.6 },
  { top: '12%', left: '70%', size: 3, delay: 1.8 },
];

/**
 * density="default" — full set, used once in the Home hero.
 * density="low" — fewer embers, dimmer, used sparingly elsewhere (e.g. the
 * Home final CTA) so the motif recurs without repeating itself identically.
 */
export default function EmberField({ density = 'default' }) {
  const active = density === 'low' ? embers.slice(0, 3) : embers;

  return (
    <div className={`${styles.field} ${density === 'low' ? styles.fieldLow : ''}`} aria-hidden="true">
      {active.map((e, i) => (
        <span
          key={i}
          className={styles.ember}
          style={{
            top: e.top,
            left: e.left,
            width: e.size,
            height: e.size,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
