'use client';

import React from 'react';

interface ChipViewProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const ChipView = ({ 
  children, 
  isActive = false, 
  onClick, 
  className = '' 
}: ChipViewProps) => {
  return (
    <div 
      onClick={onClick}
      className={`
        flex flex-row items-center justify-center
        h-8 px-4
        bg-chipview-1
        rounded-xl
        cursor-pointer
        transition-colors
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <span className="text-sm font-medium leading-[18px] text-global-1 font-plus-jakarta">
        {children}
      </span>
    </div>
  );
};

export default ChipView;