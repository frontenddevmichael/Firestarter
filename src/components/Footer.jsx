import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import styles from './Footer.module.css';

export default function Footer() {
  const { pathname } = useLocation();
  const isPrize = pathname.startsWith('/prize');

  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        <div className={styles.brand}>
          <div className={styles.logo}>Firestarter</div>
          <p className={styles.copy}>
            © 2026 Firestarter Method. All Rights Reserved.
          </p>
        </div>

        <div className={styles.col}>
          <span className={styles.heading}>Navigate</span>
          <Link to="/">The Method</Link>
          <Link to="/deluxe">The Deluxe</Link>
          <Link to="/forge">Forge Intensive</Link>
          <Link to="/musical">The Musical</Link>
          <Link to="/prize">Poets Prize</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className={styles.col}>
          <span className={styles.heading}>Connect</span>
          <a href="mailto:contactfirestartermethod@gmail.com">
            <Icon name="mail" size={14} /> Email
          </a>
          <span className={styles.contactLine}>
            <Icon name="pin" size={14} /> Lagos, Nigeria
          </span>
          <a href="tel:+2347039343468" className={styles.contactLine}>
            <Icon name="phone" size={14} /> +234 703 934 3468
          </a>
          <a href="https://youtube.com/@sholaamaraibi" target="_blank" rel="noopener noreferrer">
            <Icon name="video" size={14} /> YouTube
          </a>
          <a href="https://instagram.com/firestartercollectiveafrica" target="_blank" rel="noopener noreferrer">
            <Icon name="instagram" size={14} /> Instagram
          </a>
        </div>

        <div className={styles.col}>
          <span className={styles.heading}>Also in this house</span>
          <Link to="/musical">Firestarter: The Musical</Link>
          <Link to="/prize">Young Poets Prize</Link>
          <span className={styles.contactLine}>SHEISAVOICE <span className={styles.comingSoon}>coming</span></span>
        </div>
      </div>
    </footer>
  );
}
