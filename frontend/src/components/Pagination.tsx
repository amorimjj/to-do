import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className="flex items-center justify-center space-x-2 mt-6"
      data-testid="pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        data-testid="page-prev"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        data-testid="page-next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
