'use client';

import { Logo } from '../Logo';
import { SIDEBAR_LINKS, SidebarLink } from './data';
import { SidebarItem } from './SidebarItem';
import { SubmitRepositoryButton } from './SubmitRepositoryButton';

export const Sidebar = () => {
  return (
    <aside className='h-screen w-64'>
      <div className='h-full flex flex-col bg-background border-r overflow-y-auto p-4'>
        <div className='my-6'>
        <Logo />
        </div>
        <nav className='flex-grow'>
          <ul className='space-y-2'>
            {SIDEBAR_LINKS.map((link: SidebarLink) => (
              <SidebarItem key={link.href} {...link} />
            ))}
          </ul>
        </nav>
        <div className='mt-auto'>
          <SubmitRepositoryButton />
        </div>
      </div>
    </aside>
  );
};
