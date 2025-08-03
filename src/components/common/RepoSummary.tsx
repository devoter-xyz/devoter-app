import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  VerifiedIcon, 
  ExternalLink, 
  Star, 
  GitFork, 
  TrendingUp,
  Globe,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, className }) => (
  <Card className={cn('p-4 flex flex-col items-center text-center', className)}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <span className="text-2xl font-bold">{value}</span>
  </Card>
);

const RepoSummary: React.FC<RepoSummaryProps> = ({
  id,
  name,
  owner,
  description,
  githubUrl,
  websiteUrl,
  docsUrl,
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
  onFavorite,
}) => {
  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatRank = (rank?: number) => {
    if (!rank) return 'N/A';
    const suffix = ['th', 'st', 'nd', 'rd'];
    const v = rank % 100;
    return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Main Repository Info */}
      <Card className="p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            {/* Repository Icon */}
            <div className="relative">
              <Image
                src={logoUrl || '/dev-token-logo.png'}
                alt={`${name} logo`}
                width={80}
                height={80}
                className="w-20 h-20 rounded-lg object-cover"
              />
              {isVerified && (
                <div className="absolute -top-2 -right-2">
                  <VerifiedIcon className="w-6 h-6 text-blue-500 fill-blue-500" />
                </div>
              )}
            </div>

            {/* Repository Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{name}</h1>
              </div>
              <p className="text-xl text-muted-foreground mb-4">@{owner}</p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                {description}
              </p>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-4">
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  GitHub
                </Link>
                {websiteUrl && (
                  <Link
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </Link>
                )}
                {docsUrl && (
                  <Link
                    href={docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Docs
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={onFavorite}
              variant="outline"
              size="lg"
              className={cn(
                'flex items-center gap-2 transition-colors',
                isFavorited && 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              )}
            >
              <Heart
                className={cn('w-5 h-5', {
                  'fill-red-500 text-red-500': isFavorited,
                })}
              />
              {isFavorited ? 'Favorited' : 'Favorite'}
            </Button>
            <Button
              onClick={onVote}
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Image
                src="/dev-token-logo.png"
                alt="DEV token"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              Vote
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={
            <Image
              src="/dev-token-logo.png"
              alt="DEV token"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          }
          label="Total Votes"
          value={formatNumber(totalVotes)}
          className="border-purple-200 bg-purple-50/50"
        />
        
        <StatCard
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          label="GitHub Stars"
          value={formatNumber(githubStars)}
          className="border-yellow-200 bg-yellow-50/50"
        />
        
        <StatCard
          icon={<GitFork className="w-5 h-5 text-blue-500" />}
          label="Forks"
          value={formatNumber(githubForks)}
          className="border-blue-200 bg-blue-50/50"
        />
        
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          label="This Week's Rank"
          value={formatRank(weeklyRank)}
          className="border-green-200 bg-green-50/50"
        />
      </div>
    </div>
  );
};

export default RepoSummary;
