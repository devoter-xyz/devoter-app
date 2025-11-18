import { updateComment } from './logic';
import { updateCommentSchema } from './schema';
import { authActionClient } from '@/lib/actions';

export const updateCommentAction = authActionClient.action(updateCommentSchema, updateComment);
