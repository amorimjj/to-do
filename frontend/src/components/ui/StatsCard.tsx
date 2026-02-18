import type { LucideIcon } from 'lucide-react';

type IconColor = 'gray' | 'green' | 'blue' | 'indigo';

const iconColors: Record<IconColor, string> = {
  gray: 'bg-zinc-50 text-zinc-600',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  indigo: 'bg-indigo-50 text-indigo-600'
};

type StatsCardProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: IconColor;
  'data-testid'?: string;
};

export const StatsCard = ({
  icon: Icon,
  value,
  label,
  'data-testid': testId,
  iconColor = 'gray'
}: StatsCardProps) => (
  <div
    className="flex flex-col gap-1 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/80 dark:shadow-none"
    data-testid={testId ?? 'stats-card'}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconColors[iconColor]}`}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </div>
    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </span>
    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
      {label}
    </span>
  </div>
);
