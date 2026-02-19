import { render, screen, fireEvent } from '@testing-library/react';
import { Settings } from './Settings';
import { useTheme } from '@/hooks/useTheme';

// Mock useTheme hook
jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn()
}));

describe('Settings', () => {
  const mockSetTheme = jest.fn();
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme
    });
  });

  test('renders settings header and appearance section', () => {
    render(<Settings />);

    expect(
      screen.getByRole('heading', { name: /Settings/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Appearance/i, level: 3 })
    ).toBeInTheDocument();

    // Check that other sections are NOT present
    expect(screen.queryByText(/Account/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Notifications/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Privacy & Security/i)).not.toBeInTheDocument();
  });

  test('calls setTheme when theme buttons are clicked', () => {
    render(<Settings />);

    const lightBtn = screen.getByTestId('theme-light-btn');
    const darkBtn = screen.getByTestId('theme-dark-btn');

    fireEvent.click(darkBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(lightBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  test('highlights the active theme button', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme
    });

    render(<Settings />);

    const darkBtn = screen.getByTestId('theme-dark-btn');
    const lightBtn = screen.getByTestId('theme-light-btn');

    expect(darkBtn).toHaveClass(
      'bg-white text-violet-600 shadow-sm dark:bg-gray-700 dark:text-violet-400'
    );
    expect(lightBtn).toHaveClass(
      'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
    );
  });
});
