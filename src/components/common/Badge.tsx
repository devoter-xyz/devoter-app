import { type VariantProps } from 'class-variance-authority';

import { Badge, badgeVariants } from '../ui/badge';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function CustomBadge({ className, variant, ...props }: BadgeProps) {
  const content = variant === 'first' ? '#1' : variant === 'second' ? '#2' : '#3';
  return (
    <Badge variant={variant} className={className} {...props}>
      {content}
    </Badge>
  );
}

export { CustomBadge };
