import React from 'react';
import { Todo } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit
}) => {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      className="space-y-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
      data-testid="todo-list"
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
