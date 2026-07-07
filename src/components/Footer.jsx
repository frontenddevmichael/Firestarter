import { Link } from 'react-router-dom';
import Icon from './Icon';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        <div className={styles.brand}>
          <div className={styles.logo}>Firestarter</div>
          <p className={styles.copy}>
            © 2026 Firestarter Young Poets Prize. All Rights Reserved. Crafted for the
            Nigerian Spirit.
          </p>
        </div>

        <div className={styles.col}>
          <span className={styles.heading}>Explore</span>
          <Link to="/about">About &amp; Theme</Link>
          <Link to="/how-to-enter">How to Enter</Link>
          <Link to="/key-dates">Key Dates</Link>
          <Link to="/parents-and-teachers">For Parents &amp; Teachers</Link>
        </div>

        <div className={styles.col}>
          <span className={styles.heading}>Connect</span>
          <a href="mailto:contact@firestartermethod.com" className={styles.iconLink}>
            <Icon name="mail" size={16} /> contact@firestartermethod.com
          </a>
          <a href="https://firestartermethod.com" target="_blank" rel="noreferrer">
            firestartermethod.com
          </a>
          <a href="#" target="_blank" rel="noreferrer" className={styles.iconLink}>
            <Icon name="instagram" size={16} /> @firestartercollectiveafrica
          </a>
          <span className={styles.iconLink}>
            <Icon name="pin" size={16} /> Lagos, Nigeria
          </span>
        </div>
      </div>
    </footer>
  );
}
