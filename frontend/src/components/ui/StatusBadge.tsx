import { Priority } from '@/types/todo';

type StatusBadgeProps = {
  priority: Priority;
  className?: string;
};

const styles: Record<Priority, string> = {
  High: 'bg-red-500/90 text-white dark:bg-red-600 dark:text-white',
  Medium: 'bg-amber-500/90 text-white dark:bg-amber-600 dark:text-white',
  Low: 'bg-sky-500/90 text-white dark:bg-sky-600 dark:text-white'
};

export const StatusBadge = ({ priority, className = '' }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[priority]} ${className}`}
    data-testid={`status-badge-${priority.toLowerCase()}`}
  >
    {priority}
  </span>
);
