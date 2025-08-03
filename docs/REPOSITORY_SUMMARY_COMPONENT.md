# Repository Summary Component

A comprehensive repository summary component built for the Devoter app that displays detailed repository information with interactive features and statistics.

## Features

### Visual Elements
- **Repository Icon/Logo**: Displays the repository's logo or a default placeholder
- **Repository Name & Owner**: Shows the repository title and owner information
- **Description**: Detailed description of the repository
- **Verification Badge**: Visual indicator for verified repositories
- **Tags**: Categorization tags for the repository
- **External Links**: Links to GitHub, website, and documentation with appropriate icons

### Interactive Elements
- **Vote Button**: Allows users to vote for repositories using DEV tokens
- **Favorite Button**: Toggle favorite status with heart icon animation
- **Responsive Design**: Adapts to different screen sizes
- **Hover Effects**: Interactive feedback for all clickable elements

### Statistics Cards
Four informational cards displaying:
1. **Total Votes**: Shows vote count with DEV token icon
2. **GitHub Stars**: Repository star count from GitHub
3. **GitHub Forks**: Repository fork count from GitHub
4. **Weekly Rank**: Current week's ranking position

## Component Props

```typescript
interface RepoSummaryProps {
  id: string;                    // Unique repository identifier
  name: string;                  // Repository name
  owner: string;                 // Repository owner/organization
  description: string;           // Repository description
  githubUrl: string;            // GitHub repository URL
  websiteUrl?: string;          // Optional website URL
  docsUrl?: string;             // Optional documentation URL
  tags?: string[];              // Optional array of tags
  totalVotes: number;           // Total vote count
  githubStars?: number;         // GitHub stars count
  githubForks?: number;         // GitHub forks count
  weeklyRank?: number;          // Current week ranking
  isFavorited?: boolean;        // Favorite status
  isVerified?: boolean;         // Verification status
  logoUrl?: string;             // Optional logo URL
  className?: string;           // Additional CSS classes
  onVote?: () => void;          // Vote button callback
  onFavorite?: () => void;      // Favorite button callback
}
```

## Usage

### Basic Usage

```tsx
import RepoSummary from '@/components/common/RepoSummary';

function RepositoryPage() {
  const handleVote = () => {
    // Implement vote logic
    console.log('Repository voted');
  };

  const handleFavorite = () => {
    // Implement favorite logic
    console.log('Repository favorited');
  };

  return (
    <RepoSummary
      id="repo-id"
      name="Next.js"
      owner="vercel"
      description="The React Framework for the Web"
      githubUrl="https://github.com/vercel/next.js"
      websiteUrl="https://nextjs.org"
      docsUrl="https://nextjs.org/docs"
      tags={['React', 'TypeScript', 'Framework']}
      totalVotes={2850}
      githubStars={128000}
      githubForks={26700}
      weeklyRank={1}
      isFavorited={false}
      isVerified={true}
      onVote={handleVote}
      onFavorite={handleFavorite}
    />
  );
}
```

### With Database Integration

```tsx
import { getRepository } from '@/actions/repository/getRepository/logic';
import RepoSummary from '@/components/common/RepoSummary';

export default async function RepositoryPage({ params }: { params: { id: string } }) {
  const { repository } = await getRepository({ id: params.id });
  
  if (!repository) {
    return <div>Repository not found</div>;
  }

  return (
    <RepoSummary
      id={repository.id}
      name={repository.title}
      owner={repository.submitter.walletAddress}
      description={repository.description}
      githubUrl={repository.githubUrl}
      totalVotes={repository.totalVotes}
      isVerified={repository.featured}
      onVote={() => {/* Implement vote logic */}}
      onFavorite={() => {/* Implement favorite logic */}}
    />
  );
}
```

## File Structure

```
src/components/common/RepoSummary.tsx          # Main component
src/app/repository/[id]/page.tsx               # Repository detail page
src/app/demo/page.tsx                          # Demo/showcase page
src/actions/repository/getRepository/          # Database actions
  ├── action.ts                                # Server action
  ├── logic.ts                                 # Business logic
  └── schema.ts                                # Validation schema
```

## Styling

The component uses:
- **Tailwind CSS** for styling and responsiveness
- **Lucide React** for icons
- **shadcn/ui** components (Card, Button, Badge)
- **Custom color schemes** for different states and statistics

### Color Schemes for Statistics Cards
- **Total Votes**: Purple theme (`border-purple-200 bg-purple-50/50`)
- **GitHub Stars**: Yellow theme (`border-yellow-200 bg-yellow-50/50`)
- **GitHub Forks**: Blue theme (`border-blue-200 bg-blue-50/50`)
- **Weekly Rank**: Green theme (`border-green-200 bg-green-50/50`)

## Demo

Visit `/demo` to see the component in action with different states:
- Verified vs unverified repositories
- Favorited vs unfavorited states
- Different ranking positions
- Various vote counts and GitHub statistics

## Database Schema

The component integrates with the following Prisma models:

```prisma
model Repository {
  id                 String   @id @default(uuid())
  title              String
  description        String
  githubUrl          String
  totalVotes         Int      @default(0)
  featured           Boolean  @default(false)
  submitter          User     @relation(fields: [submitterId], references: [id])
  votes              Vote[]
  leaderboardEntries WeeklyRepoLeaderboard[]
  // ... other fields
}
```

## Responsive Design

The component is fully responsive:
- **Mobile**: Single column layout with stacked elements
- **Tablet**: Optimized spacing and medium-sized grid for statistics
- **Desktop**: Full four-column grid for statistics cards
- **Large screens**: Maximum width container with centered content

## Accessibility

- Semantic HTML structure
- Proper ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color schemes
- Screen reader friendly content

## Future Enhancements

- [ ] Add GitHub API integration for real-time stars/forks
- [ ] Implement repository favoriting in database
- [ ] Add more social sharing options
- [ ] Include repository activity metrics
- [ ] Add repository contributor information
- [ ] Implement repository comparison features
