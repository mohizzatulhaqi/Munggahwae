import type React from 'react';
import { Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  className?: string;
  iconClassName?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ className, iconClassName }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-green-600',
        className
      )}
    >
      <Mountain className={cn('w-1/3 h-1/3', iconClassName)} />
    </div>
  );
};

export default ImagePlaceholder;
