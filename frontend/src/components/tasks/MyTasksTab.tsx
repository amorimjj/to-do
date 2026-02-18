'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { TodoItem } from '@/components/TodoItem';
import { Skeleton } from '@/components/ui/Skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Todo, Priority } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { FilterButton } from './FilterButton';
import { FilterTask } from './FilterTask';

type FilterStatus = 'all' | 'pending' | 'completed';

type MyTasksTabProps = {
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
};

export const MyTasksTab = ({ onToggle, onDelete, onEdit }: MyTasksTabProps) => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const [quickInput, setQuickInput] = useState('');

  const {
    todos,
    loadingMore,
    loading,
    hasMore,
    loadMore,
    setFilters,
    createTodo
  } = useTodos();

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: () => loadMore(),
    hasMore,
    loading: loading || loadingMore
  });

  const handleFilterClick = (status: FilterStatus) => {
    setFilter(status);
    if (status === 'all') setFilters({ isCompleted: undefined });
    else if (status === 'completed') setFilters({ isCompleted: true });
    else setFilters({ isCompleted: false });
  };

  const handlePriorityClick = (priority: Priority | 'all') => {
    setPriorityFilter(priority);
    setFilters({ priority: priority === 'all' ? undefined : priority });
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = quickInput.trim();
    if (!title) return;
    createTodo({
      title,
      description: null,
      priority: 'Medium',
      dueDate: null
    });
    setQuickInput('');
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
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="my-tasks-quick-add-submit"
          disabled={!quickInput.trim()}
        >
          Add
        </button>
      </form>

      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex gap-8 mt-3">
          <FilterButton
            selected={filter === 'all'}
            onClick={() => handleFilterClick('all')}
          >
            All
          </FilterButton>
          <FilterButton
            selected={filter === 'pending'}
            onClick={() => handleFilterClick('pending')}
          >
            Pending
          </FilterButton>
          <FilterButton
            selected={filter === 'completed'}
            onClick={() => handleFilterClick('completed')}
          >
            Completed
          </FilterButton>
        </div>
        <FilterTask
          priorityFilter={priorityFilter}
          handlePriorityClick={handlePriorityClick}
          handleFilterClick={handleFilterClick}
        />
      </div>

      {loading ? (
        <div className="space-y-3" data-testid="my-tasks-skeleton">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/80"
              data-testid="my-tasks-loading"
            >
              <Skeleton className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      ) : todos.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800/80"
          data-testid="my-tasks-empty"
        >
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'all' && priorityFilter === 'all'
              ? 'No tasks yet. Add one above.'
              : 'No tasks found matching your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="todo-list">
          {todos.map((todo) => (
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
