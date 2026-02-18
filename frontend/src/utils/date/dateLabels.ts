import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

export const getDueDateLabel = (dueDate: string | null): string | null => {
  if (!dueDate) return null;
  const d = new Date(dueDate);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
};
