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
      className="flex items-center gap-2 px-4 py-2 text-global-1 hover:text-global-2 transition-colors"
    >
      <ArrowLeft size={20} />
      <span className="text-sm font-medium font-plus-jakarta">Kembali</span>
    </button>
  );
};

export default BackButton;
