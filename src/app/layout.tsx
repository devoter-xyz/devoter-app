import { Sidebar } from '@/components/common/Sidebar';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Providers as ThirdwebProviders } from '@/components/providers/ThirdwebProvider';
import { WalletProvider } from '@/components/providers/WalletProvider';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { TopLoader } from 'next-top-loader';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/common/Header';
import { LayoutProvider, useLayout } from '@/components/providers/LayoutProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Devoter App',
  description: 'A decentralized voting application for GitHub repositories',
  icons: {
    icon: [
      { url: '/logo.svg' },
      { url: '/logo.svg', sizes: '16x16', type: 'image/png' },
      { url: '/logo.svg', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/logo.svg'
  }
};

function AppContent({ children }: { children: React.ReactNode }) {
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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', geistSans.variable, geistMono.variable)}>
        <ThirdwebProviders>
          <SessionProvider>
            <WalletProvider>
              <LayoutProvider>
                <AppContent>{children}</AppContent>
              </LayoutProvider>
              <SonnerToaster />
            </WalletProvider>
          </SessionProvider>
        </ThirdwebProviders>
        <Analytics />
      </body>
    </html>
  );
}
