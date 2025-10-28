import { cn } from '@/lib/utils';

import { Badge, badgeVariants } from '../ui/badge';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'first' | 'second' | 'third' | 'default'; // Include 'default' as a possible variant
  rank?: number; // Make rank optional
}

function CustomBadge({ className, variant, rank, ...props }: BadgeProps) {
  const contentMap: Record<Exclude<BadgeProps['variant'], 'default'>, string> = {
    first: '#1',
    second: '#2',
    third: '#3',
  };
  // Display rank if provided and positive, otherwise use the variant-based content
  const content = (typeof rank === 'number' && rank > 0) ? `#${rank}` : (variant !== 'default' ? contentMap[variant] : '');
  return (
    <Badge className={cn(badgeVariants({ variant }), className)} {...props}>
      {content}
    </Badge>
  );
}

export { CustomBadge };
