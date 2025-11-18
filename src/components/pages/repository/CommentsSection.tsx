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

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCommentsAction({ repositoryId, limit, offset });
      setComments((prevComments) => {
        const newComments = response.comments.filter(
          (newComment) => !prevComments.some((prevComment) => prevComment.id === newComment.id)
        );
        return [...prevComments, ...newComments];
      });
      setTotalComments(response.totalComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  }, [repositoryId, limit, offset]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentAdded = () => {
    setComments([]); // Clear existing comments to refetch all from start
    setOffset(0);
    fetchComments();
  };

  const handleCommentUpdated = () => {
    setComments([]); // Clear existing comments to refetch all from start
    setOffset(0);
    fetchComments();
  };

  const handleCommentDeleted = () => {
    setComments([]); // Clear existing comments to refetch all from start
    setOffset(0);
    fetchComments();
  };

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
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
