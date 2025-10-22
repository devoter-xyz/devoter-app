'use client';

import { Actions } from './Actions';
import { Search } from './Search';

export function Header() {
  return (
    <header className='sticky flex items-center justify-between top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 container mx-auto p-6 gap-4'>
      <div className='flex-grow min-w-0'>
        <Search />
      </div>
      <div>
        <Actions />
      </div>
    </header>
  );
}
