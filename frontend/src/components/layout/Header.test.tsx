import { render, screen, fireEvent, act } from '@testing-library/react';
import { Header } from './Header';
import { useTodos } from '@/hooks/useTodos';
import { useTheme } from '@/hooks/useTheme';

jest.mock('@/hooks/useTodos');
jest.mock('@/hooks/useTheme');

const mockedUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;
const mockedUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('Header', () => {
  const onMenuClick = jest.fn();
  const onNewTask = jest.fn();
  const setFilters = jest.fn();
  const toggleTheme = jest.fn();

  const defaultMockTodos = {
    setFilters,
  };

  const defaultMockTheme = {
    theme: 'light',
    toggleTheme,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseTodos.mockReturnValue(defaultMockTodos as any);
    mockedUseTheme.mockReturnValue(defaultMockTheme as any);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders header correctly with default props', () => {
    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);

    expect(screen.getByTestId('header-menu')).toBeInTheDocument();
    expect(screen.getByTestId('header-search')).toBeInTheDocument();
    expect(screen.getByTestId('header-new-task')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('header-user')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search tasks by title...')).toBeInTheDocument();
  });

  test('renders custom search placeholder', () => {
    const customPlaceholder = 'Custom placeholder...';
    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} searchPlaceholder={customPlaceholder} />);
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  test('calls onMenuClick when menu button is clicked', () => {
    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);
    const menuButton = screen.getByTestId('header-menu');
    fireEvent.click(menuButton);
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  test('calls onNewTask when new task button is clicked', () => {
    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);
    const newTaskButton = screen.getByTestId('header-new-task');
    fireEvent.click(newTaskButton);
    expect(onNewTask).toHaveBeenCalledTimes(1);
  });

  test('does not render new task button if onNewTask is not provided', () => {
    render(<Header onMenuClick={onMenuClick} />);
    expect(screen.queryByTestId('header-new-task')).not.toBeInTheDocument();
  });

  test('calls toggleTheme when theme toggle button is clicked', () => {
    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);
    const themeToggleButton = screen.getByTestId('theme-toggle');
    fireEvent.click(themeToggleButton);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  test('renders correct theme icon for dark mode', () => {
    mockedUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme,
    } as any);

    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);
    const themeToggleButton = screen.getByTestId('theme-toggle');
    expect(themeToggleButton).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  test('renders correct theme icon for light mode', () => {
    mockedUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme,
    } as any);

    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);
    const themeToggleButton = screen.getByTestId('theme-toggle');
    expect(themeToggleButton).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  test('calls setFilters with search query after debounce', () => {
    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);
    const searchInput = screen.getByTestId('header-search');

    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Wait for debounce timer
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(setFilters).toHaveBeenCalledWith({ search: 'test query' });
  });

  test('calls setFilters with undefined search when input is empty', () => {
    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);
    const searchInput = screen.getByTestId('header-search');

    fireEvent.change(searchInput, { target: { value: '' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(setFilters).toHaveBeenCalledWith({ search: undefined });
  });

  test('clears previous timer on new input', () => {
    render(<Header onMenuClick={onMenuClick} onNewTask={onNewTask} />);
    const searchInput = screen.getByTestId('header-search');

    fireEvent.change(searchInput, { target: { value: 'first' } });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    fireEvent.change(searchInput, { target: { value: 'second' } });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // setFilters should not have been called yet because we reset the timer at 200ms
    expect(setFilters).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Now it should be called with 'second'
    expect(setFilters).toHaveBeenCalledWith({ search: 'second' });
    expect(setFilters).not.toHaveBeenCalledWith({ search: 'first' });
  });
});
