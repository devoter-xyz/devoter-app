import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { VerifiedIcon } from './VerifiedIcon';
import { Badge } from '@/components/ui/badge';
import { CustomBadge } from '@/components/common/Badge';

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

interface RepoCardViewProps {
  id: string;
  name: string;
  owner: string;
  description: string;
  logoUrl: string;
  tags: string[];
  isFavorited: boolean;
  onToggleFavorite: () => void;
  isVerified: boolean;
  votes: number;
  rank: number;
}

export const RepoCardView = ({
  className,
  variant,
  id,
  name,
  owner,
  description,
  tags,
  votes,
  isFavorited,
  isVerified,
  cardType = 'default',
  onToggleFavorite,
  ...props
}: RepoCardViewProps) => {
  const showBadge = variant === 'first' || variant === 'second' || variant === 'third';

  return (
    <div className='relative'>
      <Link href={`/repository/${id}`}>
        <Card
          className={cn(
            cardVariants({ variant }),
            `p-6 justify-between cursor-pointer shadow-lg hover:scale-[0.98] duration-300 ${
              cardType == 'featured' ? 'bg-amber-100/30 border-orange-300' : 'bg-background'
            } `,
            className
          )}
          {...props}
        >
          <CardHeader className='flex items-start justify-between p-0'>
            <Link href={`/repository/${id}`} className='flex items-center gap-4 min-w-0'>
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={48}
                height={48}
                className='h-12 w-12 rounded-full'
              />
              <div className='flex flex-col'>
                <p className='text-lg font-semibold truncate'>{name}</p>
                <p className='text-sm text-gray-500 truncate'>{owner}</p>
              </div>
            </Link>
            <div className='flex items-center flex-col gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={onToggleFavorite}
                className='text-red-500 hover:text-red-600'
                aria-label={isFavorited ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
                aria-pressed={isFavorited}
              >
                {isFavorited ? <HeartFilledIcon className='h-6 w-6' /> : <HeartIcon className='h-6 w-6' />}
              </Button>
              {isVerified && <VerifiedIcon role="img" aria-label="Verified repository" className="h-4 w-4 text-emerald-600" />}
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
                <Badge key={tag} variant={'transparent'}>{tag}</Badge>
              ))}
              {tags.length > 3 && <Badge>+{tags.length - 3}</Badge>}
            </div>
          </CardFooter>
        </Card>
      </Link>
      {showBadge && (
        <div className='absolute right-10 -top-3'>
          <CustomBadge className='absolute top-1 right-1' variant={variant} />
        </div>
      )}
    </div>
  );
};
