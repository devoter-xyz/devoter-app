import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const badgeVariants = cva(
  'px-3',
  {
    variants: {
      variant: {
        first: 'bg-yellow-500 text-black',
        second: 'bg-gray-300 text-black',
        third: 'bg-orange-200 text-black',
      },
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function CustomBadge({ className, variant, ...props }: BadgeProps) {
  const content = variant === 'first' ? '#1' : variant === 'second' ? '#2' : '#3';
  return (
    <Badge className={cn(badgeVariants({ variant }), className)} {...props}>
      {content}
    </Badge>
  );
}

export { CustomBadge, badgeVariants };
