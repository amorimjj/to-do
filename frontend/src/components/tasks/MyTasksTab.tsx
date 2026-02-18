'use client';

import { useState } from 'react';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { TodoItem } from '@/components/TodoItem';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Todo } from '@/types/todo';

type FilterStatus = 'all' | 'pending' | 'completed';

type MyTasksTabProps = {
  tasks: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onAddTask: () => void;
  onQuickAdd?: (title: string) => void;
  loading?: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  onFilterChange: (isCompleted?: boolean) => void;
};

export const MyTasksTab = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onAddTask,
  onQuickAdd,
  loading,
  onLoadMore,
  hasMore,
  loadingMore,
  onFilterChange
}: MyTasksTabProps) => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [quickInput, setQuickInput] = useState('');

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    loading: loading || loadingMore
  });

  const handleFilterClick = (status: FilterStatus) => {
    setFilter(status);
    if (status === 'all') onFilterChange(undefined);
    else if (status === 'completed') onFilterChange(true);
    else onFilterChange(false);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = quickInput.trim();
    if (!title) return;
    if (onQuickAdd) {
      onQuickAdd(title);
      setQuickInput('');
    } else {
      onAddTask();
    }
  };

  return (
    <div
      className="space-y-6 max-w-5xl mx-auto pb-24 lg:pb-0"
      data-testid="my-tasks-tab"
    >
      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          My Tasks
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage and organize your workload.
        </p>
      </section>

      <form onSubmit={handleQuickSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Plus
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Add a new task..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm placeholder-gray-500 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:bg-gray-800"
            data-testid="my-tasks-quick-add"
            aria-label="Add a new task"
          />
        </div>
        {onQuickAdd && (
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            data-testid="my-tasks-quick-add-submit"
          >
            Add
          </button>
        )}
        {!onQuickAdd && (
          <button
            type="button"
            onClick={onAddTask}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            data-testid="my-tasks-add-button"
          >
            Add
          </button>
        )}
      </form>

      <div className="flex flex-wrap items-center gap-4">
        <div
          className="flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          role="tablist"
          aria-label="Filter tasks"
        >
          {(['all', 'pending', 'completed'] as const).map((status) => (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={filter === status}
              onClick={() => handleFilterClick(status)}
              className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              data-testid={`filter-${status}`}
            >
              {status}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          data-testid="my-tasks-filter-advanced"
          aria-label="More filters"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {loading ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800/80"
          data-testid="my-tasks-loading"
        >
          <Loader2 className="h-8 w-8 animate-spin text-violet-600 dark:text-violet-400" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800/80"
          data-testid="my-tasks-empty"
        >
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'all'
              ? 'No tasks yet. Add one above.'
              : filter === 'completed'
                ? 'No completed tasks.'
                : 'No pending tasks.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="todo-list">
          {tasks.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}

          {hasMore && (
            <div
              ref={sentinelRef}
              className="h-4 w-full"
              data-testid="infinite-scroll-sentinel"
            />
          )}

          {loadingMore && (
            <div
              className="flex items-center justify-center py-4"
              data-testid="loading-more"
            >
              <Loader2 className="h-6 w-6 animate-spin text-violet-600 dark:text-violet-400" />
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Loading more...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
