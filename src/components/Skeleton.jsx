import styles from './Skeleton.module.css'

export default function Skeleton({ width, height, borderRadius }) {
  return (
    <div
      className={styles.skeleton}
      aria-hidden="true"
      style={{
        width: width || '100%',
        height: height || '1rem',
        borderRadius: borderRadius || '4px',
      }}
    />
  )
}
