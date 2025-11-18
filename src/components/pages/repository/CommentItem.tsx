import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Discussion } from '@prisma/client';
import { CommentForm } from './CommentForm';
import { deleteCommentAction } from '@/actions/discussion/deleteComment/action';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: Discussion & { user: { name: string | null; avatar: string | null; walletAddress: string; } };
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
}

export const CommentItem = ({ comment, onCommentUpdated, onCommentDeleted }: CommentItemProps) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = session?.user?.id === comment.userId;

  const handleDelete = async () => {
    try {
      await deleteCommentAction({ commentId: comment.id });
      toast.success('Comment deleted successfully.');
      onCommentDeleted();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex space-x-4 p-4 border-b">
      <Avatar>
        <AvatarImage src={comment.user.avatar || undefined} />
        <AvatarFallback>{comment.user.name?.charAt(0) || comment.user.walletAddress.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{comment.user.name || comment.user.walletAddress}</div>
          <div className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </div>
        </div>
        {isEditing ? (
          <CommentForm
            repositoryId={comment.repositoryId}
            initialContent={comment.content}
            commentId={comment.id}
            onSuccess={() => {
              setIsEditing(false);
              onCommentUpdated();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="mt-1 text-gray-700">{comment.content}</p>
        )}
        {isAuthor && !isEditing && (
          <div className="mt-2 space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500">
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
