'use server';

import { filterRepositoriesSchema } from "./schema";
import { filterRepositoriesLogic } from "./logic";

export async function filterRepositories(filters: unknown) {
  const parsedFilters = filterRepositoriesSchema.safeParse(filters);

  if (!parsedFilters.success) {
    throw new Error("Invalid filter parameters");
  }

  return filterRepositoriesLogic(parsedFilters.data);
}
