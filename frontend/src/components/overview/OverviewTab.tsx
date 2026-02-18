'use client';

import {
  ArrowUpRight,
  LayoutGrid,
  CircleCheckBig,
  Clock,
  Target,
  Plus
} from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { TodoItem } from '@/components/TodoItem';
import { DailyActivity } from '@/components/DailyActivity';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';

type OverviewTabProps = {
  userName: string;
  onViewAllTasks: () => void;
  onCreateTask: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const OverviewSkeleton = () => (
  <div
    className="space-y-8 max-w-5xl mx-auto pb-24 lg:pb-0"
    data-testid="overview-skeleton"
  >
    <section>
      <Skeleton className="h-9 w-64 sm:h-10" />
      <Skeleton className="mt-2 h-5 w-48" />
    </section>

    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-1 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
        >
          <Skeleton className="h-10 w-10 rounded-xl mb-3" />
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </section>

    <section className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/80"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/80">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-2 h-10 w-28 rounded-lg" />
        </div>
      </div>
    </section>
  </div>
);

export const OverviewTab = ({
  userName,
  onViewAllTasks,
  onCreateTask,
  onToggle,
  onDelete,
  onEdit
}: OverviewTabProps) => {
  const {
    loading,
    priorityTasks,
    summary: { total, completed, pending, progress }
  } = useTodos();

  if (loading) {
    return <OverviewSkeleton />;
  }

  const priorityCount = priorityTasks.length;

  return (
    <div
      className="space-y-8 max-w-5xl mx-auto pb-24 lg:pb-0"
      data-testid="overview-tab"
    >
      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          {getGreeting()}, {userName}!
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          You have {pending} {pending === 1 ? 'task' : 'tasks'} to complete
          today.
        </p>
      </section>

      <section
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        data-testid="stats-cards"
      >
        <StatsCard
          icon={LayoutGrid}
          iconColor="gray"
          value={total}
          label="Total Tasks"
          data-testid="stats-total"
        />
        <StatsCard
          icon={CircleCheckBig}
          iconColor="green"
          value={completed}
          label="Completed"
          data-testid="stats-completed"
        />
        <StatsCard
          icon={Clock}
          iconColor="blue"
          value={pending}
          label="Pending"
          data-testid="stats-pending"
        />
        <StatsCard
          icon={Target}
          iconColor="indigo"
          value={`${Math.round(progress * 100)}%`}
          label="Progress"
          data-testid="stats-progress"
        />
      </section>

      <section className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Priority Tasks
              {priorityCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-100 px-1.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                  {priorityCount}
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={onViewAllTasks}
              className="flex items-center cursor-pointer gap-1 text-sm font-medium text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
              data-testid="overview-view-all"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div>
            {priorityTasks.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-2 py-12 text-center text-gray-500 dark:text-gray-400"
                data-testid="priority-tasks-empty"
              >
                <CircleCheckBig className="h-10 w-10 opacity-40" />
                <p className="text-sm font-medium">No pending tasks</p>
                <p className="text-xs">Add a task or mark some complete.</p>
              </div>
            ) : (
              <div
                className="space-y-3 overflow-hidden"
                data-testid="todo-list"
              >
                {priorityTasks.map((task) => (
                  <TodoItem
                    key={task.id}
                    todo={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DailyActivity />
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
            data-testid="create-task-cta"
          >
            <button type="button" onClick={onCreateTask}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Plus className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </button>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Create New Task
            </h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Break down your goals into actionable steps.
            </p>
            <button
              type="button"
              onClick={onCreateTask}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
              data-testid="overview-get-started"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
