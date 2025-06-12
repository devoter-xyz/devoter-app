"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Github, Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { repositorySchema, RepositoryFormValues } from "@/lib/validations/repository";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/components/ui/toast-simple";
import { SubmissionStatus } from "@/components/ui/submission-status";

interface RepositoryFormProps {
  currentSubmissions?: number;
  maxSubmissions?: number;
  weekStart?: string;
  weekEnd?: string;
}

export function RepositoryForm({ 
  currentSubmissions = 0, 
  maxSubmissions = 3, 
  weekStart = "Jan 1", 
  weekEnd = "Jan 7" 
}: RepositoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast, toasts, dismiss } = useToast();

  const form = useForm<RepositoryFormValues>({
    resolver: zodResolver(repositorySchema),
    defaultValues: {
      title: "",
      description: "",
      githubUrl: "",
    },
  });

  const remainingSubmissions = maxSubmissions - currentSubmissions;
  const isLimitReached = remainingSubmissions <= 0;

  async function onSubmit(values: RepositoryFormValues) {
    if (isLimitReached) {
      toast({
        title: "Submission Limit Reached",
        description: "You've reached your weekly submission limit. Please try again next week.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/repositories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit repository");
      }

      const result = await response.json();
      
      // Show success message
      toast({
        title: "Repository Submitted Successfully!",
        description: `Your repository has been submitted for voting. You have ${remainingSubmissions - 1} submissions remaining this week.`,
        variant: "default",
      });

      // Reset form and show success state
      form.reset();
      setIsSubmitted(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);

    } catch (err: any) {
      console.error("Submission error:", err);
      
      // Show error message
      toast({
        title: "Submission Failed",
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md border border-green-200 rounded-lg px-7 py-10 shadow-md bg-green-50">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Repository Submitted!
          </h3>
          <p className="text-sm text-green-600 mb-4">
            Your repository has been successfully submitted for voting.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            Submit Another Repository
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-md border border-gray-200 rounded-lg px-7 py-10 shadow-md bg-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submit Repository
          </h2>
          <p className="text-sm text-gray-600">
            Submit your GitHub repository for community voting
          </p>
        </div>

        {/* Submission Status */}
        <SubmissionStatus
          currentSubmissions={currentSubmissions}
          maxSubmissions={maxSubmissions}
          weekStart={weekStart}
          weekEnd={weekEnd}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }: { field: ControllerRenderProps<RepositoryFormValues, "title"> }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Repository Title
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="My Awesome Project" 
                      {...field} 
                      disabled={isLoading || isLimitReached}
                      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: ControllerRenderProps<RepositoryFormValues, "description"> }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what your repository does, its key features, and why it should be voted on..."
                      {...field} 
                      disabled={isLoading || isLimitReached}
                      className="min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }: { field: ControllerRenderProps<RepositoryFormValues, "githubUrl"> }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    GitHub Repository URL
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="https://github.com/username/repository" 
                        {...field} 
                        disabled={isLoading || isLimitReached}
                        className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading || isLimitReached}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : isLimitReached ? (
                  "Weekly Limit Reached"
                ) : (
                  "Submit Repository"
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>• You can submit up to {maxSubmissions} repositories per week</p>
              <p>• Repositories will be reviewed before voting begins</p>
            </div>
          </form>
        </Form>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
} 