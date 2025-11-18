import { getComments } from './logic';
import { getCommentsSchema } from './schema';
import { action } from '@/lib/actions';

export const getCommentsAction = action(getCommentsSchema, getComments);
