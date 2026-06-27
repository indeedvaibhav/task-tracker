import { FiAlertTriangle } from 'react-icons/fi';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ task, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <FiAlertTriangle size={24} />
        </div>

        <h3 className={styles.title}>Delete this task?</h3>
        <p className={styles.message}>
          <strong>"{task.title}"</strong> will be permanently deleted.
          This action cannot be undone.
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Keep it
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}
