import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'absolute -right-1 -top-2 flex items-center justify-center rounded-lg bg-brand-purple/10 px-3 py-1.5 text-xs font-bold text-brand-purple',
  {
    variants: {
      variant: {
        first: 'bg-brand-purple/10 text-brand-purple',
        second: 'bg-brand-purple/10 text-brand-purple',
        third: 'bg-brand-purple/10 text-brand-purple',
      },
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const content = variant === 'first' ? '#1' : variant === 'second' ? '#2' : '#3';
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {content}
    </div>
  );
}

export { Badge, badgeVariants };
