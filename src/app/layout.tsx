import { SessionProvider } from '@/components/providers/SessionProvider';
import { WalletProvider } from "@/components/providers/WalletProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { TopLoader } from 'next-top-loader';
import { Header } from '@/components/common/Header';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Providers as ThirdwebProviders } from '@/components/providers/ThirdwebProvider';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devoter App",
  description: "A decentralized voting application for GitHub repositories",
  icons: {
    icon: [
      { url: '/dev-token-logo.png' },
      { url: '/dev-token-logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/dev-token-logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/dev-token-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThirdwebProviders>
          <SessionProvider>
            <WalletProvider>
              <Header />
              <TopLoader />
              <main>{children}</main>
              <SonnerToaster />
            </WalletProvider>
          </SessionProvider>
        </ThirdwebProviders>
        <Analytics />
      </body>
    </html>
  );
}
