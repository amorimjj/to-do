import { useTodos } from '@/hooks/useTodos';

const days = [
  { label: 'Sun', key: 'sunday' },
  { label: 'Mon', key: 'monday' },
  { label: 'Tue', key: 'tuesday' },
  { label: 'Wed', key: 'wednesday' },
  { label: 'Thu', key: 'thursday' },
  { label: 'Fri', key: 'friday' },
  { label: 'Sat', key: 'saturday' }
] as const;

export const DailyActivity = () => {
  const { weeklySummary } = useTodos();

  const maxTotal = weeklySummary
    ? Math.max(...Object.values(weeklySummary).map((d) => d.total), 1)
    : 1;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
      <h3 className="font-bold mb-6 text-gray-900 dark:text-gray-100">
        Daily Activity
      </h3>

      <div className="flex items-end justify-between gap-2 h-48 w-full px-2">
        {days.map((day) => {
          const data = weeklySummary
            ? weeklySummary[day.key]
            : { total: 0, completed: 0 };
          const totalHeight = (data.total / maxTotal) * 100;
          const completedPercentage =
            data.total > 0 ? (data.completed / data.total) * 100 : 0;

          return (
            <div
              key={day.key}
              className="flex flex-col items-center flex-1 gap-3 group"
            >
              <div className="relative w-full flex flex-col justify-end items-center h-32">
                <div
                  className="w-full max-w-[24px] bg-violet-100 dark:bg-violet-900/30 rounded-t-sm flex flex-col justify-end overflow-hidden transition-all duration-500"
                  style={{ height: `${totalHeight}%` }}
                >
                  <div
                    className="w-full bg-violet-600 dark:bg-violet-500 transition-all duration-700 delay-300"
                    style={{ height: `${completedPercentage}%` }}
                  />
                </div>

                {/* Tooltip on hover */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-gray-800 dark:bg-gray-700 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
                  {data.completed}/{data.total} tasks
                </div>
              </div>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
