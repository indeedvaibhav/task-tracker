import { useTasks } from '../context/TaskContext';
import styles from './StatsBar.module.css';

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
      {items.map((item) => (
        <button
          key={item.key}
          className={`${styles.card} ${filters.status === item.key || (item.key === 'all' && filters.status === 'all') ? styles.active : ''}`}
          onClick={() => setFilters({ status: item.key })}
          style={{ '--card-color': item.color }}
        >
          <span className={styles.emoji}>{item.emoji}</span>
          <span className={styles.count}>{item.count}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
