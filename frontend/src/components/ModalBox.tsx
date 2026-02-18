import { ReactNode } from 'react';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import { X } from 'lucide-react';

interface ModalBoxProps {
  children: ReactNode;
  onClose?: () => void;
}

export const ModalBox = ({ children, onClose }: ModalBoxProps) => {
  useKeyboardShortcut(
    () => {
      onClose?.();
    },
    {
      code: 'Escape'
    }
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-24"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className="w-full max-w-lg relative">
        {children}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-md p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-100 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
