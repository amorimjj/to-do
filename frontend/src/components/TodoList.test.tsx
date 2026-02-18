import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from './TodoList';
import { Todo } from '@/types/todo';

const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Task 1',
    isCompleted: false,
    priority: 'Medium',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    description: 'Desc 1',
    dueDate: null
  },
  {
    id: '2',
    title: 'Task 2',
    isCompleted: true,
    priority: 'High',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    description: null,
    dueDate: null
  }
];

describe('TodoList', () => {
  const onToggle = jest.fn();
  const onDelete = jest.fn();
  const onEdit = jest.fn();

  test('renders tasks correctly', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  test('calls onToggle when checkbox clicked', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    const toggleButtons = screen.getAllByTestId('todo-toggle');
    fireEvent.click(toggleButtons[0]);

    expect(onToggle).toHaveBeenCalledWith('1');
  });

  test('renders empty state when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
