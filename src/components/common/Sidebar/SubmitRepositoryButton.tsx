'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const SubmitRepositoryButton = () => {
  return (
    <Button className='w-full'>
      <Plus className='w-5 h-5' />
      Submit Repository
    </Button>
  );
};
