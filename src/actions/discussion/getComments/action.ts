import { getComments } from './logic';
import { getCommentsSchema } from './schema';
import { actionClient } from '@/lib/actions';

export const getCommentsAction = actionClient.action(getCommentsSchema, getComments);
