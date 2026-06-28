import styles from './EmptyState.module.css';

export default function EmptyState({ onAdd }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.illustration}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.clipboardIcon}>
          <div className={styles.clipTop} />
          <div className={styles.clipBody}>
            <div className={styles.clipLine} />
            <div className={styles.clipLineShort} />
            <div className={styles.clipLine} />
          </div>
        </div>
      </div>
      <h3 className={styles.title}>Ready to launch your productivity 🚀</h3>
      <p className={styles.sub}>Create your first task and start building momentum.</p>
      <button className={styles.btn} onClick={onAdd}>
        + Create your first task
        <span className={styles.btnArrow}>→</span>
      </button>
    </div>
  );
}
