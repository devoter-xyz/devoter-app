import * as z from "zod";

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
      (url) => url.includes("github.com"),
      { message: "Please enter a valid GitHub repository URL" }
    )
    .refine(
      (url) => {
        const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/;
        return githubRegex.test(url);
      },
      { message: "Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)" }
    ),
});

export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>; 