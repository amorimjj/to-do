'use client';

import { useContext } from 'react';
import { TodoContext } from '@/contexts/todos';

export function useTodos() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }

  return context;
}
