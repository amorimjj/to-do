import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoForm } from './TodoForm';
import { useTodos } from '@/hooks/useTodos';

// Mock useTodos hook
jest.mock('@/hooks/useTodos');

describe('TodoForm', () => {
  const mockCreateTodo = jest.fn();
  const mockUpdateTodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTodos as jest.MockedFunction<typeof useTodos>).mockReturnValue({
      createTodo: mockCreateTodo,
      updateTodo: mockUpdateTodo,
      loading: false,
      todos: [],
      totalCount: 0,
      totalPages: 0,
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
      toggleTodo: jest.fn(),
      deleteTodo: jest.fn(),
      setFilters: jest.fn(),
      refresh: jest.fn(),
      getSummary: jest.fn()
    });
  });

  test('submits form with title and priority', async () => {
    render(<TodoForm />);

    const input = screen.getByTestId('todo-input-title');
    const submitBtn = screen.getByTestId('todo-submit');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          priority: 'Medium'
        })
      );
    });
  });

  test('validates required title', () => {
    render(<TodoForm />);

    const submitBtn = screen.getByTestId('todo-submit');
    expect(submitBtn).toBeDisabled();
  });

  test('submits form with existing data (edit)', async () => {
    const initialData = {
      id: '1',
      title: 'Old Task',
      description: 'Old Description',
      priority: 'Low' as const,
      isCompleted: false,
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    render(<TodoForm initialData={initialData} />);

    const input = screen.getByTestId('todo-input-title');
    const submitBtn = screen.getByTestId('todo-submit');

    expect(input).toHaveValue('Old Task');

    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          title: 'Updated Task',
          priority: 'Low'
        })
      );
    });
  });
});
