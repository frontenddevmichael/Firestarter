import styles from './ConfirmModal.module.css'

export default function ConfirmModal({ open, title, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger }) {
  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{children}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>{cancelLabel}</button>
          <button className={`${styles.confirmBtn} ${danger ? styles.dangerBtn : ''}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
