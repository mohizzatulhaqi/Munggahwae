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
  className = '' 
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex flex-row w-40 h-10 gap-8 ${className}`}>
      {pages.map((page) => (
        <div key={page} className="flex items-center justify-center">
          {page === currentPage ? (
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-chipview-1 rounded-[20px]">
              <span className="text-sm font-bold leading-[21px] text-global-1 font-plus-jakarta">
                {page}
              </span>
            </div>
          ) : (
            <button
              onClick={() => onPageChange?.(page)}
              className="text-sm font-normal leading-[21px] text-global-1 font-plus-jakarta cursor-pointer hover:font-medium transition-all"
            >
              {page}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Pagination;