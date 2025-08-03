import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Coins,
  FileText,
  GitFork,
  Globe,
  Heart,
  Star,
  Github,
  TrendingUp,
  VerifiedIcon
} from 'lucide-react';
import Image from 'next/image';

export interface RepoSummaryProps {
  id: string;
  name: string;
  owner: string;
  description: string;
  githubUrl: string;
  websiteUrl?: string;
  docsUrl?: string;
  tags?: string[];
  totalVotes: number;
  githubStars?: number;
  githubForks?: number;
  weeklyRank?: number;
  isFavorited?: boolean;
  isVerified?: boolean;
  logoUrl?: string;
  className?: string;
  onVote?: () => void;
  onFavorite?: () => void;
}

const RepoSummary: React.FC<RepoSummaryProps> = ({
  // id,
  name,
  owner,
  description,
  // githubUrl,
  // websiteUrl,
  // docsUrl,
  tags = [],
  totalVotes,
  githubStars,
  githubForks,
  weeklyRank,
  isFavorited = false,
  isVerified = false,
  logoUrl,
  className,
  onVote,
  onFavorite
}) => {
  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // const formatRank = (rank?: number) => {
  //   if (!rank) return 'N/A';
  //   const suffix = ['th', 'st', 'nd', 'rd'];
  //   const v = rank % 100;
  //   return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  // };

  return (
    <div className={cn('w-full max-w-5xl mx-auto', className)}>
      {/* Main Repository Info */}
      <Card className='p-6 mb-6 bg-white border border-gray-200 rounded-2xl shadow-sm'>
        <div className='flex w-full'>
          <div className='flex flex-col gap-4 w-full'>
            {/* Repository Icon */}
            <div className='relative flex flex-row justify-between items-center flex-grow'>
              <div className='flex flex-row gap-4 items-center'>
                <div className='w-14 h-14 bg-blue-900 rounded-xl flex items-center justify-center'>
                  <Image
                    src={logoUrl || '/dev-token-logo.png'}
                    alt={`${name} logo`}
                    width={32}
                    height={32}
                    className='w-8 h-8 object-cover'
                  />
                </div>
                <div>
                  <div className='flex items-center gap-3 mb-1'>
                    <h1 className='text-2xl font-bold text-gray-900'>{name}</h1>
                    {isVerified && <VerifiedIcon className='w-5 h-5 text-blue-500 fill-blue-500' />}
                  </div>
                  <p className='text-gray-600 mb-3'>@{owner}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-3'>
                <Button
                  onClick={onFavorite}
                  variant='outline'
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors',
                    isFavorited && 'border-red-200 text-red-600 bg-red-50'
                  )}
                >
                  <Heart
                    className={cn('w-4 h-4', {
                      'fill-red-500 text-red-500': isFavorited,
                      'text-gray-600': !isFavorited
                    })}
                  />
                </Button>
                <Button
                  onClick={onVote}
                  className='flex items-center gap-2 px-6 py-2 border border-primary text-primary bg-white hover:bg-primary hover:text-white rounded-lg font-medium transition-colors'
                >
                  <Coins className='w-4 h-4' /> Vote {name}
                </Button>
              </div>
            </div>

            {/* Repository Details */}
            <div className='flex-1'>
              <p className='text-gray-700 mb-4 max-w-3xl leading-relaxed'>{description}</p>

              {/* Tags */}
              {tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-4'>
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='bg-purple-100 text-primary border border-primary hover:bg-purple-200 rounded-md px-3 py-1'
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className='flex items-center gap-4'>
                <Github className='w-4 h-4 text-gray-500' />
                <Globe className='w-4 h-4 text-gray-500' />
                <FileText className='w-4 h-4 text-gray-500' />
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-4 gap-4'>
          <Card className='p-6 flex flex-col items-center text-center bg-white border border-gray-200 rounded-xl'>
            <div className='mb-4'>
              <Coins className='w-6 h-6 text-gray-600' />
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-1'>{formatNumber(totalVotes)}</div>
            <div className='text-sm text-gray-600'>Total Votes</div>
          </Card>

          <Card className='p-6 flex flex-col items-center text-center bg-white border border-gray-200 rounded-xl'>
            <div className='mb-4'>
              <Star className='w-6 h-6 text-gray-600' />
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-1'>{formatNumber(githubStars)}</div>
            <div className='text-sm text-gray-600'>Github Stars</div>
          </Card>

          <Card className='p-6 flex flex-col items-center text-center bg-white border border-gray-200 rounded-xl'>
            <div className='mb-4'>
              <GitFork className='w-6 h-6 text-gray-600' />
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-1'>{formatNumber(githubForks)}</div>
            <div className='text-sm text-gray-600'>Forks</div>
          </Card>

          <Card className='p-6 flex flex-col items-center text-center bg-white border border-gray-200 rounded-xl'>
            <div className='mb-4'>
              <TrendingUp className='w-6 h-6 text-gray-600' />
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-1'>{weeklyRank || 1}</div>
            <div className='text-sm text-gray-600'>This Week</div>
          </Card>
        </div>
      </Card>

      {/* Statistics Cards */}
    </div>
  );
};

export default RepoSummary;
