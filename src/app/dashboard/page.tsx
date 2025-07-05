'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DashboardAfterLogin = dynamic(() => import('@/components/pages/dashboard-after-login'), { ssr: false });

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) return <div className="w-full text-center py-12">Loading...</div>;

  return <DashboardAfterLogin />;
}