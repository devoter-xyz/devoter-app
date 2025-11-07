'use client';

import { Actions } from './Actions';
import { Search } from './Search';
import { Logo } from './Logo';
import { LogoText } from './LogoText';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useLayout } from '@/components/providers/LayoutProvider';

export function Header() {
  const { toggleSidebar } = useLayout();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between gap-4 p-6'>
        <div className='flex items-center gap-2 md:hidden'>
          <Button variant='ghost' size='icon' onClick={toggleSidebar}>
            <MenuIcon className='h-6 w-6' />
          </Button>
          <Logo />
        </div>
        <div className='hidden md:flex items-center gap-2'>
          <Logo />
          <LogoText />
        </div>
        <div className='flex-grow min-w-0 max-w-md lg:max-w-lg xl:max-w-xl'>
          <Search />
        </div>
        <div className='flex items-center justify-end'>
          <Actions />
        </div>
      </div>
    </header>
  );
}
