'use server';

import { actionClient } from '@/lib/actions';
import crypto from 'crypto';

export const getNonceAction = actionClient.action(async () => {
  return crypto.randomBytes(32).toString('hex');
});