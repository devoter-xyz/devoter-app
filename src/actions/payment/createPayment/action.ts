'use server';

import { authActionClient } from '@/lib/actions';
import { createPayment } from './logic';
import { createPaymentSchema } from './schema';

export const createPaymentAction = authActionClient
  .inputSchema(createPaymentSchema)
  .action(async ({ parsedInput, ctx }) => {
    return await createPayment(parsedInput, ctx.session);
  });
