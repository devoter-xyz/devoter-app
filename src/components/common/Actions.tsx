import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { ConnectWallet } from './Wallet/ConnectWallet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function Actions() {
  return (
    <div className='flex items-center gap-4'>
      <Popover>
        <PopoverTrigger>
          <Button variant='outline' size='icon'>
            <Bell className='h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          No new notifications
        </PopoverContent>
      </Popover>
      <ConnectWallet />
    </div>
  );
}
