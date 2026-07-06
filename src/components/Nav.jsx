import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';

const links = [
  { text: 'Home', href: '/' },
  { text: 'About & Theme', href: '/about' },
  { text: 'How to Enter', href: '/how-to-enter' },
  { text: 'Key Dates', href: '/key-dates' },
  { text: 'For Parents & Teachers', href: '/parents-and-teachers' },
  { text: 'Contact', href: '/contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
        Firestarter 2026
      </Link>

      <button
        className={styles.hamburger}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`${styles.navLinks} ${open ? styles.navLinksOpen : ''}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={styles.link}
            onClick={() => setOpen(false)}
          >
            {link.text}
          </Link>
        ))}
        <Link to="/how-to-enter" className={`${styles.enterBtn} btnPrimary`} onClick={() => setOpen(false)}>
          Enter Now
        </Link>
      </div>
    </nav>
  );
}
