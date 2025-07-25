'use client';

import { SIDEBAR_LINKS, SidebarLink } from './data';
import { SidebarItem } from './SidebarItem';
import { SubmitRepositoryButton } from './SubmitRepositoryButton';

export const Sidebar = () => {
  return (
    <aside className="h-[calc(100vh-4rem)] w-64 sticky top-16 left-0 z-30">
      <div className="h-full flex flex-col bg-background border-r overflow-y-auto p-4">
        <nav className="flex-grow">
          <ul className="space-y-2">
            {SIDEBAR_LINKS.map((link: SidebarLink) => (
              <SidebarItem key={link.href} {...link} />
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <SubmitRepositoryButton />
        </div>
      </div>
    </aside>
  );
};
