import { createComment } from './logic';
import { createCommentSchema } from './schema';
import { action } from '@/lib/actions';

export const createCommentAction = action(createCommentSchema, createComment);
