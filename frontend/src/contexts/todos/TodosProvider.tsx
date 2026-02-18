'use client';

import { useReducer, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { todoApi } from '@/services/todoApi';
import {
  Todo,
  TodoFilters,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoSummary,
  WeeklySummary,
  DayOfWeek
} from '@/types/todo';
import { isThisWeek, getDayOfWeek } from '@/utils/date';
import { logger } from '@/utils/logger';
import { TodoContext, TodosContextState } from './TodosContext';

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_LOADING_MORE'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | {
      type: 'SET_DATA';
      payload: { items: Todo[]; totalCount: number; totalPages: number };
    }
  | {
      type: 'APPEND_DATA';
      payload: { items: Todo[]; totalCount: number; totalPages: number };
    }
  | { type: 'SET_SUMMARY'; payload: TodoSummary }
  | { type: 'SET_WEEKLY_SUMMARY'; payload: WeeklySummary }
  | { type: 'SET_FILTERS'; payload: TodoFilters }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'REMOVE_TODO'; payload: string };

const initialState: TodosContextState = {
  todos: [],
  priorityTasks: [],
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  loadingMore: false,
  hasMore: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  summary: {
    total: 0,
    completed: 0,
    pending: 0,
    progress: 0
  },
  weeklySummary: null
};

type IncrementOption = 'up' | 'down';

type UpdateWeeklySummaryOptions = {
  completed?: IncrementOption;
  total?: IncrementOption;
};

const updateWeeklySummary = (
  { ...weeklySummary }: WeeklySummary,
  dayOfWeek: DayOfWeek,
  { completed, total }: UpdateWeeklySummaryOptions
) => {
  const current = { ...weeklySummary[dayOfWeek] };

  if (completed !== undefined) {
    current.completed =
      completed === 'up' ? current.completed + 1 : current.completed - 1;
  }

  if (total !== undefined) {
    current.total = total === 'up' ? current.total + 1 : current.total - 1;
  }

  return {
    ...weeklySummary,
    [dayOfWeek]: current
  };
};

function calculateProgress(completed: number, total: number): number {
  return total === 0 ? 0 : completed / total;
}

function reducer(state: TodosContextState, action: Action): TodosContextState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_LOADING_MORE':
      return { ...state, loadingMore: action.payload };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: action.payload
      };
    case 'SET_DATA':
      return {
        ...state,
        loading: false,
        todos: action.payload.items,
        totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages,
        currentPage: 1,
        hasMore: 1 < action.payload.totalPages
      };
    case 'APPEND_DATA': {
      const nextPage = state.currentPage + 1;
      return {
        ...state,
        loadingMore: false,
        todos: [...state.todos, ...action.payload.items],
        totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages,
        currentPage: nextPage,
        hasMore: nextPage < action.payload.totalPages
      };
    }
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload, loading: false };
    case 'SET_WEEKLY_SUMMARY':
      return { ...state, weeklySummary: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_TODO': {
      const newTotal = state.summary.total + 1;
      const newCompleted = action.payload.isCompleted
        ? state.summary.completed + 1
        : state.summary.completed;

      const newPending = action.payload.isCompleted
        ? state.summary.pending
        : state.summary.pending + 1;

      let newWeeklySummary = state.weeklySummary;

      if (newWeeklySummary) {
        const dayOfWeek = getDayOfWeek(action.payload.createdAt);
        newWeeklySummary = updateWeeklySummary(newWeeklySummary, dayOfWeek, {
          total: 'up'
        });
      }

      return {
        ...state,
        todos: [action.payload, ...state.todos].slice(
          0,
          state.filters.pageSize
        ),
        summary: {
          total: newTotal,
          completed: newCompleted,
          pending: newPending,
          progress: calculateProgress(newCompleted, newTotal)
        },
        weeklySummary: newWeeklySummary
      };
    }
    case 'UPDATE_TODO': {
      const oldTodo = state.todos.find((t) => t.id === action.payload.id);
      let newSummary = state.summary;
      let newWeeklySummary = state.weeklySummary;

      if (oldTodo && oldTodo.isCompleted !== action.payload.isCompleted) {
        const completedDiff = action.payload.isCompleted ? 1 : -1;
        const newCompleted = state.summary.completed + completedDiff;
        const newPending = state.summary.pending - completedDiff;

        newSummary = {
          ...state.summary,
          completed: newCompleted,
          pending: newPending,
          progress: calculateProgress(newCompleted, state.summary.total)
        };

        if (newWeeklySummary && isThisWeek(action.payload.createdAt)) {
          const dayOfWeek = getDayOfWeek(action.payload.createdAt);
          newWeeklySummary = updateWeeklySummary(newWeeklySummary, dayOfWeek, {
            completed: action.payload.isCompleted ? 'up' : 'down'
          });
        }
      }

      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        summary: newSummary,
        weeklySummary: newWeeklySummary
      };
    }
    case 'REMOVE_TODO': {
      const todoToRemove = state.todos.find((t) => t.id === action.payload);
      let newSummary = state.summary;
      let newWeeklySummary = state.weeklySummary;

      if (todoToRemove) {
        const newTotal = Math.max(0, state.summary.total - 1);
        const newCompleted = todoToRemove.isCompleted
          ? Math.max(0, state.summary.completed - 1)
          : state.summary.completed;
        const newPending = !todoToRemove.isCompleted
          ? Math.max(0, state.summary.pending - 1)
          : state.summary.pending;

        newSummary = {
          total: newTotal,
          completed: newCompleted,
          pending: newPending,
          progress: calculateProgress(newCompleted, newTotal)
        };

        if (newWeeklySummary && isThisWeek(todoToRemove.createdAt)) {
          const dayOfWeek = getDayOfWeek(todoToRemove.createdAt);
          const completed = todoToRemove.isCompleted ? 'down' : undefined;
          newWeeklySummary = updateWeeklySummary(newWeeklySummary, dayOfWeek, {
            completed,
            total: 'down'
          });
        }
      }

      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
        summary: newSummary,
        weeklySummary: newWeeklySummary
      };
    }
    default:
      return state;
  }
}

