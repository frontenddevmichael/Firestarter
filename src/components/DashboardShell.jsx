import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Icon from './Icon';
import styles from './DashboardShell.module.css';

const sidebarConfig = {
  entrant: [
    { label: 'Overview', href: '/prize/dashboard', icon: 'barChart', end: true },
    { label: 'My Entry', href: '/prize/dashboard', icon: 'fileText' },
  ],
  judge: [
    { label: 'Overview', href: '/prize/judge', icon: 'barChart', end: true },
    { label: 'Score Entries', href: '/prize/judge', icon: 'checkCircle' },
  ],
  admin: [
    { label: 'Overview', href: '/prize/admin', icon: 'barChart', end: true },
    { label: 'Entries', href: '/prize/admin?tab=entries', icon: 'fileText' },
    { label: 'Judges', href: '/prize/admin?tab=judges', icon: 'users' },
  ],
};

const extraLinks = [
  { label: 'Spark Pack', href: '/prize/spark-pack', icon: 'download' },
];

function getPageTitle(pathname) {
  if (pathname.startsWith('/prize/dashboard')) return 'My Dashboard';
  if (pathname.startsWith('/prize/judge')) return 'Judge Panel';
  if (pathname.startsWith('/prize/admin')) return 'Admin';
  return 'Dashboard';
}

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { profile, signOut } = useAuth();
  const role = profile?.role || 'entrant';
  const links = sidebarConfig[role] || sidebarConfig.entrant;
  const title = getPageTitle(pathname);
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className={styles.shell}>
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <Link to="/" className={styles.sidebarLogo} onClick={() => setSidebarOpen(false)}>
          <img src="/FireStarter%20collective%20logo%201.png" alt="Firestarter" width="120" height="16" />
        </Link>

        <span className={styles.sidebarLabel}>
          {role === 'admin' ? 'Administration' : role === 'judge' ? 'Judging' : 'Competition'}
        </span>

        {links.map(link => (
          <NavLink
            key={link.label}
            to={link.href}
            end={link.end}
            className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name={link.icon} size={16} className={styles.sidebarLinkIcon} />
            {link.label}
          </NavLink>
        ))}

        <span className={styles.sidebarLabel}>Resources</span>

        {extraLinks.map(link => (
          <NavLink
            key={link.label}
            to={link.href}
            className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name={link.icon} size={16} className={styles.sidebarLinkIcon} />
            {link.label}
          </NavLink>
        ))}

        <div className={styles.sidebarSpacer} />

        <div className={styles.sidebarFooter}>
          <button className={styles.signOutLink} onClick={signOut}>
            <Icon name="x" size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className={styles.mainArea}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.hamburger}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span />
              <span />
              <span />
            </button>
            <h1 className={styles.headerTitle}>{title}</h1>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userBadge}>
              <div className={styles.userAvatar}>{initials}</div>
              <span className={styles.userName}>{profile?.full_name || profile?.email}</span>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* Bottom tab bar (mobile) */}
      <nav className={styles.bottomTabs}>
        {[...links, ...extraLinks].slice(0, 4).map(link => (
          <NavLink
            key={link.label}
            to={link.href}
            end={link.end}
            className={({ isActive }) => `${styles.bottomTab} ${isActive ? styles.bottomTabActive : ''}`}
          >
            <Icon name={link.icon} size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
