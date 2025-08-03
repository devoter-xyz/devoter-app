import { CustomBadge } from '@/components/common/Badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Heart, VerifiedIcon } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const cardVariants = cva('h-full w-full rounded-2xl', {
  variants: {
    variant: {
      default: 'border-border bg-card',
      featured: 'border-gradient-featured bg-gradient-2/5',
      first: 'border-gradient-gold bg-gold/5',
      second: 'border-gradient-silver bg-silver/5',
      third: 'border-gradient-bronze bg-bronze/5'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface RepoCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  name: string;
  owner: string;
  description: string;
  tags: string[];
  votes: number;
  isFavorited?: boolean;
  isVerified?: boolean;
  cardType?: 'default' | 'featured';
  appLogo: string;
}

const RepoCard = ({
  className,
  variant,
  name,
  owner,
  description,
  tags,
  votes,
  isFavorited,
  isVerified,
  appLogo,
  cardType = 'default',
  ...props
}: RepoCardProps) => {
  const showBadge = variant === 'first' || variant === 'second' || variant === 'third';

  return (
    <div className='relative'>
      <Card className={cn(cardVariants({ variant }), `p-6 justify-between ${ cardType == 'featured' ? "bg-amber-100/30 border-orange-300" : "bg-background" } `, className)} {...props}>
        <CardHeader className='flex items-start justify-between p-0'>
          <div className='flex w-full items-start justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div>
                <Image src={appLogo} alt='dev' height={48} width={48} className='h-12 w-12 rounded-lg' />
              </div>
              <div>
                <h3 className='text-xl font-bold'>{name}</h3>
                <p className='text-muted-foreground'>@{owner}</p>
              </div>
            </div>
            <div className='flex items-center flex-col gap-2'>
              <Button variant={'ghost'} className='hover:bg-red-100 hover:text-red-500'>
                <Heart className={cn('h-6 w-6', { 'fill-red-500 text-red-500': isFavorited })} />
              </Button>
              {isVerified && <VerifiedIcon />}
            </div>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 p-0 pt-6'>
          <div className='flex items-center gap-2'>
            <div>
              <Image src={'/dev-token-logo.png'} alt='dev' height={10} width={10} className='h-5 w-5' />
            </div>
            <p className='font-bold text-brand-purple'>
              {votes} Votes <span className='text-muted-foreground font-normal'>This Week</span>
            </p>
          </div>
          <p className='text-lg text-muted-foreground'>{description}</p>
        </CardContent>
        <CardFooter className='p-0 pt-6'>
          <div className='-ml-1 flex flex-wrap gap-2'>
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            {tags.length > 3 && <Badge>+{tags.length - 3}</Badge>}
          </div>
        </CardFooter>
      </Card>
      {showBadge && (
        <div className='absolute right-10 -top-3'>
          <CustomBadge className='absolute top-1 right-1' variant={variant} />
        </div>
      )}
    </div>
  );
};

export default RepoCard;
