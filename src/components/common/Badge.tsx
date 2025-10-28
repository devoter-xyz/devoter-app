import { cn } from '@/lib/utils';

import { Badge, badgeVariants } from '../ui/badge';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'first' | 'second' | 'third';
}

function CustomBadge({ className, variant, ...props }: BadgeProps) {
  const contentMap: Record<BadgeProps['variant'], string> = {
    first: '#1',
    second: '#2',
    third: '#3',
  };
  const content = contentMap[variant];
  return (
    <Badge className={cn(badgeVariants({ variant }), className)} {...props}>
      {content}
    </Badge>
  );
}

export { CustomBadge };
