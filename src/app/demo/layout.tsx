import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Repository Summary Demo - Devoter App',
  description: 'Demo page for the Repository Summary component',
};

export default function DemoLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}>
        <main className="container mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
