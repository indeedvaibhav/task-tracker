import { useTasks } from '../context/TaskContext';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from './FilterBar.module.css';

export default function FilterBar() {
  const { filters, setFilters } = useTasks();

  const clearSearch = () => setFilters({ search: '' });

  return (
    <div className={styles.bar}>
      <div className={styles.searchWrapper}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className={styles.searchInput}
        />
        {filters.search && (
          <button className={styles.clearBtn} onClick={clearSearch}>
            <FiX size={14} />
          </button>
        )}
      </div>

      <div className={styles.selects}>
        <div className={styles.selectGroup}>
          <label className={styles.selectLabel}>Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value })}
            className={styles.select}
          >
            <option value="all">All</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className={styles.selectGroup}>
          <label className={styles.selectLabel}>Sort by</label>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ sort: e.target.value })}
            className={styles.select}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
    </div>
  );
}
