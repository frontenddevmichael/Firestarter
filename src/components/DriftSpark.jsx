import styles from './DriftSpark.module.css';

const positions = [
  { top: '15%', left: '85%', delay: 0, duration: 10 },
  { top: '55%', left: '5%', delay: 2, duration: 12 },
  { top: '80%', left: '80%', delay: 4, duration: 9 },
];

export default function DriftSpark({ density = 'default', className = '' }) {
  const active = density === 'low' ? positions.slice(0, 1) : positions;

  return (
    <div className={`${styles.field} ${className}`} aria-hidden="true">
      {active.map((p, i) => (
        <svg
          key={i}
          className={styles.drift}
          style={{
            top: p.top,
            left: p.left,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
          viewBox="0 0 100 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="36"
        >
          <path
            d="M2 15 Q 25 4, 50 14 T 98 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.08"
          />
        </svg>
      ))}
    </div>
  );
}
