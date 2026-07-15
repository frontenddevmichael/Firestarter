import { useCompetition } from '../hooks/useCompetition'
import styles from './CompetitionBanner.module.css'

const PHASE_LABELS = {
  open: 'Entries Open',
  judging: 'Judging in Progress',
  shortlisted: 'Shortlist Announced',
  finalists: 'Finalists Selected',
  closed: 'Competition Closed',
}

export default function CompetitionBanner({ compact }) {
  const { phase, countdown } = useCompetition()

  return (
    <div className={`${styles.banner} ${styles[`phase_${phase}`]} ${compact ? styles.compact : ''}`}>
      <span className={styles.badge}>{PHASE_LABELS[phase] || phase}</span>
      {countdown.days > 0 && (
        <span className={styles.countdown}>
          {countdown.days}d {countdown.hours}h {countdown.minutes}m
          {!compact && <> until <strong>{countdown.label}</strong></>}
        </span>
      )}
    </div>
  )
}
