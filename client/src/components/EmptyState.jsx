import styles from './EmptyState.module.css';

export default function EmptyState({ onAdd }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.illustration}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <span className={styles.emoji}>📭</span>
      </div>
      <h3 className={styles.title}>No tasks here</h3>
      <p className={styles.sub}>Add your first task to get started tracking your work.</p>
      <button className={styles.btn} onClick={onAdd}>+ Create your first task</button>
    </div>
  );
}
