import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { RateLimitError } from './rateLimit';

export function useRateLimitError() {
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (retryCountdown === null || retryCountdown <= 0) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        if (retryCountdown === 0) {
          toast.success('You can try again now!', { id: toastIdRef.current, duration: 3000 });
        }
        toastIdRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      setRetryCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    if (toastIdRef.current) {
      toast.custom((t) => (
        <div className="bg-destructive text-destructive-foreground p-3 rounded-md shadow-lg flex items-center justify-between w-full">
          <span>Rate limit exceeded. Retrying in {retryCountdown} seconds.</span>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 text-sm font-medium">Dismiss</button>
        </div>
      ), { id: toastIdRef.current, duration: retryCountdown * 1000 + 1000 });
    }

    return () => clearTimeout(timer);
  }, [retryCountdown]);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof RateLimitError) {
      setRetryCountdown(error.retryAfter);

      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }

      // Create the initial toast and store its ID
      toastIdRef.current = toast.custom((t) => (
        <div className="bg-destructive text-destructive-foreground p-3 rounded-md shadow-lg flex items-center justify-between w-full">
          <span>Rate limit exceeded. Retrying in {error.retryAfter} seconds.</span>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 text-sm font-medium">Dismiss</button>
        </div>
      ), { duration: error.retryAfter * 1000 + 1000 }); // +1 second to show "You can try again now!"

    } else {
      console.error(error);
      toast.error('An unexpected error occurred.');
    }
  }, []);

  return { handleError, retryCountdown };
}
