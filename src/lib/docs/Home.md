## HomePage Component Documentation

The `HomePage` component is the main page of the Devoter app, responsible for displaying featured and top repositories for the current week. It provides users with a quick overview of trending repositories and their details.

### Functional Overview

- **Data Fetching:**
	- On mount, the component fetches the top repositories for the week using the `getTopReposThisWeekAction` function.
	- The fetch is limited to 6 repositories, which are then split into two groups: the first 3 as "Featured Repositories" and the next 3 as "Top Repositories".
	- While data is loading, skeleton cards are displayed to indicate loading state.

- **UI Structure:**
	- The page is divided into two main sections:
		- **Featured Repositories:** Displayed at the top, highlighted with a star icon and special card styling.
		- **Top Repositories:** Displayed below, highlighted with a chart icon and ranked with gold, silver, and bronze variants for the first three.
	- Each repository is rendered using the `RepoCard` component, which shows:
		- Repository name and owner
		- Description
		- Tags (up to 3, with a badge for additional tags)
		- Vote count for the week
		- Verification status (if applicable)
		- Favorite button (requires user authentication)

- **Interactivity:**
	- Users can click the heart icon to favorite a repository. If not signed in, they are prompted to sign in.
	- Clicking a repository card navigates to its detail page.

### Data Flow

1. **Initial State:**
	 - `repos`: Empty array
	 - `loading`: `true`
2. **Effect Hook:**
	 - Triggers data fetch on component mount
	 - Updates `repos` with fetched data or sets to empty on error
	 - Sets `loading` to `false` after fetch
3. **Rendering:**
	 - If `loading`, shows skeletons
	 - Otherwise, displays repository cards split into featured and top sections

### Key Components Used

- `RepoCard`: Displays individual repository details and actions
- `RepoCardSkeleton`: Loading placeholder for repository cards
- Icons: `Star` (featured), `ChartLine` (top)

### Customization

- The number of repositories displayed can be adjusted by changing the `limit` in the data fetch.
- Card variants and badges are used to visually distinguish featured and top repositories.

### Error Handling

- If data fetching fails, the repository lists are set to empty and no cards are shown.
- Favoriting a repository requires authentication; unauthenticated users are redirected to the sign-in page.

---

For further details, see the implementation in `src/components/pages/HomePage/HomePage.tsx` and supporting components in `src/components/common/RepoCard.tsx`.
