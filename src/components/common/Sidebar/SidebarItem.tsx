'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  text: string;
}

export const SidebarItem = ({ href, icon: Icon, text }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link href={href}>
        <div
          className={cn(
            'flex items-center p-3 rounded-lg text-black hover:bg-purple-100 dark:hover:bg-purple-800/20',
            isActive && 'bg-purple-100/50 dark:bg-purple-800/30 text-purple-600 dark:text-purple-400 border border-purple-500'
          )}
        >
          <Icon className="w-5 h-5 mr-3" />
          <span className="font-medium">{text}</span>
        </div>
      </Link>
    </li>
  );
};
