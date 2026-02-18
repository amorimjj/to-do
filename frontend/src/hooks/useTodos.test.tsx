import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from './useTodos';
import { todoApi } from '@/services/todoApi';
import { Todo, TodoSummary, WeeklySummary } from '@/types/todo';
import { TodosProvider as TodoProvider } from '@/contexts/todos';
import { ReactNode } from 'react';

jest.mock('@/services/todoApi');
const mockedTodoApi = todoApi as jest.Mocked<typeof todoApi>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <TodoProvider>{children}</TodoProvider>
);

describe('useTodos', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Todo 1',
      isCompleted: false,
      priority: 'High',
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T10:00:00Z',
      description: null,
      dueDate: null
    }
  ];

  const mockSummary: TodoSummary = {
    total: 1,
    completed: 0,
    pending: 1,
    progress: 0
  };

  const mockWeeklySummary: WeeklySummary = {
    sunday: { total: 0, completed: 0 },
    monday: { total: 0, completed: 0 },
    tuesday: { total: 0, completed: 0 },
    wednesday: { total: 1, completed: 0 },
    thursday: { total: 0, completed: 0 },
    friday: { total: 0, completed: 0 },
    saturday: { total: 0, completed: 0 }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set fixed date for tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-18T10:00:00Z'));

    mockedTodoApi.list.mockResolvedValue({
      items: mockTodos,
      totalCount: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1
    });
    mockedTodoApi.summary.mockResolvedValue(mockSummary);
    mockedTodoApi.weeklySummary.mockResolvedValue(mockWeeklySummary);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should fetch todos and summary on mount', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.summary).toEqual(mockSummary);
    expect(mockedTodoApi.list).toHaveBeenCalled();
    expect(mockedTodoApi.summary).toHaveBeenCalled();
  });

  test('should handle create todo and update summary', async () => {
    const newTodo: Todo = {
      ...mockTodos[0],
      id: '2',
      title: 'New',
      isCompleted: false
    };
    mockedTodoApi.create.mockResolvedValue(newTodo);

    // First call for mount, second for refresh after create
    mockedTodoApi.list
      .mockResolvedValueOnce({
        items: mockTodos,
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      })
      .mockResolvedValueOnce({
        items: [newTodo, ...mockTodos],
        totalCount: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1
      });

    const { result } = renderHook(() => useTodos(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createTodo({ title: 'New', priority: 'High' });
    });

    expect(result.current.summary.total).toBe(2);
    expect(result.current.summary.pending).toBe(2);
    expect(result.current.summary.progress).toBe(0);
  });

  test('should handle toggle todo and update summary', async () => {
    const toggledTodo: Todo = { ...mockTodos[0], isCompleted: true };
    mockedTodoApi.toggle.mockResolvedValue(toggledTodo);

    const { result } = renderHook(() => useTodos(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleTodo('1');
    });

    expect(result.current.summary.completed).toBe(1);
    expect(result.current.summary.pending).toBe(0);
    expect(result.current.summary.progress).toBe(1);
  });

  test('should handle delete todo and update summary', async () => {
    mockedTodoApi.delete.mockResolvedValue(undefined);

    // First call for mount, second for refresh after delete
    mockedTodoApi.list
      .mockResolvedValueOnce({
        items: mockTodos,
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      })
      .mockResolvedValueOnce({
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      });

    const { result } = renderHook(() => useTodos(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos).toHaveLength(1);

    await act(async () => {
      await result.current.deleteTodo('1');
    });

    expect(result.current.summary.total).toBe(0);
    expect(result.current.summary.pending).toBe(0);
    expect(result.current.summary.progress).toBe(0);
  });

  describe('getSummary', () => {
    test('returns summary with progress from API and updates state', async () => {
      const summary: TodoSummary = {
        total: 10,
        completed: 4,
        pending: 6,
        progress: 0.4
      };
      mockedTodoApi.summary.mockResolvedValue(summary);

      const { result } = renderHook(() => useTodos(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.getSummary();
      });

      expect(mockedTodoApi.summary).toHaveBeenCalled();
      expect(result.current.summary).toEqual(summary);
    });
  });

  describe('weeklySummary', () => {
    test('should update weekly summary when a new todo is created', async () => {
      const newTodo: Todo = {
        id: '2',
        title: 'New Todo',
        isCompleted: false,
        priority: 'High',
        createdAt: '2026-02-18T12:00:00Z',
        updatedAt: '2026-02-18T12:00:00Z',
        description: null,
        dueDate: null
      };
      mockedTodoApi.create.mockResolvedValue(newTodo);

      const { result } = renderHook(() => useTodos(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.createTodo({ title: 'New Todo', priority: 'High' });
      });

      expect(result.current.weeklySummary?.wednesday.total).toBe(2);
    });

    test('should update weekly summary when a todo is toggled (current week)', async () => {
      const toggledTodo: Todo = { ...mockTodos[0], isCompleted: true };
      mockedTodoApi.toggle.mockResolvedValue(toggledTodo);

      const { result } = renderHook(() => useTodos(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.toggleTodo('1');
      });

      expect(result.current.weeklySummary?.wednesday.completed).toBe(1);
    });

    test('should update weekly summary when a todo is deleted (current week)', async () => {
      mockedTodoApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTodos(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.deleteTodo('1');
      });

      expect(result.current.weeklySummary?.wednesday.total).toBe(0);
    });

    test('should not update weekly summary when an old todo is toggled', async () => {
      const oldTodo: Todo = {
        ...mockTodos[0],
        id: 'old-1',
        createdAt: '2025-01-01T10:00:00Z'
      };
      const toggledOldTodo: Todo = { ...oldTodo, isCompleted: true };
      mockedTodoApi.toggle.mockResolvedValue(toggledOldTodo);
      
      // Update mockTodos for this test
      mockedTodoApi.list.mockResolvedValue({
        items: [oldTodo],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      });

      const { result } = renderHook(() => useTodos(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.toggleTodo('old-1');
      });

      // Wednesday should still be 1 (from initial mockWeeklySummary)
      expect(result.current.weeklySummary?.wednesday.completed).toBe(0);
    });
  });
});
