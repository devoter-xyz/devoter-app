'use client';

import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { TopLoader } from 'next-top-loader';
import { useLayout } from '@/components/providers/LayoutProvider';
import { cn } from '@/lib/utils';

export function AppContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar } = useLayout();

  return (
    <div className='flex min-h-screen'>
      <div className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transition-transform duration-300 ease-in-out md:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar />
      </div>
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden'
          onClick={closeSidebar}
        />
      )}
      <div className='flex-1 md:ml-64'>
        <TopLoader />
        <Header />
        <main className='container mx-auto p-6'>{children}</main>
      </div>
    </div>
  );
}