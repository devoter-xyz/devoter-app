'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className='bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex-shrink-0'>
            <Link href='/'>
              <span className='text-2xl font-bold text-gray-900'>Devoter</span>
            </Link>
          </div>
          <nav className='hidden md:flex space-x-8'>
            <Link href='/'>
              <span className='text-gray-600 hover:text-gray-900'>Home</span>
            </Link>
            <Link href='/submit-repo'>
              <span className='text-gray-600 hover:text-gray-900'>Submit Repository</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 