'use client';

import { Actions } from './Actions';
import { Search } from './Search';

export function Header() {
  return (
    <header className='sticky flex justify-between top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 container mx-auto p-6'>
      <div className='w-full'>
        <Search />
      </div>
      <div>
        <Actions />
      </div>
    </header>
  );
}
