import { useState, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { differenceInDays, format, startOfToday } from 'date-fns';
import { TaskProvider, useTasks } from './context/TaskContext';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import styles from './App.module.css';

const motivationalQuotes = [
  "Progress, not perfection.",
  "Small steps every day.",
  "Consistency beats intensity.",
  "Momentum creates results.",
  "Done is better than perfect.",
  "Focus on progress.",
  "One task at a time.",
  "Discipline creates freedom.",
];

function getMicrocopy(count) {
  if (count === 0) return "Ready to launch your productivity 🚀";
  if (count <= 3)  return "Small steps. Big progress.";
  return "Momentum is building.";
}

function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const today = startOfToday();
      const lastActiveStr = localStorage.getItem('taskflow_last_active');
      const currentStreak = parseInt(localStorage.getItem('taskflow_streak') || '0', 10);

      if (!lastActiveStr) {
        localStorage.setItem('taskflow_last_active', today.toISOString());
        localStorage.setItem('taskflow_streak', '1');
        setStreak(1);
        return;
      }

      const lastActive = new Date(lastActiveStr);
      const diff = differenceInDays(today, lastActive);

      if (diff === 0) {
        setStreak(currentStreak);
      } else if (diff === 1) {
        const newStreak = currentStreak + 1;
        localStorage.setItem('taskflow_last_active', today.toISOString());
        localStorage.setItem('taskflow_streak', newStreak.toString());
        setStreak(newStreak);
      } else {
        localStorage.setItem('taskflow_last_active', today.toISOString());
        localStorage.setItem('taskflow_streak', '1');
        setStreak(1);
      }
    } catch (e) {
      setStreak(1);
    }
  }, []);

  return streak;
}

function TaskBoard() {
  const { tasks, loading, loadTasks, removeTask, filters } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmTask, setConfirmTask] = useState(null);
  const streakCount = useStreak();

  useEffect(() => { loadTasks(); }, []);

  const dailyQuote = useMemo(
    () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
    []
  );

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const handleDeleteRequest = (task) => setConfirmTask(task);
  const handleConfirmDelete = async () => {
    if (confirmTask) {
      await removeTask(confirmTask._id);
      setConfirmTask(null);
    }
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.priority !== 'all';
  const isFilteredEmpty = !loading && tasks.length === 0 && hasActiveFilters;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>🚀</div>
            <span className={styles.brandName}>TaskFlow</span>
          </div>
          <div className={styles.headerRight}>
            {streakCount > 0 && (
              <div className={styles.streakBadge} title={`${streakCount} day productivity streak`}>
                <span className={styles.streakFire}>🔥</span>
                <span className={styles.streakCount}>{streakCount} {streakCount === 1 ? 'day' : 'days'}</span>
              </div>
            )}
            <span className={styles.taskCount}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
            <button className={styles.addBtn} onClick={openCreate}>
              + New Task
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.microcopy}>{getMicrocopy(tasks.length)}</div>

        <StatsBar />
        <FilterBar />

        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>
            {loading ? 'Loading...' : (
              <>
                Results
                <span className={styles.countPill}>{tasks.length}</span>
              </>
            )}
          </span>
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeleton} style={{ '--skel-index': i }} />
            ))}
          </div>
        ) : isFilteredEmpty ? (
          <div className={styles.filteredEmpty}>
            <span className={styles.filteredEmoji}>🔍</span>
            <h3 className={styles.filteredTitle}>No matching tasks found</h3>
            <p className={styles.filteredSub}>Try adjusting your filters or search terms.</p>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState onAdd={openCreate} />
        ) : (
          <div className={styles.grid}>
            {tasks.map((task, i) => (
              <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={handleDeleteRequest} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerQuote}>"{dailyQuote}"</p>
      </footer>

      {modalOpen && <TaskModal task={editingTask} onClose={closeModal} />}

      {confirmTask && (
        <ConfirmModal
          task={confirmTask}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTask(null)}
        />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#1a1a2e',
            border: '1px solid #e8e6f0',
            borderRadius: '10px',
            fontSize: '0.875rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <TaskBoard />
    </TaskProvider>
  );
}
