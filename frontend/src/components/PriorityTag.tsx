const priorityColors: Record<Priority, string> = {
  Low: 'bg-blue-100 text-blue-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700'
};

type Priority = 'Low' | 'Medium' | 'High';

type PriorityTagProps = {
size?: 'sm' | 'md' | 'lg';
  priority: Priority;
};

export const PriorityTag = ({ priority, size = 'sm' }: PriorityTagProps) => (
  <span
    data-size={size}
    className={`px-2 rounded-full font-medium uppercase tracking-wider ${priorityColors[priority]} data-[size=sm]:py-0.5 data-[size=md]:py-1 data-[size=lg]:py-0.5 data-[size=lg]:px-4`}
  >
    {priority}
  </span>
);
