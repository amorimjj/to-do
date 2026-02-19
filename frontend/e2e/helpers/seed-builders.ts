import { Todo, Priority } from '../types/todo';

export type TodoSeed = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const buildTodo = (overrides?: Partial<TodoSeed>): TodoSeed => ({
  id: crypto.randomUUID(),
  title: 'Default Task',
  description: 'Default Description',
  isCompleted: false,
  priority: 'Medium',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});
