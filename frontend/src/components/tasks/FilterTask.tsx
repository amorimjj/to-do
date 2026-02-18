import { useRef, useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Priority } from '@/types/todo';

type FilterTaskProps = {
  priorityFilter: Priority | 'all';
  handlePriorityClick: (priority: Priority | 'all') => void;
  handleFilterClick: (filter: 'all' | 'pending' | 'completed') => void;
};

export const FilterTask = ({
  priorityFilter,
  handlePriorityClick,
  handleFilterClick
}: FilterTaskProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isFiltering = priorityFilter !== 'all';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 mb-2 text-sm font-medium transition-all ${
          isFilterOpen || isFiltering
            ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-900/20 dark:text-violet-300'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        data-testid="my-tasks-filter-advanced"
        aria-expanded={isFilterOpen}
        aria-haspopup="true"
        aria-label="Filter tasks"
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
        {isFiltering && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] text-white">
            1
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isFilterOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-left rounded-xl border border-zinc-200 bg-white p-4 shadow-xl focus:outline-none dark:border-gray-700 dark:bg-gray-800 z-50 animate-in fade-in zoom-in duration-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Priority
              </h3>
              <div
                className="flex flex-wrap gap-1.5"
                role="tablist"
                aria-label="Filter tasks by priority"
              >
                {(['all', 'Low', 'Medium', 'High'] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    role="tab"
                    aria-selected={priorityFilter === priority}
                    onClick={() => handlePriorityClick(priority)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      priorityFilter === priority
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                    data-testid={`filter-priority-${priority.toLowerCase()}`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {isFiltering && (
              <div className="border-t border-gray-100 pt-1 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    handleFilterClick('all');
                    handlePriorityClick('all');
                    setIsFilterOpen(false);
                  }}
                  className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