interface TodosProviderProps {
  children: ReactNode;
}

export const TodosProvider = ({ children }: TodosProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFilters = useCallback((filters: TodoFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const getSummary = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const summary = await todoApi.summary();
      dispatch({ type: 'SET_SUMMARY', payload: summary });
    } catch (err) {
      logger.error('Failed to fetch summary', err);
      throw err;
    }
  }, []);

  const getWeeklySummary = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const summary = await todoApi.weeklySummary();
      dispatch({ type: 'SET_WEEKLY_SUMMARY', payload: summary });
    } catch (err) {
      logger.error('Failed to fetch weekly summary', err);
      throw err;
    }
  }, []);

  const fetchTodos = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const data = await todoApi.list({ ...state.filters, page: 1 });
      dispatch({ type: 'SET_DATA', payload: data });
    } catch (err) {
      logger.error('Failed to fetch todos', err, { filters: state.filters });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch todos' });
    }
  }, [state.filters]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    getSummary();
    getWeeklySummary();
  }, [getSummary, getWeeklySummary]);

  const loadMore = useCallback(async () => {
    if (state.loadingMore || !state.hasMore) return;
    dispatch({ type: 'SET_LOADING_MORE', payload: true });
    try {
      const nextPage = state.currentPage + 1;
      const data = await todoApi.list({ ...state.filters, page: nextPage });
      dispatch({ type: 'APPEND_DATA', payload: data });
    } catch (err) {
      logger.error('Failed to load more todos', err, {
        filters: state.filters,
        page: state.currentPage + 1
      });
      dispatch({ type: 'SET_LOADING_MORE', payload: false });
    }
  }, [state.loadingMore, state.hasMore, state.currentPage, state.filters]);

  const createTodo = useCallback(async (request: CreateTodoRequest) => {
    try {
      const newTodo = await todoApi.create(request);
      dispatch({ type: 'ADD_TODO', payload: newTodo });
    } catch (err) {
      logger.error('Failed to create todo', err, { request });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create todo' });
    }
  }, []);

  const updateTodo = useCallback(
    async (id: string, request: UpdateTodoRequest) => {
      try {
        const updated = await todoApi.update(id, request);
        dispatch({ type: 'UPDATE_TODO', payload: updated });
      } catch (err) {
        logger.error('Failed to update todo', err, { id, request });
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update todo' });
      }
    },
    []
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      const todo = state.todos.find((t) => t.id === id);

      if (!todo) {
        logger.error('Failed to toggle todo: not found', { id });
        dispatch({ type: 'SET_ERROR', payload: 'Todo not found' });
        return;
      }

      const toggled = {
        ...todo,
        isCompleted: !todo.isCompleted,
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'UPDATE_TODO', payload: toggled });

      try {
        const updated = await todoApi.toggle(id);
        dispatch({ type: 'UPDATE_TODO', payload: updated });
      } catch (err) {
        dispatch({ type: 'UPDATE_TODO', payload: todo });
        logger.error('Failed to toggle todo', err, { id });
        dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle todo' });
      }
    },
    [state.todos]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      const deleting = state.todos.find((t) => t.id === id);

      if (!deleting) {
        logger.error('Failed to delete todo: not found', { id });
        dispatch({ type: 'SET_ERROR', payload: 'Todo not found' });
        return;
      }

      dispatch({ type: 'REMOVE_TODO', payload: id });
      try {
        await todoApi.delete(id);
        if (
          state.todos.length === 1 &&
          state.filters.page &&
          state.filters.page > 1
        ) {
          setFilters({ page: state.filters.page - 1 });
        } else {
          fetchTodos();
        }
      } catch (err) {
        logger.error('Failed to delete todo', err, { id });
        dispatch({ type: 'ADD_TODO', payload: deleting });
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete todo' });
      }
    },
    [state.todos, state.filters.page, setFilters, fetchTodos]
  );

  const priorityTasks = state.todos
    .filter((t) => !t.isCompleted)
    .sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 5);

  const contextValue = useMemo(
    () => ({
      ...state,
      priorityTasks,
      createTodo,
      updateTodo,
      toggleTodo,
      deleteTodo,
      loadMore,
      setFilters,
      refresh: fetchTodos,
      getSummary,
      getWeeklySummary
    }),
    [
      state,
      priorityTasks,
      createTodo,
      updateTodo,
      toggleTodo,
      deleteTodo,
      loadMore,
      setFilters,
      fetchTodos,
      getSummary,
      getWeeklySummary
    ]
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};
