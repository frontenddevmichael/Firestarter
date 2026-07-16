import { useEffect, useState } from 'react';

const forces = [
  { name: 'Forge', num: '01' },
  { name: 'Illuminate', num: '02' },
  { name: 'Enact', num: '03' },
  { name: 'Regenerate', num: '04' },
  { name: 'Amplify', num: '05' },
];

// Pre-calculated node positions (cx, baseline for each force)
const NODES = [
  { cx: 12,  cy: 120, labelX: 12,  labelY: 160 },
  { cx: 22,  cy: 54,  labelX: 22,  labelY: 36 },
  { cx: 50,  cy: 54,  labelX: 50,  labelY: 36 },
  { cx: 78,  cy: 54,  labelX: 78,  labelY: 36 },
  { cx: 88,  cy: 120, labelX: 88, labelY: 160 },
];

function buildPath() {
  let d = '';
  for (let i = 0; i < NODES.length - 1; i++) {
    const a = NODES[i];
    const b = NODES[i + 1];
    const mx = (a.cx + b.cx) / 2;
    d += i === 0 ? `M${a.cx},${a.cy}` : '';
    d += ` C${mx},${a.cy} ${mx},${b.cy} ${b.cx},${b.cy}`;
  }
  return d;
}

const PATH = buildPath();

export default function FieraFlow({ className = '' }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const t = setInterval(() => {
      setPhase(p => (p + 1) % 8);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const glow = (i) =>
    i === phase % 5
      ? 1
      : i === (phase - 1 + 5) % 5
        ? 0.3
        : 0;

  return (
    <svg
      viewBox="0 0 100 180"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-label="The five forces of the Firestarter Method: Forge, Illuminate, Enact, Regenerate, Amplify"
      role="img"
    >
      {/* connecting paths */}
      <path d={PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />

      {/* animated energy blips along the path */}
      {[0.15, 0.4, 0.65].map((offset, i) => {
        const p = (phase / 8 + offset) % 1;
        // approximate point along path
        const idx = p * (NODES.length - 1);
        const lo = Math.floor(idx);
        const hi = Math.min(lo + 1, NODES.length - 1);
        const t = idx - lo;
        const a = NODES[lo];
        const b = NODES[hi];
        const cx = a.cx + (b.cx - a.cx) * t;
        const cy = a.cy + (b.cy - a.cy) * t;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="1.2"
            fill="#D65A1F"
            opacity={0.9 - i * 0.2}
          />
        );
      })}

      {/* node circles + labels */}
      {NODES.map((n, i) => (
        <g key={forces[i].name}>
          <circle
            cx={n.cx}
            cy={n.cy}
            r="4.5"
            fill="none"
            stroke={glow(i) > 0.5 ? 'var(--color-ember)' : 'rgba(255,255,255,0.2)'}
            strokeWidth={glow(i) > 0.5 ? 1.6 : 0.8}
            style={{
              transition: 'stroke 0.4s, stroke-width 0.4s',
            }}
          />
          <circle
            cx={n.cx}
            cy={n.cy}
            r="1.5"
            fill={glow(i) > 0.5 ? 'var(--color-ember)' : 'rgba(255,255,255,0.15)'}
            style={{ transition: 'fill 0.4s' }}
          />
          {/* number */}
          <text
            x={n.cx}
            y={n.cy + 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="3"
            fontFamily="inherit"
            letterSpacing="1"
          >
            {forces[i].num}
          </text>
          {/* name */}
          <text
            x={n.cx}
            y={n.labelY}
            textAnchor="middle"
            fill="var(--color-warm-white)"
            fontSize="3.5"
            fontFamily="var(--font-display)"
            fontStyle="italic"
          >
            {forces[i].name}
          </text>
        </g>
      ))}

      {/* "start" label near Forge */}
      <text
        x={NODES[0].cx}
        y={NODES[0].cy + 8}
        textAnchor="middle"
        fill="var(--color-gold)"
        fontSize="2.5"
        fontFamily="inherit"
        letterSpacing="0.5"
      >
        START
      </text>
    </svg>
  );
}
