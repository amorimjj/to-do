import { ReactNode, FC } from 'react';
import { Todo } from '@/types/todo';
import { Trash2, Edit2, Clock4, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityColors = {
  Low: 'bg-blue-100 text-blue-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700'
};

const Tag = ({ children }: { children: ReactNode }) => {
  return (
    <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-200">
      {children}
    </span>
  );
};

export const TodoItem: FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit
}) => (
  <div
    className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white dark:bg-transparent hover:shadow-sm dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all`}
    data-testid={`todo-item-${todo.id}`}
  >
    <button
      onClick={() => onToggle(todo.id)}
      className="shrink-0 transition-transform active:scale-90"
      data-testid="todo-toggle"
    >
      {todo.isCompleted ? (
        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50 stroke-2" />
      ) : (
        <Circle className="w-6 h-6 text-zinc-300 group-hover:text-zinc-400" />
      )}
    </button>

    <div className="flex-1 min-w-0">
      <h3
        data-completed={todo.isCompleted}
        className={`text-lg font-semibold truncate transition-all data-[completed=true]:text-zinc-400 data-[completed=true]:line-through`}
      >
        {todo.title}
      </h3>

      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
        <span
          className={`px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${priorityColors[todo.priority]}`}
        >
          {todo.priority}
        </span>
        {todo.dueDate && (
          <Tag>
            <Clock4 className="w-3 h-3" />
            <span>{format(new Date(todo.dueDate), 'MMM d, yyyy')}</span>
          </Tag>
        )}
      </div>
    </div>

    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => onEdit(todo)}
        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
        data-testid="todo-edit"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
        data-testid="todo-delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);
