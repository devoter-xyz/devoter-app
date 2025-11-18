import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { createCommentAction } from '@/actions/discussion/createComment/action';
import { updateCommentAction } from '@/actions/discussion/updateComment/action';
import { toast } from 'sonner';

const formSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.').max(1000, 'Comment is too long.'),
});

interface CommentFormProps {
  repositoryId: string;
  initialContent?: string;
  commentId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CommentForm = ({ repositoryId, initialContent = '', commentId, onSuccess, onCancel }: CommentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialContent,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (commentId) {
        await updateCommentAction({ commentId, content: values.content });
        toast.success('Comment updated successfully.');
      } else {
        await createCommentAction({ repositoryId, content: values.content });
        toast.success('Comment added successfully.');
      }
      form.reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Write a comment..." {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {commentId ? 'Update Comment' : 'Add Comment'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
