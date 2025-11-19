import { getRepositoriesForComparison } from "./logic";

export async function compareRepositoriesAction(repositoryIds: string[]) {
  try {
    const repositories = await getRepositoriesForComparison(repositoryIds);
    return { success: true, repositories };
  } catch (error) {
    console.error("Error comparing repositories:", error);
    return { success: false, error: "Failed to compare repositories." };
  }
}
