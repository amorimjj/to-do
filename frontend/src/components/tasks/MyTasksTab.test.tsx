import { render, screen, fireEvent } from '@testing-library/react';
import { MyTasksTab } from './MyTasksTab';
import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';

// Mock useTodos hook
jest.mock('@/hooks/useTodos');
const mockedUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;

const mockTasks: Todo[] = [
  {
    id: '1',
    title: 'Task 1',
    description: null,
    isCompleted: false,
    priority: 'Medium',
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Task 2',
    description: null,
    isCompleted: true,
    priority: 'High',
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock IntersectionObserver
(global as any).IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

describe('MyTasksTab', () => {
  const onToggle = jest.fn();
  const onDelete = jest.fn();
  const onEdit = jest.fn();
  const onAddTask = jest.fn();
  const onFilterChange = jest.fn();

  const defaultProps = {
    onToggle,
    onDelete,
    onEdit,
    onAddTask,
    onFilterChange
  };

  const defaultMockReturn = {
    todos: mockTasks,
    loadingMore: false,
    loading: false,
    hasMore: true,
    loadMore: jest.fn(),
    priorityTasks: [],
    totalCount: 2,
    totalPages: 1,
    currentPage: 1,
    error: null,
    filters: {},
    summary: { total: 2, completed: 1, pending: 1, progress: 0.5 },
    weeklySummary: null,
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    toggleTodo: jest.fn(),
    deleteTodo: jest.fn(),
    setFilters: jest.fn(),
    refresh: jest.fn(),
    getSummary: jest.fn(),
    getWeeklySummary: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseTodos.mockReturnValue(defaultMockReturn as any);
  });

  test('renders tasks correctly', () => {
    render(<MyTasksTab {...defaultProps} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByTestId('my-tasks-skeleton')).not.toBeInTheDocument();
  });

  test('renders skeleton when loading', () => {
    mockedUseTodos.mockReturnValue({
      ...defaultMockReturn,
      loading: true,
      todos: []
    } as any);
    render(<MyTasksTab {...defaultProps} />);
    expect(screen.getByTestId('my-tasks-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  test('calls onFilterChange when filter tabs clicked', () => {
    render(<MyTasksTab {...defaultProps} />);

    const completedTab = screen.getByTestId('filter-completed');
    fireEvent.click(completedTab);

    expect(onFilterChange).toHaveBeenCalledWith(true);

    const pendingTab = screen.getByTestId('filter-pending');
    fireEvent.click(pendingTab);

    expect(onFilterChange).toHaveBeenCalledWith(false);

    const allTab = screen.getByTestId('filter-all');
    fireEvent.click(allTab);

    expect(onFilterChange).toHaveBeenCalledWith(undefined);
  });

  test('shows loading spinner when loadingMore is true', () => {
    mockedUseTodos.mockReturnValue({
      ...defaultMockReturn,
      loadingMore: true
    } as any);
    render(<MyTasksTab {...defaultProps} />);
    expect(screen.getByTestId('loading-more')).toBeInTheDocument();
  });

  test('renders sentinel when hasMore is true', () => {
    mockedUseTodos.mockReturnValue({
      ...defaultMockReturn,
      hasMore: true
    } as any);
    render(<MyTasksTab {...defaultProps} />);
    expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument();
  });

  test('does not render sentinel when hasMore is false', () => {
    mockedUseTodos.mockReturnValue({
      ...defaultMockReturn,
      hasMore: false
    } as any);
    render(<MyTasksTab {...defaultProps} />);
    expect(
      screen.queryByTestId('infinite-scroll-sentinel')
    ).not.toBeInTheDocument();
  });

  test('calls onQuickAdd when form submitted', () => {
    const onQuickAdd = jest.fn();
    render(<MyTasksTab {...defaultProps} onQuickAdd={onQuickAdd} />);

    const input = screen.getByTestId('my-tasks-quick-add');
    fireEvent.change(input, { target: { value: 'New Task' } });

    const submitButton = screen.getByTestId('my-tasks-quick-add-submit');
    fireEvent.click(submitButton);

    expect(onQuickAdd).toHaveBeenCalledWith('New Task');
    expect(input).toHaveValue('');
  });

  test('calls onAddTask when button clicked and onQuickAdd not provided', () => {
    render(<MyTasksTab {...defaultProps} />);

    const addButton = screen.getByTestId('my-tasks-add-button');
    fireEvent.click(addButton);

    expect(onAddTask).toHaveBeenCalled();
  });
});
