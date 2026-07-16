import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import styles from './PrizeBanner.module.css';

export default function PrizeBanner() {
  return (
    <section className={styles.banner}>
      <div className="container">
        <Reveal className={styles.inner}>
          <span className={styles.eyebrow}>Also open to entries</span>
          <h2 className={styles.heading}>
            The Firestarter<br />
            <span className={styles.em}>Young Poets Prize</span>
          </h2>
          <p className={styles.text}>
            A poetry competition for secondary school students across Lagos State —
            Junior Poets (ages 10–13) and Senior Poets (ages 14–17). Enter original
            poems, win prizes, get published.
          </p>
          <Link to="/prize" className="btnPrimary">
            Enter the Prize
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
