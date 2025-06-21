'use client';

import { getRepositorySubmissionCountAction } from '@/actions/repository/GetRepositorySubmissionCount/action';
import { createRepositoryAction } from '@/actions/repository/CreateRepository/action';
import {
  CreateRepositoryInput,
  createRepositorySchema
} from '@/actions/repository/CreateRepository/schema';
import { FormInput } from '@/components/common/Form/FormInput';
import { FormSubmit } from '@/components/common/Form/FormSubmit';
import { FormTextArea } from '@/components/common/Form/FormTextArea';
import { Form, FormField } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/Form/tooltip';
import { GitBranch, Github } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export function SubmitRepoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { executeAsync: createRepository } = useAction(createRepositoryAction);
  const {
    execute: getSubmissionCount,
    result: submissionCountData,
    status: submissionCountStatus
  } = useAction(getRepositorySubmissionCountAction);
  const submissionCount = submissionCountData?.data?.count ?? 0;
  const canSubmit = submissionCount < 3;

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

  async function onSubmit(values: CreateRepositoryInput) {
    setIsLoading(true);

    try {
      await createRepository(values);

      toast({
        title: 'Repository submitted successfully!',
        description: `Your repository has been submitted for voting.`,
        variant: 'default'
      });

      form.reset();
      getSubmissionCount();
    } catch (error) {
      console.error('Submission error:', error);

      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='space-y-8'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                            {submissionCount} / 3
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
                <p>You can only submit a maximum of 3 repositories each week.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <FormSubmit
            disabled={isLoading || !form.formState.isValid || !canSubmit}
            isLoading={isLoading}
          >
            {canSubmit ? 'Submit' : 'Submission Limit Reached'}
          </FormSubmit>
        </form>
      </Form>
    </div>
  );
}
