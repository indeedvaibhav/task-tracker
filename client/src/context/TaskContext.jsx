import { createContext, useContext, useReducer, useCallback } from 'react';
import { getTasks as fetchTasks, createTask, updateTask, deleteTask, getStats } from '../utils/api';
import toast from 'react-hot-toast';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  stats: { total: 0, stats: [] },
  loading: false,
  filters: { status: 'all', priority: 'all', sort: 'newest', search: '' },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_TASKS': return { ...state, tasks: action.payload, loading: false };
    case 'SET_STATS': return { ...state, stats: action.payload };
    case 'SET_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload } };
    default: return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadTasks = useCallback(async (filters = state.filters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.sort) params.sort = filters.sort;
      if (filters.search) params.search = filters.search;

      const [tasksRes, statsRes] = await Promise.all([
        fetchTasks(params),
        getStats(),
      ]);
      dispatch({ type: 'SET_TASKS', payload: tasksRes.data.data });
      dispatch({ type: 'SET_STATS', payload: statsRes.data.data });
    } catch {
      toast.error('Failed to load tasks');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters]);

  const addTask = async (data) => {
    const toastId = toast.loading('Creating task...');
    try {
      await createTask(data);
      toast.success('Task created!', { id: toastId });
      await loadTasks();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task', { id: toastId });
      return false;
    }
  };

  const editTask = async (id, data) => {
    const toastId = toast.loading('Updating task...');
    try {
      await updateTask(id, data);
      toast.success('Task updated!', { id: toastId });
      await loadTasks();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task', { id: toastId });
      return false;
    }
  };

  const removeTask = async (id) => {
    const toastId = toast.loading('Deleting task...');
    try {
      await deleteTask(id);
      toast.success('Task deleted', { id: toastId });
      await loadTasks();
    } catch {
      toast.error('Failed to delete task', { id: toastId });
    }
  };

  const setFilters = (newFilters) => {
    const updated = { ...state.filters, ...newFilters };
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
    loadTasks(updated);
  };

  return (
    <TaskContext.Provider value={{ ...state, loadTasks, addTask, editTask, removeTask, setFilters }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
