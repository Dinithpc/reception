import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

import { UserIcon } from '@heroicons/react/24/solid';  // <-- Added

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'New Booking', href: '/bookings/new', icon: CalendarIcon },
    { name: 'All Bookings', href: '/bookings', icon: DocumentTextIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Customers', href: '/customers', icon: UserGroupIcon },
    { name: 'Payments', href: '/payments', icon: CurrencyDollarIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];
  
  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-primary-800">
        <div className="flex h-16 items-center justify-center bg-primary-900">
          <h1 className="text-xl font-bold text-white">Grand Reception Hall</h1>
        </div>
        
        <nav className="mt-8 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`mb-2 flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Main content */}
      <div className="pl-64">
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <h2 className="text-xl font-semibold text-gray-800">
              {navigation.find(n => isActive(n.href))?.name || 'Dashboard'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Quick Booking
              </button>

              {/* Profile Icon */}
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-600 text-white">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

