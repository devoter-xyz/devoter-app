'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const SubmitRepositoryButton = () => {
  return (
    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600">
      <Plus className="w-5 h-5 mr-2" />
      Submit Repository
    </Button>
  );
};
