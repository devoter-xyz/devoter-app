import { deleteComment } from './logic';
import { deleteCommentSchema } from './schema';
import { action } from '@/lib/actions';

export const deleteCommentAction = action(deleteCommentSchema, deleteComment);
