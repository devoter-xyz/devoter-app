import { deleteComment } from './logic';
import { deleteCommentSchema } from './schema';
import { authActionClient } from '@/lib/actions';

export const deleteCommentAction = authActionClient.action(deleteCommentSchema, deleteComment);
