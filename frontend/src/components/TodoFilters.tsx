import React from 'react';
import { TodoFilters as FilterType, Priority } from '@/types/todo';

interface TodoFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  return (
    <div
      className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      data-testid="todo-filters"
    >
      <div className="flex flex-col">
        <label className="text-xs font-semibold uppercase text-gray-500 mb-1">
          Status
        </label>
        <select
          value={
            filters.isCompleted === undefined
              ? 'all'
              : filters.isCompleted.toString()
          }
          onChange={(e) => {
            const val = e.target.value;
            onFilterChange({
              isCompleted: val === 'all' ? undefined : val === 'true',
              page: 1
            });
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-sm"
          data-testid="filter-status"
        >
          <option value="all">All Status</option>
          <option value="false">Active</option>
          <option value="true">Completed</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-semibold uppercase text-gray-500 mb-1">
          Priority
        </label>
        <select
          value={filters.priority || 'all'}
          onChange={(e) => {
            const val = e.target.value;
            onFilterChange({
              priority: val === 'all' ? undefined : (val as Priority),
              page: 1
            });
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-sm"
          data-testid="filter-priority"
        >
          <option value="all">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-semibold uppercase text-gray-500 mb-1">
          Sort By
        </label>
        <div className="flex gap-2">
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) =>
              onFilterChange({ sortBy: e.target.value as any, page: 1 })
            }
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-sm"
            data-testid="filter-sort-by"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
          </select>
          <select
            value={filters.sortOrder || 'desc'}
            onChange={(e) =>
              onFilterChange({
                sortOrder: e.target.value as 'asc' | 'desc',
                page: 1
              })
            }
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-sm"
            data-testid="filter-sort-order"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>
    </div>
  );
};
