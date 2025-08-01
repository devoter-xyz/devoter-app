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
              <div className='flex'>
                <Sidebar />
                <div className='flex-1 ml-64'>
                  <TopLoader />
                  <main>{children}</main>
                </div>
              </div>
              <SonnerToaster />
            </WalletProvider>
          </SessionProvider>
        </ThirdwebProviders>
        <Analytics />
      </body>
    </html>
  );
}
