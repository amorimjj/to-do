'use client';

import { createContext } from 'react';
import {
  Todo,
  TodoFilters,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoSummary,
  WeeklySummary
} from '@/types/todo';

export interface TodosContextState {
  todos: Todo[];
  priorityTasks: Todo[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  filters: TodoFilters;
  summary: TodoSummary;
  weeklySummary: WeeklySummary | null;
}

export interface TodosContextValue extends TodosContextState {
  createTodo: (request: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, request: UpdateTodoRequest) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (filters: TodoFilters) => void;
  refresh: () => Promise<void>;
  getSummary: () => Promise<void>;
  getWeeklySummary: () => Promise<void>;
}

export const TodoContext = createContext<TodosContextValue | null>(null);
