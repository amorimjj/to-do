'use client';

import { LayoutDashboard, ListTodo, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useNavigate, type NavTab } from '@/hooks/useNavigate';

type NavItem = {
  id: NavTab;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'My Tasks', icon: ListTodo },
  { id: 'settings', label: 'Settings', icon: Settings }
];

type SidebarProps = {
  activeTab: NavTab;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

export const Sidebar = ({
  activeTab,
  isMobileOpen = false,
  onMobileClose
}: SidebarProps) => {
  const { navigateTo } = useNavigate();

  const content = (
    <>
      <div className="flex items-center gap-2 px-4 pt-6 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Flow
        </span>
        <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
          Preview
        </span>
      </div>
      <nav
        className="flex flex-col gap-0.5 px-3 pb-6"
        aria-label="Main navigation"
      >
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                navigateTo(id);
                onMobileClose?.();
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
              }`}
              data-testid={`nav-${id}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="fixed left-0 top-0 z-30 hidden h-full w-56 flex-col border-r border-gray-200 bg-gray-50/95 dark:border-gray-700 dark:bg-gray-900/95 lg:flex"
        aria-label="Sidebar"
      >
        {content}
      </aside>
      {/* Mobile overlay + drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-56 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 lg:hidden ${
          isMobileOpen ? 'flex' : 'hidden'
        }`}
        aria-label="Sidebar"
      >
        {content}
      </aside>
    </>
  );
};
