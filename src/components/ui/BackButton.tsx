'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center px-4 py-2 text-global-1 hover:text-global-2 transition-colors font-plus-jakarta text-sm font-medium"
    >
      <ArrowLeft size={16} className="mr-2" />
      Kembali
    </button>
  );
};

export default BackButton;
