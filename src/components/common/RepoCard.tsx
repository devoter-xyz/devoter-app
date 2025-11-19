import { toggleFavoriteAction } from '@/actions/repository/toggleFavorite';
import { useSession } from '@/components/providers/SessionProvider';
import { useRouter, useSearchParams } from 'next/navigation';
"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RepoCardView, RepoCardViewProps } from './RepoCardView';

export interface RepoCardProps extends Omit<RepoCardViewProps, 'onToggleFavorite' | 'isFavorited'> {
  isFavorited?: boolean;
}

const RepoCard = ({ isFavorited = false, ...props }: RepoCardProps) => {
  const [localIsFavorited, setLocalIsFavorited] = useState(isFavorited);
  const { user } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalIsFavorited(isFavorited);
  }, [isFavorited]);

  const handleToggleFavorite = async () => {

    if (!user) {
      toast.error('Please sign in to favorite repositories');
      router.push('/signin');
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleFavoriteAction({
        repositoryId: props.id
      });
      if (result.data) {
        setLocalIsFavorited(result.data.isFavorited);
        toast.success(
          result.data.isFavorited
            ? `Added ${props.name} to favorites!`
            : `Removed ${props.name} from favorites!`
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('not logged in') || error.message.includes('No record was found'))
      ) {
        toast.error('Please sign in to favorite repositories');
        router.push('/signin');
      } else {
        toast.error('Failed to toggle favorite status');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCompare = () => {
    const currentRepoIds = searchParams.getAll('repoIds');
    const newRepoIds = currentRepoIds.includes(props.id)
      ? currentRepoIds
      : [...currentRepoIds, props.id];

    const params = new URLSearchParams(searchParams.toString());
    params.delete('repoIds'); // Clear existing to avoid duplicates

    newRepoIds.forEach((id) => params.append('repoIds', id));

    router.push(`/compare?${params.toString()}`);
    toast.info(`Added ${props.name} to comparison!`);
  };

  return (
    <RepoCardView
      {...props}
      isFavorited={localIsFavorited}
      onToggleFavorite={handleToggleFavorite}
      onAddToCompare={handleAddToCompare}
      isLoading={isLoading}
    />
  );
};

export default RepoCard;
