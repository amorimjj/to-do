'use client';

import { useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/theme';
import { TodosProvider } from '@/contexts/todos';
import { Sidebar } from '@/components/layout/Sidebar';
import { useNavigate } from '@/hooks/useNavigate';
import { useTodos } from '@/hooks/useTodos';
import { Header } from '@/components/layout/Header';
import { OverviewTab } from '@/components/overview/OverviewTab';
import { MyTasksTab } from '@/components/tasks/MyTasksTab';
import { TodoForm } from '@/components/TodoForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ModalBox } from '@/components/ModalBox';
import { MOCK_USER_NAME } from '@/data/mockTasks';
import type { Todo } from '@/types/todo';

function AppContent() {
  const { activeTab, isInvalidRoute, navigateToTasks } = useNavigate();
  const {
    todos,
    toggleTodo,
    deleteTodo,
    createTodo,
    loading,
    loadMore,
    hasMore,
    loadingMore,
    setFilters
  } = useTodos();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const quickAdd = useCallback(
    (title: string) => {
      createTodo({
        title,
        description: null,
        priority: 'Medium',
        dueDate: null
      });
    },
    [createTodo]
  );

  const handleFilterChange = useCallback(
    (isCompleted?: boolean) => {
      setFilters({ isCompleted });
    },
    [setFilters]
  );

  const openNewTask = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  if (isInvalidRoute) {
    return <Navigate to="/overview" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            userName={MOCK_USER_NAME}
            onViewAllTasks={navigateToTasks}
            onCreateTask={openNewTask}
            onToggle={toggleTodo}
            onDelete={setDeletingId}
            onEdit={openEdit}
          />
        );
      case 'tasks':
        return (
          <MyTasksTab
            tasks={todos}
            onToggle={toggleTodo}
            onDelete={setDeletingId}
            onEdit={openEdit}
            onAddTask={openNewTask}
            onQuickAdd={quickAdd}
            loading={loading}
            onLoadMore={loadMore}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onFilterChange={handleFilterChange}
          />
        );
      case 'planner':
        return (
          <div
            className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-gray-400"
            data-testid="planner-placeholder"
          >
            <p className="font-medium">Planner</p>
            <p className="text-sm">Coming soon.</p>
          </div>
        );
      case 'settings':
        return (
          <div
            className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-gray-400"
            data-testid="settings-placeholder"
          >
            <p className="font-medium">Settings</p>
            <p className="text-sm">Coming soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Sidebar
        activeTab={activeTab}
        isMobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className="min-h-screen lg:pl-56">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          showNewTask={activeTab === 'tasks'}
          onNewTask={openNewTask}
        />
        <main className="px-4 py-6 lg:px-8">{renderContent()}</main>
      </div>

      {showForm && (
        <ModalBox onClose={closeForm}>
            <TodoForm
              initialData={editingTodo}
              onCancel={editingTodo ? closeForm : undefined}
            />
        </ModalBox>
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={() => deletingId && deleteTodo(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TodosProvider>
        <AppContent />
      </TodosProvider>
    </ThemeProvider>
  );
}
