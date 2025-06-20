"use client";

import {CreateRepositoryInput, createRepositorySchema} from "@/actions/repository/CreateRepository/schema";
import { FormInput } from '@/components/common/Form/FormInput';
import { FormSubmit } from '@/components/common/Form/FormSubmit';
import { FormTextArea } from '@/components/common/Form/FormTextArea';
import {
  Form,
  FormField
} from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createRepository } from "@/actions/repository/CreateRepository/action";

export function SubmitRepoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateRepositoryInput>({
    resolver: zodResolver(createRepositorySchema),
    defaultValues: {
      title: "",
      description: "",
      githubUrl: "",
    },
  });

  async function onSubmit(values: CreateRepositoryInput) {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("githubUrl", values.githubUrl);

    try {
      const result = await createRepository(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit repository");
      }

      toast({
        title: "Repository Submitted Successfully!",
        description: `Your repository has been submitted for voting.`,
        variant: "default",
      });

      form.reset();
    } catch (err: any) {
      console.error("Submission error:", err);

      toast({
        title: "Submission Failed",
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormInput
            field={field}
            label="Repository Title"
            placeholder="My Awesome Project"
            disabled={isLoading}
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormTextArea
            field={field}
            label="Description"
            placeholder="Describe what your repository does, its key features, and why it should be voted on..."
            disabled={isLoading}
            className="min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            minHeight="100px"
          />
        )}
      />

      <FormField
        control={form.control}
        name="githubUrl"
        render={({ field }) => (
          <FormInput
            field={field}
            label="GitHub Repository URL"
            placeholder="https://github.com/username/repository"
            disabled={isLoading}
            className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            prefixIcon={<Github className="h-4 w-4 text-gray-400" />}
          />
        )}
      />

      <div className="pt-4">
        <FormSubmit
          isLoading={isLoading}
        >
          Submit Repository
        </FormSubmit>
      </div>
    </form>
  </Form>
}