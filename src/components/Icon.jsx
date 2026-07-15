import styles from './Icon.module.css';

/**
 * Icon — small, original single-stroke icon set matching the editorial,
 * hand-drawn feel of SparkMark. All paths are hand-authored, not copied
 * from any icon library.
 */
const paths = {
  pen: (
    <path d="M4 20 L4 16.5 L15 5.5 Q16 4.5 17 5.5 L18.5 7 Q19.5 8 18.5 9 L7.5 20 Z M14 7.5 L16.5 10" />
  ),
  reflection: (
    <path d="M4 6 H20 M4 11 H15 M4 16 H17 M4 21 H12" />
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="0" />
      <path d="M16 10.5 L21 7.5 V16.5 L16 13.5 Z" />
    </>
  ),
  arrowRight: <path d="M4 12 H19 M13 6 L19 12 L13 18" />,
  plus: <path d="M12 5 V19 M5 12 H19" />,
  minus: <path d="M5 12 H19" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 6 L12 13 L21 6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="0" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21 C7 15.5 4.5 12 4.5 8.5 A7.5 7.5 0 0 1 19.5 8.5 C19.5 12 17 15.5 12 21 Z" />
      <circle cx="12" cy="8.5" r="2.5" />
    </>
  ),
  star: (
    <path d="M12 3 L14.5 9.2 L21 9.8 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.8 L9.5 9.2 Z" />
  ),
  heart: (
    <path d="M12 20 C6 16 3 12.5 3 8.8 A4.8 4.8 0 0 1 12 6 A4.8 4.8 0 0 1 21 8.8 C21 12.5 18 16 12 20 Z" />
  ),
  check: <path d="M4 12.5 L9.5 18 L20 6" />,
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </>
  ),
  fileText: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </>
  ),
  barChart: (
    <>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </>
  ),
  checkCircle: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  maximize: (
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </>
  ),
  flag: (
    <>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </>
  ),
};

export default function Icon({ name, size = 22, className = '', strokeWidth = 1.6 }) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || null}
    </svg>
  );
}
