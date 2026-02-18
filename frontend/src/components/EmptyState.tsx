import React from 'react';
import { ClipboardList } from 'lucide-react';

export const EmptyState: React.FC = () => (
  <div
    className="flex flex-col items-center justify-center p-12 text-gray-500"
    data-testid="empty-state"
  >
    <ClipboardList className="w-16 h-16 mb-4 opacity-20" />
    <p className="text-xl font-medium">No tasks found</p>
    <p className="text-sm">
      Try adjusting your filters or add a new task to get started.
    </p>
  </div>
);
