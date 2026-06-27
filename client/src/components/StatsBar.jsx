import { useState, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import styles from './StatsBar.module.css';

function AnimatedCount({ value }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        prev.current = end;
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);

  return <span className={styles.countNum}>{display}</span>;
}

export default function StatsBar() {
  const { stats, filters, setFilters } = useTasks();

  const getCount = (status) =>
    stats.stats.find((s) => s._id === status)?.count || 0;

  const items = [
    { key: 'all', label: 'All Tasks', count: stats.total, color: '#6c63ff', emoji: '📋' },
    { key: 'pending', label: 'Pending', count: getCount('pending'), color: '#d97706', emoji: '🕐' },
    { key: 'in-progress', label: 'In Progress', count: getCount('in-progress'), color: '#2563eb', emoji: '🔄' },
    { key: 'completed', label: 'Completed', count: getCount('completed'), color: '#16a34a', emoji: '✅' },
  ];

  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <button
          key={item.key}
          className={`${styles.card} ${filters.status === item.key || (item.key === 'all' && filters.status === 'all') ? styles.active : ''}`}
          onClick={() => setFilters({ status: item.key })}
          style={{ '--card-color': item.color, '--card-index': i }}
        >
          <span className={styles.emoji}>{item.emoji}</span>
          <span className={styles.count}>
            <AnimatedCount value={item.count} />
          </span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
