import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { ConnectWallet } from './Wallet/ConnectWallet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const notifications = [
  {
    title: 'Your submission for "Devoter App" is live!',
    description: `It's now visible to the community.`,
  },
  {
    title: 'New upvote on "My Awesome Repo"',
    description: 'Someone liked your repository!',
  },
  {
    title: 'You have a new follower',
    description: 'User @johndoe started following you.',
  },
  {
    title: 'Weekly leaderboard update',
    description: 'Check out the top repositories this week.',
  },
  {
    title: 'Your payment for "Project X" was successful',
    description: '0.5 ETH has been transferred.',
  },
];

export function Actions() {
  return (
    <div className='flex items-center gap-4'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' aria-label='Notifications'>
            <Bell className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-80 p-0'>
          <div className='flex flex-col space-y-2 p-4'>
            <h4 className='font-medium leading-none'>Notifications</h4>
            <p className='text-sm text-muted-foreground'>
              You have {notifications.length} unread messages.
            </p>
          </div>
          <Separator />
          <ScrollArea className='h-72'>
            <div className='p-4'>
              {notifications.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No new notifications</p>
              ) : (
                <div className='space-y-4'>
                  {notifications.map((notification, index) => (
                    <DropdownMenuItem key={index} className='grid gap-1'>
                      <p className='text-sm font-medium leading-none'>
                        {notification.title}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {notification.description}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConnectWallet />
    </div>
  );
}
