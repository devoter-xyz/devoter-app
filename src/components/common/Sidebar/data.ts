import { LucideIcon, Home, Heart, Trophy, LayoutDashboard, Link as LinkIcon } from 'lucide-react';

export interface SidebarLink {
  href: string;
  icon: LucideIcon;
  text: string;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  {
    href: '/',
    icon: Home,
    text: 'Home',
  },
  {
    href: '/favorites',
    icon: Heart,
    text: 'Favorites',
  },
  {
    href: '/leaderboard',
    icon: Trophy,
    text: 'Leaderboard',
  },
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    text: 'Dashboard',
  },
  {
    href: '/api',
    icon: LinkIcon,
    text: 'API',
  },
];
