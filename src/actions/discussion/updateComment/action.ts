import { updateComment } from './logic';
import { updateCommentSchema } from './schema';
import { action } from '@/lib/actions';

export const updateCommentAction = action(updateCommentSchema, updateComment);
