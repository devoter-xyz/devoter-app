'use server';

import { getWeeklyTopReposLogic } from './logic';

export async function getWeeklyTopRepos() {
  try {
    return await getWeeklyTopReposLogic();
  } catch (error) {
    console.error('Failed to fetch weekly top repos:', error);
    return [];
  }
}
