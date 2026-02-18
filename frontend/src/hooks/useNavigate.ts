import { useCallback } from 'react';
import {
  useLocation,
  useNavigate as useRouterNavigate
} from 'react-router-dom';

export type NavTab = 'overview' | 'tasks' | 'planner' | 'settings';

const ROUTES: Record<string, NavTab> = {
  '/overview': 'overview',
  '/my-tasks': 'tasks',
  '/settings': 'settings'
};

const TAB_TO_PATH: Record<NavTab, string> = {
  overview: '/overview',
  tasks: '/my-tasks',
  planner: '/overview',
  settings: '/settings'
};

const pathnameToTab = (pathname: string): NavTab =>
  ROUTES[pathname] ?? 'overview';

const isValidRoute = (pathname: string): boolean => pathname in ROUTES;

export const useNavigate = () => {
  const { pathname } = useLocation();
  const navigate = useRouterNavigate();

  const isInvalidRoute = pathname === '/' || !isValidRoute(pathname);

  const activeTab = isInvalidRoute ? 'overview' : pathnameToTab(pathname);

  const navigateTo = useCallback(
    (tab: NavTab) => navigate(TAB_TO_PATH[tab]),
    [navigate]
  );

  const navigateToOverview = () => navigateTo('overview');
  const navigateToTasks = () => navigateTo('tasks');
  const navigateToSettings = () => navigateTo('settings');

  return {
    activeTab,
    isInvalidRoute,
    navigateTo,
    navigateToOverview,
    navigateToTasks,
    navigateToSettings
  };
};
