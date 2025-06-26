'use client';

import { useToast } from '@/hooks/use-toast';
import { Toast } from './toast-simple';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div>
      {toasts.map(({ id, title, description, variant }) => (
        <Toast key={id} title={title} description={description} variant={variant} />
      ))}
    </div>
  );
} 