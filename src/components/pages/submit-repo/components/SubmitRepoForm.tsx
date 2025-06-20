'use client';

import { createRepositoryAction } from '@/actions/repository/createRepository/action';
import { CreateRepositoryInput, createRepositorySchema } from '@/actions/repository/createRepository/schema';
import { FormInput } from '@/components/common/Form/FormInput';
import { FormSubmit } from '@/components/common/Form/FormSubmit';
import { FormTextArea } from '@/components/common/Form/FormTextArea';
import { Form, FormField } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function SubmitRepoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { executeAsync: createRepository } = useAction(createRepositoryAction);

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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
              className='pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              prefixIcon={<Github className='h-4 w-4 text-gray-400' />}
            />
          )}
        />

        <FormSubmit disabled={isLoading || !form.formState.isValid} isLoading={isLoading}>
          Submit
        </FormSubmit>
      </form>
    </Form>
  );
}
