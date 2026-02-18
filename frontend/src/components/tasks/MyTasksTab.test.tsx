import { render, screen, fireEvent } from '@testing-library/react';
import { MyTasksTab } from './MyTasksTab';
import { Todo } from '@/types/todo';

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
  const onLoadMore = jest.fn();
  const onFilterChange = jest.fn();

  const defaultProps = {
    tasks: mockTasks,
    onToggle,
    onDelete,
    onEdit,
    onAddTask,
    onLoadMore,
    hasMore: true,
    loadingMore: false,
    onFilterChange,
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders tasks correctly', () => {
    render(<MyTasksTab {...defaultProps} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByTestId('my-tasks-skeleton')).not.toBeInTheDocument();
  });

  test('renders skeleton when loading', () => {
    render(<MyTasksTab {...defaultProps} loading={true} />);
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
    render(<MyTasksTab {...defaultProps} loadingMore={true} />);
    expect(screen.getByTestId('loading-more')).toBeInTheDocument();
  });

  test('renders sentinel when hasMore is true', () => {
    render(<MyTasksTab {...defaultProps} hasMore={true} />);
    expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument();
  });

  test('does not render sentinel when hasMore is false', () => {
    render(<MyTasksTab {...defaultProps} hasMore={false} />);
    expect(
      screen.queryByTestId('infinite-scroll-sentinel')
    ).not.toBeInTheDocument();
  });
});
