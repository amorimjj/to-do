import { useState, useEffect, FC, FormEvent } from 'react';
import { Todo, Priority } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { dateToString } from '@/utils/date';

import { PriorityTag } from './PriorityTag';

interface TodoFormProps {
  initialData?: Todo | null;
  onCancel?: () => void;
}

const inputStyle =
  'w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none';

type PriorityButtonProps = {
  priority: Priority;
  selected: boolean;
  onClick: () => void;
};

const PriorityButton = ({
  priority,
  selected,
  onClick
}: PriorityButtonProps) => (
  <button
    data-selected={selected}
    data-testid={`todo-input-priority-${priority.toLowerCase()}`}
    type="button"
    className="cursor-pointer rounded-full data-[selected=true]:ring-2 data-[selected=true]:ring-blue-500 outline-none"
    onClick={onClick}
  >
    <PriorityTag size="lg" priority={priority} />
  </button>
);

export const TodoForm: FC<TodoFormProps> = ({ initialData, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsLoading] = useState(false);

  const { createTodo, updateTodo } = useTodos();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setDueDate(dateToString(initialData.dueDate));
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);

    const data = {
      title,
      description: description || null,
      priority,
      dueDate: dueDate || null
    };

    const onSubmit = initialData
      ? () => updateTodo(initialData.id, { ...initialData, ...data })
      : () => createTodo(data);

    try {
      await onSubmit();
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');

      if (initialData) {
        onCancel?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
      data-testid="todo-form"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {initialData ? 'Edit Task' : 'Add New Task'}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className={inputStyle}
            placeholder="What needs to be done?"
            data-testid="todo-input-title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={3}
            className={inputStyle}
            placeholder="Add more details..."
            data-testid="todo-input-description"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <div className="flex gap-4 mt-1 text-base pt-3 py-2 justify-around">
              <PriorityButton
                priority="Low"
                selected={priority === 'Low'}
                onClick={() => setPriority('Low')}
              />
              <PriorityButton
                priority="Medium"
                selected={priority === 'Medium'}
                onClick={() => setPriority('Medium')}
              />
              <PriorityButton
                priority="High"
                selected={priority === 'High'}
                onClick={() => setPriority('High')}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Created At
            </label>
            <span
              className={`${inputStyle} py-2 px-3 inline-block bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-not-allowed`}
              data-testid="todo-display-createdat"
            >
              {new Date().toISOString().slice(0, 10)}
            </span>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputStyle}
              data-testid="todo-input-duedate"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
            data-testid="todo-submit"
          >
            {isSubmitting
              ? 'Saving...'
              : initialData
                ? 'Update Task'
                : 'Add Task'}
          </button>
        </div>
      </div>
    </form>
  );
};
