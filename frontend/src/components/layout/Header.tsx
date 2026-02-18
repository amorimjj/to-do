'use client';

import { Search, User, Plus, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

type HeaderProps = {
  onMenuClick?: () => void;
  showNewTask?: boolean;
  onNewTask?: () => void;
  searchPlaceholder?: string;
};

export const Header = ({
  onMenuClick,
  showNewTask = false,
  onNewTask,
  searchPlaceholder = 'Search tasks...'
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 lg:hidden"
        aria-label="Open menu"
        data-testid="header-menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="w-full max-w-md rounded-lg border border-gray-200 bg-gray-100 py-2 pl-9 pr-4 text-sm placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400"
          data-testid="header-search"
          aria-label="Search tasks"
        />
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          data-testid="theme-toggle"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        {showNewTask && onNewTask && (
          <button
            type="button"
            onClick={onNewTask}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            data-testid="header-new-task"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        )}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          aria-label="User menu"
          data-testid="header-user"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
