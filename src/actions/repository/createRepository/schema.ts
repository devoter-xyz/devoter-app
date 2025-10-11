import * as z from "zod";
import { isValidGithubUrl, getGithubRepoDetails, checkGithubRepoExists } from "@/lib/utils";

export const createRepositorySchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-_\.]+$/, { message: "Title contains invalid characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  githubUrl: z
    .string()
    .min(1, { message: "GitHub URL is required" })
    .url({ message: "Please enter a valid URL" })
    .refine(
      (url) => isValidGithubUrl(url),
      { message: "Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)" }
    )
    .refine(
      async (url) => {
        const details = getGithubRepoDetails(url);
        if (!details) return false;
        return await checkGithubRepoExists(details.owner, details.repo);
      },
      { message: "GitHub repository does not exist or is not accessible" }
    ),
});

export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>; 