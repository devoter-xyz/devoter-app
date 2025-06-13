"use server";

import { createRepositorySchema, CreateRepositoryInput } from "./schema";
import { createRepositoryLogic } from "./logic";

export async function createRepository(formData: FormData) {
  try {
    // Extract Form data
    const rawInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      githubUrl: formData.get("githubUrl") as string,
    };

    // Validate input using schema
    const validatedInput = createRepositorySchema.parse(rawInput);

    // Execute business logic
    const result = await createRepositoryLogic(validatedInput);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to create repository",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Server action error:", error);
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid Form data. Please check your inputs.",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Alternative function that accepts JSON input (useful for API routes or direct calls)
export async function createRepositoryFromJson(input: CreateRepositoryInput) {
  try {
    // Validate input using schema
    const validatedInput = createRepositorySchema.parse(input);

    // Execute business logic
    const result = await createRepositoryLogic(validatedInput);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to create repository",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Server action error:", error);
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data. Please check your inputs.",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
} 