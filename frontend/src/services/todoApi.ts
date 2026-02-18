import axios, { AxiosError } from 'axios';
import { ENV } from '@/config/env';
import {
  CreateTodoRequest,
  PagedResponse,
  Todo,
  TodoFilters,
  TodoSummary,
  UpdateTodoRequest,
  WeeklySummary
} from '@/types/todo';
import { logger } from '../utils/logger';

const api = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

type TodoSummaryApiResponse = {
  Total?: number;
  Completed?: number;
  Pending?: number;
  total?: number;
  completed?: number;
  pending?: number;
};

const mapSummaryResponse = (raw: TodoSummaryApiResponse): TodoSummary => {
  const total = raw.Total ?? raw.total ?? 0;
  const completed = raw.Completed ?? raw.completed ?? 0;
  const pending = raw.Pending ?? raw.pending ?? 0;
  const progress = total === 0 ? 0 : completed / total;
  return { total, completed, pending, progress };
};

type DaySummaryApiResponse = {
  Total?: number;
  Completed?: number;
  total?: number;
  completed?: number;
};

type WeeklySummaryApiResponse = {
  Sunday?: DaySummaryApiResponse;
  Monday?: DaySummaryApiResponse;
  Tuesday?: DaySummaryApiResponse;
  Wednesday?: DaySummaryApiResponse;
  Thursday?: DaySummaryApiResponse;
  Friday?: DaySummaryApiResponse;
  Saturday?: DaySummaryApiResponse;
  sunday?: DaySummaryApiResponse;
  monday?: DaySummaryApiResponse;
  tuesday?: DaySummaryApiResponse;
  wednesday?: DaySummaryApiResponse;
  thursday?: DaySummaryApiResponse;
  friday?: DaySummaryApiResponse;
  saturday?: DaySummaryApiResponse;
};

const mapDaySummaryResponse = (raw: DaySummaryApiResponse = {}) => ({
  total: raw.Total ?? raw.total ?? 0,
  completed: raw.Completed ?? raw.completed ?? 0
});

const mapWeeklySummaryResponse = (
  raw: WeeklySummaryApiResponse
): WeeklySummary => {
  return {
    sunday: mapDaySummaryResponse(raw.Sunday ?? raw.sunday),
    monday: mapDaySummaryResponse(raw.Monday ?? raw.monday),
    tuesday: mapDaySummaryResponse(raw.Tuesday ?? raw.tuesday),
    wednesday: mapDaySummaryResponse(raw.Wednesday ?? raw.wednesday),
    thursday: mapDaySummaryResponse(raw.Thursday ?? raw.thursday),
    friday: mapDaySummaryResponse(raw.Friday ?? raw.friday),
    saturday: mapDaySummaryResponse(raw.Saturday ?? raw.saturday)
  };
};

export const todoApi = {
  list: async (filters: TodoFilters): Promise<PagedResponse<Todo>> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize)
      params.append('pageSize', filters.pageSize.toString());
    if (filters.isCompleted !== undefined)
      params.append('isCompleted', filters.isCompleted.toString());
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

  summary: async (): Promise<TodoSummary> => {
    const response = await api.get<TodoSummaryApiResponse>('/todos/summary');
    return mapSummaryResponse(response.data);
  },

  weeklySummary: async (): Promise<WeeklySummary> => {
    const response = await api.get<WeeklySummaryApiResponse>(
      '/todos/weekly-summary'
    );
    return mapWeeklySummaryResponse(response.data);
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
  }
};
