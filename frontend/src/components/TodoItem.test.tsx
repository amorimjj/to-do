import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/types/todo';

const mockTodo: Todo = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  isCompleted: false,
  priority: 'Medium',
  dueDate: '2026-03-01T12:00:00Z',
  createdAt: '2026-02-18T10:00:00Z',
  updatedAt: '2026-02-18T10:00:00Z'
};

describe('TodoItem', () => {
  const onToggle = jest.fn();
  const onDelete = jest.fn();
  const onEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo details correctly', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Mar 1, 2026')).toBeInTheDocument();
  });

  test('calls onToggle when toggle button clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    const toggleButton = screen.getByTestId('todo-toggle');
    fireEvent.click(toggleButton);

    expect(onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  test('calls onDelete when delete button clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    const deleteButton = screen.getByTestId('todo-delete');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  test('calls onEdit when edit button clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    const editButton = screen.getByTestId('todo-edit');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockTodo);
  });

  test('renders completed state correctly', () => {
    const completedTodo = { ...mockTodo, isCompleted: true };
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    const title = screen.getByText('Test Task');
    expect(title).toHaveAttribute('data-completed', 'true');
    expect(title).toHaveClass('data-[completed=true]:line-through');
  });

  test('renders different priority colors', () => {
    const highPriorityTodo = { ...mockTodo, priority: 'High' as const };
    const { rerender } = render(
      <TodoItem
        todo={highPriorityTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.getByText('High')).toHaveClass('bg-rose-100');

    const lowPriorityTodo = { ...mockTodo, priority: 'Low' as const };
    rerender(
      <TodoItem
        todo={lowPriorityTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    expect(screen.getByText('Low')).toHaveClass('bg-blue-100');
  });

  test('does not render due date if not provided', () => {
    const noDateTodo = { ...mockTodo, dueDate: null };
    render(
      <TodoItem
        todo={noDateTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.queryByText(/Mar 1, 2026/)).not.toBeInTheDocument();
  });

  test('does not render description if not provided', () => {
    const noDescTodo = { ...mockTodo, description: null };
    render(
      <TodoItem
        todo={noDescTodo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });
});
