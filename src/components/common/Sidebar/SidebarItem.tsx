'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  text: string;
  onClick?: () => void;
}

export const SidebarItem = ({ href, icon: Icon, text, onClick }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link href={href} onClick={onClick}>
        <div
          className={`flex items-center p-3 rounded-lg border transition-colors
            ${isActive
              ? 'bg-primary/10 dark:bg-primary/30 text-primary border-primary'
              : 'text-black dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 border-transparent'}
          `}
        >
          <Icon className='w-5 h-5 mr-3' />
          <span className='font-medium'>{text}</span>
        </div>
      </Link>
    </li>
  );
};
