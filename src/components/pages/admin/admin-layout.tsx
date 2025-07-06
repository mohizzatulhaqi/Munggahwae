'use client';
import { useState, useEffect } from 'react';
import type React from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Mountain,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    nama: 'admin',
    email: 'admin@munggahwae.com'
  });
  const pathname = usePathname();
  const router = useRouter();

  // Fetch admin data from API
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        console.log('Fetching admin data...'); // Debug log
        const response = await fetch('/api/admin/user');
        const result = await response.json();
        
        console.log('Response from admin API:', result); // Debug log
        
        if (result.success && result.admin) {
          console.log('Setting admin data:', result.admin); // Debug log
          // Ensure nama and email are not null/undefined
          setAdminData({
            nama: result.admin.nama || 'admin',
            email: result.admin.email || 'admin@munggahwae.com'
          });
        } else {
          console.log('No admin data in response or success is false');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Keep default values if API fails
      }
    };

    fetchAdminData();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Gunung', href: '/admin/mountains', icon: Mountain },
    { name: 'Kelola Booking', href: '/admin/bookings', icon: Calendar },
  ];

  const handleLogout = () => {
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 bg-gradient-to-r from-green-600 to-green-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Mountain className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <span className="text-xl font-bold text-white font-plus-jakarta">Munggahwae</span>
              <p className="text-green-100 text-sm font-medium">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-green-500 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors flex-shrink-0 ${
                    isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                <span className="font-plus-jakarta">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <div className="bg-green-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">
                  {adminData.nama ? adminData.nama.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{adminData.nama}</p>
                <p className="text-xs text-gray-500 truncate">{adminData.email}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="font-plus-jakarta">Keluar</span>
          </Button>
        </div>
      </div>

      {/* Main content - dengan margin left untuk memberikan ruang pada sidebar */}
      <div className="lg:ml-72">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-30 sticky top-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-gray-900 font-plus-jakarta truncate">
                  {navigation.find((nav) => nav.href === pathname)?.name || 'Admin Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 truncate">Kelola platform Munggahwae</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0"></div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;