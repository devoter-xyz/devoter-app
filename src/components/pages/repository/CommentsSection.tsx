import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getCommentsAction } from '@/actions/discussion/getComments/action';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Discussion } from '@prisma/client';

interface CommentsSectionProps {
  repositoryId: string;
}

export const CommentsSection = ({ repositoryId }: CommentsSectionProps) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Array<Discussion & { user: { name: string | null; avatar: string | null; walletAddress: string; } }>>([]);
  const [loading, setLoading] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const fetchComments = useCallback(async (currentOffset: number) => {
    setLoading(true);
    try {
      const response = await getCommentsAction({ repositoryId, limit, offset: currentOffset });
      setComments((prevComments) => {
        if (currentOffset === 0) {
          // If fetching from the beginning, clear existing comments
          return response.comments;
        } else {
          // Otherwise, append new comments, filtering out duplicates
          const newComments = response.comments.filter(
            (newComment) => !prevComments.some((prevComment) => prevComment.id === newComment.id)
          );
          return [...prevComments, ...newComments];
        }
      });
      setTotalComments(response.totalComments);
      setOffset(currentOffset);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  }, [repositoryId, limit]);

  useEffect(() => {
    fetchComments(0);
  }, [fetchComments]);

  const handleCommentAdded = () => {
    fetchComments(0);
  };

  const handleCommentUpdated = () => {
    fetchComments(0);
  };

  const handleCommentDeleted = () => {
    fetchComments(0);
  };

  const handleLoadMore = () => {
    fetchComments(offset + limit);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments ({totalComments})</h2>
      {session?.user ? (
        <CommentForm repositoryId={repositoryId} onSuccess={handleCommentAdded} />
      ) : (
        <p className="text-center text-gray-500 mb-4">Sign in to leave a comment.</p>
      )}

      <div className="mt-6 border rounded-lg">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
          />
        ))}

        {loading && (
          <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {!loading && comments.length < totalComments && (
          <div className="text-center p-4">
            <Button onClick={handleLoadMore} variant="outline">
              Load More
            </Button>
          </div>
        )}

        {!loading && comments.length === 0 && (
          <p className="text-center text-gray-500 p-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};
