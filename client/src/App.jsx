import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { TaskProvider, useTasks } from './context/TaskContext';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import styles from './App.module.css';

function TaskBoard() {
  const { tasks, loading, loadTasks, removeTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmTask, setConfirmTask] = useState(null);

  useEffect(() => { loadTasks(); }, []);

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

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>⚡</div>
            <span className={styles.brandName}>TaskFlow</span>
          </div>
          <div className={styles.headerRight}>
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
        <StatsBar />
        <FilterBar />

        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>
            {loading ? 'Loading...' : `${tasks.length} result${tasks.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState onAdd={openCreate} />
        ) : (
          <div className={styles.grid}>
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={handleDeleteRequest} />
            ))}
          </div>
        )}
      </main>

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
