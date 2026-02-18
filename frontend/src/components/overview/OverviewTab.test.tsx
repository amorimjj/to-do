import { render, screen, fireEvent } from '@testing-library/react';
import { OverviewTab } from './OverviewTab';
import { useTodos } from '@/hooks/useTodos';
import { Todo } from '@/types/todo';
import { TaskWithCategory } from '@/data/mockTasks';

// Mock dependencies
jest.mock('@/hooks/useTodos');
jest.mock('@/components/DailyActivity', () => ({
  DailyActivity: () => <div data-testid="daily-activity" />
}));

const mockUseTodos = useTodos as jest.Mock;

describe('OverviewTab', () => {
  const mockSummary = {
    total: 10,
    completed: 4,
    pending: 6,
    progress: 0.4
  };

  const mockTasks: TaskWithCategory[] = [
    {
      id: '1',
      title: 'High Priority Task',
      priority: 'High',
      isCompleted: false,
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T10:00:00Z',
      description: null,
      dueDate: null,
      category: 'Work'
    },
    {
      id: '2',
      title: 'Medium Priority Task',
      priority: 'Medium',
      isCompleted: false,
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T10:00:00Z',
      description: null,
      dueDate: null,
      category: 'Work'
    },
    {
      id: '3',
      title: 'Low Priority Task',
      priority: 'Low',
      isCompleted: false,
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T10:00:00Z',
      description: null,
      dueDate: null,
      category: 'Personal'
    },
    {
      id: '4',
      title: 'Completed Task',
      priority: 'High',
      isCompleted: true,
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T10:00:00Z',
      description: null,
      dueDate: null,
      category: 'Work'
    }
  ];

  const defaultProps = {
    userName: 'John Doe',
    onViewAllTasks: jest.fn(),
    onCreateTask: jest.fn(),
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTodos.mockReturnValue({
      summary: mockSummary,
      loading: false,
      priorityTasks: mockTasks.filter(t => !t.isCompleted).sort((a, b) => {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority as keyof typeof order] || 0) - (order[b.priority as keyof typeof order] || 0);
      }).slice(0, 5)
    });
    // Default system time to morning
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-18T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders correctly with user name and pending count', () => {
    // Set to 10 AM local time
    jest.setSystemTime(new Date(2026, 1, 18, 10, 0, 0));
    render(<OverviewTab {...defaultProps} />);

    expect(screen.getByText(/Good morning, John Doe!/)).toBeInTheDocument();
    expect(screen.getByText(/You have 6 tasks to complete today./)).toBeInTheDocument();
  });

  test('displays correct greeting for afternoon', () => {
    // Set to 2 PM local time
    jest.setSystemTime(new Date(2026, 1, 18, 14, 0, 0));
    render(<OverviewTab {...defaultProps} />);
    expect(screen.getByText(/Good afternoon, John Doe!/)).toBeInTheDocument();
  });

  test('displays correct greeting for evening', () => {
    // Set to 8 PM local time
    jest.setSystemTime(new Date(2026, 1, 18, 20, 0, 0));
    render(<OverviewTab {...defaultProps} />);
    expect(screen.getByText(/Good evening, John Doe!/)).toBeInTheDocument();
  });

  test('displays summary stats correctly', () => {
    render(<OverviewTab {...defaultProps} />);

    expect(screen.getByTestId('stats-total')).toHaveTextContent('10');
    expect(screen.getByTestId('stats-completed')).toHaveTextContent('4');
    expect(screen.getByTestId('stats-pending')).toHaveTextContent('6');
    expect(screen.getByTestId('stats-progress')).toHaveTextContent('40%');
  });

  test('lists priority tasks correctly sorted and filtered', () => {
    render(<OverviewTab {...defaultProps} />);

    const todoItems = screen.getAllByTestId(/todo-item-/);
    // There are 3 incomplete tasks in mockTasks
    expect(todoItems).toHaveLength(3);

    // Check order: High -> Medium -> Low
    expect(todoItems[0]).toHaveTextContent('High Priority Task');
    expect(todoItems[1]).toHaveTextContent('Medium Priority Task');
    expect(todoItems[2]).toHaveTextContent('Low Priority Task');
  });

  test('shows empty state when no pending tasks', () => {
    mockUseTodos.mockReturnValueOnce({
      summary: { total: 0, completed: 0, pending: 0, progress: 0 },
      loading: false,
      priorityTasks: []
    });
    render(<OverviewTab {...defaultProps} />);

    expect(screen.getByTestId('priority-tasks-empty')).toBeInTheDocument();
    expect(screen.getByText('No pending tasks')).toBeInTheDocument();
  });

  test('calls onViewAllTasks when view all button is clicked', () => {
    render(<OverviewTab {...defaultProps} />);
    fireEvent.click(screen.getByTestId('overview-view-all'));
    expect(defaultProps.onViewAllTasks).toHaveBeenCalledTimes(1);
  });

  test('calls onCreateTask when create buttons are clicked', () => {
    render(<OverviewTab {...defaultProps} />);
    
    // There are two create task triggers in the component
    const createCta = screen.getByTestId('create-task-cta');
    const plusButton = createCta.querySelector('button');
    const getStartedButton = screen.getByTestId('overview-get-started');

    if (plusButton) fireEvent.click(plusButton);
    expect(defaultProps.onCreateTask).toHaveBeenCalledTimes(1);

    fireEvent.click(getStartedButton);
    expect(defaultProps.onCreateTask).toHaveBeenCalledTimes(2);
  });

  test('calls onToggle, onDelete, onEdit when interactions happen on TodoItem', () => {
    render(<OverviewTab {...defaultProps} />);
    
    // For the first todo item (High Priority Task, id: '1')
    const firstTodo = screen.getByTestId('todo-item-1');
    
    const toggleButton = firstTodo.querySelector('[data-testid="todo-toggle"]');
    const deleteButton = firstTodo.querySelector('[data-testid="todo-delete"]');
    const editButton = firstTodo.querySelector('[data-testid="todo-edit"]');

    if (toggleButton) fireEvent.click(toggleButton);
    expect(defaultProps.onToggle).toHaveBeenCalledWith('1');

    if (editButton) fireEvent.click(editButton);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));

    if (deleteButton) fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
  });
});
