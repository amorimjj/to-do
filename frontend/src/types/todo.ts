export type Priority = 'Low' | 'Medium' | 'High';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodoSummary {
  total: number;
  completed: number;
  pending: number;
  progress: number;
}

export interface DaySummary {
  total: number;
  completed: number;
}

export interface WeeklySummary {
  sunday: DaySummary;
  monday: DaySummary;
  tuesday: DaySummary;
  wednesday: DaySummary;
  thursday: DaySummary;
  friday: DaySummary;
  saturday: DaySummary;
}

export type DayOfWeek = keyof WeeklySummary;

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface TodoFilters {
  isCompleted?: boolean;
  priority?: Priority;
  sortBy?: 'title' | 'dueDate' | 'priority' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface CreateTodoRequest {
  title: string;
  description?: string | null;
  priority: Priority;
  dueDate?: string | null;
}

export interface UpdateTodoRequest {
  title: string;
  description?: string | null;
  priority: Priority;
  dueDate?: string | null;
  isCompleted: boolean;
}
