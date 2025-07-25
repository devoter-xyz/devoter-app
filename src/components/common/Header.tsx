'use client';

import { Actions } from './Actions';
import { Logo } from './Logo';
import { Search } from './Search';

export function Header() {
  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between pl-10 pr-4">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-full md:max-w-lg">
            <Search />
          </div>
          <nav className="flex items-center">
            <Actions />
          </nav>
        </div>
      </div>
    </header>
  );
} 