import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon';
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
        <span className={open ? styles.barOpen1 : ''} />
        <span className={open ? styles.barOpen2 : ''} />
        <span className={open ? styles.barOpen3 : ''} />
      </button>

      <div className={`${styles.navLinks} ${open ? styles.navLinksOpen : ''}`}>
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.href === '/'}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            onClick={() => setOpen(false)}
          >
            {link.text}
          </NavLink>
        ))}
        <Link
          to="/how-to-enter"
          className={`${styles.enterBtn} btnPrimary`}
          onClick={() => setOpen(false)}
        >
          Enter Now <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </nav>
  );
}
