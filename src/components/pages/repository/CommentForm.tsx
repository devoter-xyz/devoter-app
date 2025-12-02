import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { createCommentAction } from '@/actions/discussion/createComment/action';
import { updateCommentAction } from '@/actions/discussion/updateComment/action';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MAX_COMMENT_LENGTH = 1000;

const formSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.').max(MAX_COMMENT_LENGTH, 'Comment is too long.'),
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

  const [charCount, setCharCount] = useState(initialContent.length);

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
      setCharCount(0); // Reset char count after successful submission
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    field.onChange(e);
  };

  const charCountColorClass = cn(
    'text-sm',
    {
      'text-orange-500': charCount >= MAX_COMMENT_LENGTH * 0.8 && charCount < MAX_COMMENT_LENGTH,
      'text-red-500': charCount >= MAX_COMMENT_LENGTH,
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Write a comment..." {...field} onChange={handleContentChange} rows={3} />
              </FormControl>
              <div className="flex justify-between">
                <FormMessage />
                <span className={charCountColorClass}>
                  {charCount}/{MAX_COMMENT_LENGTH}
                </span>
              </div>
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
