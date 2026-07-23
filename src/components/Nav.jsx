import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Icon from './Icon';
import styles from './Nav.module.css';

const companyLinks = [
  { text: 'The Method', href: '/', end: true },
  { text: 'Work With Me', href: '/#work' },
  { text: 'About', href: '/about' },
  { text: 'The Musical', href: '/musical' },
  { text: 'Poets Prize', href: '/prize' },
  { text: 'Contact', href: '/contact' },
];

const prizeLinks = [
  { text: 'Home', href: '/prize', end: true },
  { text: 'About & Theme', href: '/prize/about' },
  { text: 'How to Enter', href: '/prize/how-to-enter' },
  { text: 'Key Dates', href: '/prize/key-dates' },
  { text: 'Parents & Teachers', href: '/prize/parents-and-teachers' },
  { text: 'Spark Pack', href: '/prize/spark-pack' },
  { text: 'Contact', href: '/prize/contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuth();
  const handleSignOut = async () => { await signOut(); navigate('/prize/auth', { replace: true }); };
  const isPrize = pathname.startsWith('/prize');
  const links = isPrize ? prizeLinks : companyLinks;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll.current = current;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const getDashboardLink = () => {
    if (!profile) return null;
    if (profile.role === 'admin') return '/prize/admin';
    if (profile.role === 'judge') return '/prize/judge';
    return '/prize/dashboard';
  };

  const poetsPrizeHref = user && profile ? getDashboardLink() : '/prize';

  return (
    <nav className={`${styles.nav} ${hidden ? styles.navHidden : ''}`}>
      <Link to="/" className={styles.logo} aria-label="Home">
        <img src="/FireStarter%20collective%20logo%201.png" alt="Firestarter" className={styles.logoImg} width="240" height="32" decoding="async" />
      </Link>

      <button
        className={styles.hamburger}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={open ? styles.barOpen1 : ''} />
        <span className={open ? styles.barOpen2 : ''} />
        <span className={open ? styles.barOpen3 : ''} />
      </button>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      <div className={`${styles.navLinks} ${open ? styles.navLinksOpen : ''}`}>
        <span className={styles.sectionLabel}>{isPrize ? 'Prize' : 'Firestarter'}</span>

        {links.map((link, i) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.end}
            style={{ '--i': i }}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            {link.text}
            <svg className={styles.sparkHover} viewBox="0 0 72 14" fill="none" aria-hidden="true">
              <path d="M2 12 Q 18 2, 36 10 T 70 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </NavLink>
        ))}

        {!isPrize && (
          <NavLink
            to={poetsPrizeHref}
            end={false}
            style={{ '--i': 5 }}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            Poets Prize
            <svg className={styles.sparkHover} viewBox="0 0 72 14" fill="none" aria-hidden="true">
              <path d="M2 12 Q 18 2, 36 10 T 70 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </NavLink>
        )}

        {isPrize && user && getDashboardLink() && (
          <Link to={getDashboardLink()} className={`${styles.link} ${styles.dashLink}`}>
            Dashboard
          </Link>
        )}

        {isPrize && user && (
          <button className={styles.signOutBtn} onClick={() => { handleSignOut(); setOpen(false); }}>
            Sign Out
          </button>
        )}

        <Link
          to={
            isPrize
              ? (user ? (getDashboardLink() || '/prize/auth') : '/prize/auth')
              : '/training'
          }
          className={`${styles.enterBtn} btnPrimary`}
        >
          {isPrize ? (user ? 'Dashboard' : 'Sign In') : 'Watch Free Training'} <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </nav>
  );
}
