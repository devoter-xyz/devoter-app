'use client';

import { Logo } from '../Logo';
import { SIDEBAR_LINKS, SidebarLink } from './data';
import { SidebarItem } from './SidebarItem';
import { SubmitRepositoryButton } from './SubmitRepositoryButton';
import { useLayout } from '@/components/providers/LayoutProvider';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

export const Sidebar = () => {
  const { closeSidebar } = useLayout();

  return (
    <aside className='h-full flex flex-col bg-background border-r overflow-y-auto p-4'>
      <div className='flex items-center justify-between my-6'>
        <Logo />
        <Button variant='ghost' size='icon' className='md:hidden' onClick={closeSidebar}>
          <XIcon className='h-6 w-6' />
        </Button>
      </div>
      <nav className='flex-grow'>
        <ul className='space-y-2'>
          {SIDEBAR_LINKS.map((link: SidebarLink) => (
            <SidebarItem key={link.href} {...link} onClick={closeSidebar} />
          ))}
        </ul>
      </nav>
      <div className='mt-auto'>
        <SubmitRepositoryButton />
      </div>
    </aside>
  );
};

