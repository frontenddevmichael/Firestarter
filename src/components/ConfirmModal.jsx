import { useCallback, useEffect, useRef } from 'react';
import styles from './ConfirmModal.module.css'

export default function ConfirmModal({ open, title, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger }) {
  const modalRef = useRef(null);
  const prevFocus = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { onCancel(); return }
    if (e.key !== 'Tab') return;
    const focusable = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement;
    document.addEventListener('keydown', handleKeyDown);
    const firstFocusable = modalRef.current?.querySelector('button');
    if (firstFocusable) firstFocusable.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (prevFocus.current) prevFocus.current.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onCancel} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.modal} ref={modalRef} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{children}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} type="button">{cancelLabel}</button>
          <button className={`${styles.confirmBtn} ${danger ? styles.dangerBtn : ''}`} onClick={onConfirm} type="button">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
