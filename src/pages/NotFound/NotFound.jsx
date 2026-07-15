import { Link, useLocation } from 'react-router-dom';
import SparkMark from '../../components/SparkMark';
import styles from './NotFound.module.css';

export default function NotFound() {
  const { pathname } = useLocation();
  const isPrize = pathname.startsWith('/prize');

  return (
    <section className={styles.wrap}>
      <div className="container">
        <SparkMark />
        <span className="eyebrow">404</span>
        <h1 className={styles.title}>This page hasn't been written yet.</h1>
        <p className={styles.sub}>
          {isPrize
            ? 'The page you\'re looking for doesn\'t exist — or it\'s still being drafted. The prize stage is waiting.'
            : 'The page you\'re looking for doesn\'t exist — or it\'s still being drafted. The main stage is waiting.'}
        </p>
        <div className={styles.links}>
          <Link to={isPrize ? '/prize' : '/'} className="btnPrimary">
            {isPrize ? 'Back to Prize Home' : 'Back to Home'}
          </Link>
          {!isPrize && (
            <>
              <Link to="/training" className="btnSecondary">Free Training</Link>
              <Link to="/prize" className="btnSecondary">Poets Prize</Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
