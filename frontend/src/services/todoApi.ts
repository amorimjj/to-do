import axios, { AxiosError } from 'axios';
import { CreateTodoRequest, PagedResponse, Todo, TodoFilters, UpdateTodoRequest } from '@/types/todo';
import { logger } from './logger';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Trace all API errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    logger.error('API Error', error, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const todoApi = {
  list: async (filters: TodoFilters): Promise<PagedResponse<Todo>> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.isCompleted !== undefined) params.append('isCompleted', filters.isCompleted.toString());
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await api.get<PagedResponse<Todo>>('/todos', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  create: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  toggle: async (id: string): Promise<Todo> => {
    const response = await api.patch<Todo>(`/todos/${id}/toggle`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};
