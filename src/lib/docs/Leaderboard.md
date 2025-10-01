# Leaderboard

The **Leaderboard** feature showcases the top repositories submitted by users on the Devoter platform. It provides a transparent and engaging way for the community to see which projects are receiving the most votes and recognition each week.

## How It Works

1. **Accessing the Leaderboard**
   - Navigate to the **Leaderboard** page from the main navigation or dashboard.

2. **Leaderboard Display**
   - The page lists repositories ranked by the number of votes received.
   - Each entry typically displays:
     - Repository title
     - Description
     - GitHub link
     - Vote count
     - Additional metadata (e.g., submitter, submission date)

3. **Weekly Cycle**
   - The leaderboard is updated on a weekly basis, reflecting the latest voting results.
   - Only repositories submitted during the current week are eligible for ranking.

4. **Voting**
   - Users can vote for their favorite repositories directly from the leaderboard or related pages.
   - Voting is subject to platform rules and may require authentication.

## UI Components Used
- **RepoCard**: Displays repository details and vote count
- **Leaderboard List**: Renders the ranked list of repositories
- **Pagination/Filters**: (If implemented) Allows users to browse different weeks or filter results

## Notes
- The leaderboard promotes healthy competition and highlights quality projects.
- Repository rankings reset each week to give new submissions a chance to be featured.
- Only valid, public repositories are shown.

---

For more details, see the source code in `src/app/leaderboard/page.tsx` and related components in `src/components/pages/leaderboard/`.
