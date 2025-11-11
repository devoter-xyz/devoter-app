import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines Tailwind CSS classes and other class values into a single string.
 * @param inputs - An array of ClassValue (string, array, or object) to be combined.
 * @returns A string containing the merged Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Checks if a given URL is a valid GitHub repository URL.
 * @param url - The URL string to validate.
 * @returns True if the URL is a valid GitHub repository URL, false otherwise.
 */
export function isValidGithubUrl(url: string): boolean {
  const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/;
  return githubRegex.test(url);
}

/**
 * Extracts the owner and repository name from a valid GitHub URL.
 * @param url - The GitHub repository URL.
 * @returns An object containing the owner and repo name, or null if the URL is invalid.
 */
export function getGithubRepoDetails(url: string): { owner: string; repo: string } | null {
  const match = url.match(/^https:\/\/github\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-._]+)$/);
  if (match && match[1] && match[2]) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
}

/**
 * Checks if a GitHub repository exists by making a fetch request to the GitHub API.
 * @param owner - The owner of the GitHub repository.
 * @param repo - The name of the GitHub repository.
 * @returns A promise that resolves to true if the repository exists, false otherwise.
 */
export async function checkGithubRepoExists(owner: string, repo: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    return response.ok; // 200 OK indicates the repository exists
  } catch (error) {
    console.error("Error checking GitHub repository existence:", error);
    return false;
  }
}