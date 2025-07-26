import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Coins, Heart } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import VerifiedIcon from '@/components/common/VerifiedIcon';

const cardVariants = cva('h-full w-full rounded-2xl', {
  variants: {
    variant: {
      default: 'border-border bg-card',
      featured: 'border-gradient-featured bg-gradient-2/5',
      first: 'border-gradient-gold bg-gold/5',
      second: 'border-gradient-silver bg-silver/5',
      third: 'border-gradient-bronze bg-bronze/5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface RepoCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  name: string;
  owner: string;
  description: string;
  tags: string[];
  votes: number;
  isFavorited?: boolean;
  isVerified?: boolean;
}

const RepoCard = ({ className, variant, name, owner, description, tags, votes, isFavorited, isVerified, ...props }: RepoCardProps) => {
  const showBadge = variant === 'first' || variant === 'second' || variant === 'third';

  return (
    <div className="relative">
      <Card className={cn(cardVariants({ variant }), 'p-6', className)} {...props}>
        <CardHeader className="flex items-start justify-between p-0">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted" />
              <div>
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-muted-foreground">@{owner}</p>
              </div>
            </div>
            <div className="flex items-center flex-col gap-2">
              <button>
                <Heart className={cn('h-6 w-6', { 'fill-red-500 text-red-500': isFavorited })} />
              </button>
              {isVerified && <VerifiedIcon />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0 pt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple/10">
              <Coins className="h-4 w-4 text-brand-purple" />
            </div>
            <p className="font-bold text-brand-purple">{votes}k Votes <span className="text-muted-foreground">This Week</span></p>
          </div>
          <p className="text-lg text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="p-0 pt-6">
          <div className="-ml-1 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-lg border border-primary/50 bg-primary/10 px-3 py-1 text-sm text-primary">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-lg border border-primary/50 bg-primary/10 px-3 py-1 text-sm text-primary">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
      {showBadge && <div className="absolute right-10 -top-3 py-3 px-6 bg-purple-100 rounded-lg border border-purple-500 inline-flex items-center justify-center">
        <Badge className='absolute -top-0.5 right-1 text-purple-500' variant={variant} />
      </div>
      }
    </div>
  );
};

export default RepoCard;
