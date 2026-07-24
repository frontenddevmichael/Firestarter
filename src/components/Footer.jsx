import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import styles from './Footer.module.css';

export default function Footer() {
  const { pathname } = useLocation();
  const isPrize = pathname.startsWith('/prize');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus('success');
    setEmail('');
  };

  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        <div className={styles.brand}>
          <div className={styles.logo}>Firestarter</div>
          <p className={styles.copy}>
            © 2026 Firestarter Method. All Rights Reserved.
          </p>
          <div className={styles.signup}>
            <span className={styles.footerLabel}>I write to this list often. Sometimes it is a poem. Sometimes it is the work. Come in.</span>
            {status === 'success' ? (
              <p className={styles.signupSuccess}>You are in. Watch your inbox.</p>
            ) : (
              <form className={styles.signupForm} onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Your email"
                  className={styles.signupInput}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className={styles.signupBtn}>Subscribe</button>
              </form>
            )}
          </div>
        </div>

        <div className={styles.col}>
          <span className={styles.heading}>Navigate</span>
          <Link to="/">The Method</Link>
          <Link to="/work">Work With Me</Link>
          <Link to="/musical">The Musical</Link>
          <Link to="/prize">Poets Prize</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className={styles.col}>
          <span className={styles.heading}>Connect</span>
          <a href="mailto:contact@firestartermethod.com">
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
          <Link to="/prize">The Firestarter Young Poets Prize</Link>
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.contactLine}>SHEISAVOICE</a>
        </div>
      </div>
    </footer>
  );
}
