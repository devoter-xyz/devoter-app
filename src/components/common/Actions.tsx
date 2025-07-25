'use client';

import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { ConnectWallet } from './Wallet/ConnectWallet';

export function Actions() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon">
        <Bell className="h-4 w-4" />
      </Button>
      <ConnectWallet />
    </div>
  );
}
