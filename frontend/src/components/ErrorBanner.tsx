import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onClose
}) => (
  <div
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between mb-4"
    role="alert"
    data-testid="error-banner"
  >
    <div className="flex items-center">
      <AlertCircle className="w-5 h-5 mr-2" />
      <span className="block sm:inline">{message}</span>
    </div>
    {onClose && (
      <button onClick={onClose} className="text-red-700">
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);
