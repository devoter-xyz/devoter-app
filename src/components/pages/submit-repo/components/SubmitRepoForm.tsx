'use client';

import { createPaymentAction } from '@/actions/payment/create-payment/action';
import { createRepositoryAction } from '@/actions/repository/createRepository/action';
import {
  CreateRepositoryInput,
  createRepositorySchema
} from '@/actions/repository/createRepository/schema';
import { getRepositorySubmissionCountAction } from '@/actions/repository/getRepositorySubmissionCount/action';
import { FormInput } from '@/components/common/Form/FormInput';
import { FormSubmit } from '@/components/common/Form/FormSubmit';
import { FormTextArea } from '@/components/common/Form/FormTextArea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/Form/tooltip';
import { Payment } from '@/components/common/Payment';
import { Form, FormField } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { GitBranch, Github } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function SubmitRepoForm() {
  const { toast } = useToast();
  const { executeAsync: createRepository, status: createRepositoryStatus } = useAction(createRepositoryAction);
  const { executeAsync: createPayment, status: createPaymentStatus } = useAction(createPaymentAction);
  const {
    execute: getSubmissionCount,
    result: submissionCountData,
    status: submissionCountStatus
  } = useAction(getRepositorySubmissionCountAction);
  const submissionCount = submissionCountData?.data?.count ?? 0;
  const canSubmit = submissionCount < 1;
  const isLoading = createRepositoryStatus === 'executing' || createPaymentStatus === 'executing';

  useEffect(() => {
    getSubmissionCount();
  }, [getSubmissionCount]);

  const form = useForm<CreateRepositoryInput>({
    resolver: zodResolver(createRepositorySchema),
    defaultValues: {
      title: '',
      description: '',
      githubUrl: ''
    }
  });

  async function onPaymentSuccess(txHash: string) {
    const values = form.getValues();
    try {
      const payment = await createPayment({
        amount: 0.01,
        transactionHash: txHash,
      });

      if (payment?.data?.paymentRecord?.id) {
        await createRepository({
          ...values,
          paymentId: payment.data.paymentRecord.id,
        });
        toast({
          title: 'Repository submitted successfully!',
          description: `Your repository has been submitted for voting.`,
          variant: 'default'
        });
        form.reset();
        getSubmissionCount();
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    }
  }

  return (
    <div className='space-y-8'>
      <Form {...form}>
        <form className='space-y-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormInput
                field={field}
                label='Repository Title'
                placeholder='My Awesome Project'
                disabled={isLoading || !canSubmit}
                className='focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormTextArea
                field={field}
                label='Description'
                placeholder='Describe what your repository does, its key features, and why it should be voted on...'
                disabled={isLoading || !canSubmit}
                className='min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                minHeight='100px'
              />
            )}
          />

          <FormField
            control={form.control}
            name='githubUrl'
            render={({ field }) => (
              <FormInput
                field={field}
                label='GitHub Repository URL'
                placeholder='https://github.com/username/repository'
                disabled={isLoading || !canSubmit}
                className='pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                prefixIcon={<Github className='h-4 w-4 text-gray-400' />}
              />
            )}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='rounded-md bg-card'>
                  <div className='mt-2'>
                    {submissionCountStatus === 'executing' && (
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <GitBranch className='mr-2 h-4 w-4' />
                        <div className='h-5 w-48 animate-pulse rounded-md bg-muted' />
                      </div>
                    )}
                    {submissionCountStatus === 'hasSucceeded' && (
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <GitBranch className='mr-2 h-4 w-4' />
                        <span>
                          <span className='font-bold text-primary'>
                            {submissionCount} / 1
                          </span>{' '}
                          repositories submitted this week.
                        </span>
                      </div>
                    )}
                    {submissionCountStatus === 'hasErrored' && (
                      <div className='flex items-center text-sm text-destructive'>
                        <GitBranch className='mr-2 h-4 w-4' />
                        <p>Could not load your submission count.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You can only submit one repository each week.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {canSubmit ? (
            <Payment onPaymentSuccess={onPaymentSuccess} isLoading={isLoading} />
          ) : (
            <FormSubmit
              disabled={true}
              isLoading={false}
            >
              Submission Limit Reached
            </FormSubmit>
          )}
        </form>
      </Form>
    </div>
  );
}
