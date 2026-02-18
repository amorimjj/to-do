'use client';

import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Palette } from 'lucide-react';
import { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

const SettingsSection = ({
  title,
  description,
  icon,
  children,
}: SettingsSectionProps) => (
  <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-start gap-4 border-b border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm dark:bg-gray-800 dark:text-violet-400">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

interface SettingItemProps {
  label: string;
  description?: string;
  children: ReactNode;
}

const SettingItem = ({ label, description, children }: SettingItemProps) => (
  <div className="flex flex-col items-start justify-between gap-4 py-2 sm:flex-row sm:items-center">
    <div>
      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
    <div className="w-full sm:w-auto">{children}</div>
  </div>
);

export const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage your application configuration.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <SettingsSection
          title="Appearance"
          description="Customize the look and feel of the application."
          icon={<Palette className="h-5 w-5" />}
        >
          <SettingItem
            label="Theme"
            description="Choose between light or dark preference."
          >
            <div className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  theme === 'light'
                    ? 'bg-white text-violet-600 shadow-sm dark:bg-gray-700 dark:text-violet-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                data-testid="theme-light-btn"
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-white text-violet-600 shadow-sm dark:bg-gray-700 dark:text-violet-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                data-testid="theme-dark-btn"
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
            </div>
          </SettingItem>
        </SettingsSection>
      </div>
    </div>
  );
};
