'use client';

import React from 'react';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 4,
  onPageChange,
  className = '',
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex flex-row items-center gap-4 ${className}`}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-plus-jakarta transition-all
            ${
              page === currentPage
                ? 'bg-chipview-1 text-global-1 font-bold'
                : 'text-global-1 hover:font-medium'
            }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
