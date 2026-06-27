import { format, isPast, isToday } from 'date-fns';
import { FiEdit2, FiTrash2, FiCalendar, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import styles from './TaskCard.module.css';

const priorityConfig = {
  high:   { label: 'High',   color: '#dc2626', bg: '#fee2e2', dot: '🔴' },
  medium: { label: 'Medium', color: '#d97706', bg: '#fef3c7', dot: '🟡' },
  low:    { label: 'Low',    color: '#16a34a', bg: '#dcfce7', dot: '🟢' },
};

const statusConfig = {
  pending:       { label: 'Pending',     color: '#d97706', bg: '#fef3c7', icon: FiCircle },
  'in-progress': { label: 'In Progress', color: '#2563eb', bg: '#dbeafe', icon: FiClock },
  completed:     { label: 'Completed',   color: '#16a34a', bg: '#dcfce7', icon: FiCheckCircle },
};

const statusCycle = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
const cycleLabel  = { pending: 'Mark In Progress', 'in-progress': 'Mark Completed', completed: 'Reset to Pending' };

export default function TaskCard({ task, onEdit, onDelete }) {
  const { editTask } = useTasks();

  const pri = priorityConfig[task.priority] || priorityConfig.medium;
  const sta = statusConfig[task.status]     || statusConfig.pending;
  const StatusIcon = sta.icon;

  const isOverdue  = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const cycleStatus = () => editTask(task._id, {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    status: statusCycle[task.status]
  });

  return (
    <div className={`${styles.card} ${task.status === 'completed' ? styles.cardCompleted : ''}`}>
      <div className={styles.priorityStripe} style={{ background: pri.color }} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.priorityBadge} style={{ color: pri.color, background: pri.bg }}>
            {pri.dot} {pri.label}
          </span>
          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={() => onEdit(task)} title="Edit task">
              <FiEdit2 size={13} /> Edit
            </button>
            <button className={styles.deleteBtn} onClick={() => onDelete(task)} title="Delete task">
              <FiTrash2 size={13} />
            </button>
          </div>
        </div>

        <h3 className={`${styles.title} ${task.status === 'completed' ? styles.titleDone : ''}`}>
          {task.title}
        </h3>

        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.footer}>
          {task.dueDate ? (
            <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : isDueToday ? styles.dueToday : ''}`}>
              <FiCalendar size={11} />
              {isOverdue ? 'Overdue · ' : isDueToday ? 'Today · ' : ''}
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          ) : <span />}

          <button
            className={styles.statusBtn}
            style={{ color: sta.color, background: sta.bg }}
            onClick={cycleStatus}
            title={cycleLabel[task.status]}
          >
            <StatusIcon size={12} />
            {sta.label}
          </button>
        </div>
      </div>
    </div>
  );
}
