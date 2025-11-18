import { createComment } from './logic';
import { createCommentSchema } from './schema';
import { authActionClient } from '@/lib/actions';

export const createCommentAction = authActionClient.action(createCommentSchema, createComment);
