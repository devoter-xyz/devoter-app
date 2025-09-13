import { Button } from '@/components/ui/button';
import { Plus, Github } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormField } from '@/components/ui/form';
import { FormInput } from '@/components/common/Form/FormInput';
import { FormTextArea } from '@/components/common/Form/FormTextArea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';

// Form schema
const repositorySchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  githubUrl: z.string().url({ message: 'Please enter a valid GitHub URL' })
});

type RepositoryFormValues = z.infer<typeof repositorySchema>;

export const SubmitRepositoryButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RepositoryFormValues>({
    resolver: zodResolver(repositorySchema),
    defaultValues: {
      title: '',
      description: '',
      githubUrl: ''
    }
  });

  const onSubmit = async (values: RepositoryFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would call your repository creation action
      console.log('Repository submitted:', values);
      toast.success('Repository submitted successfully!');
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit repository. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full'>
          <Plus className='w-5 h-5' />
          Submit Repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Repository</DialogTitle>
          <DialogDescription>
            Submit your GitHub repository for community voting
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormInput
                  field={field}
                  label='Repository Title'
                  placeholder='My Awesome Project'
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  prefixIcon={<Github className='h-4 w-4 text-gray-400' />}
                />
              )}
            />
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Repository'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
