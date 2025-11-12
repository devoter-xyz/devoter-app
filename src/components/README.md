# Component Documentation

This document provides a quick overview and usage examples for key components within the `src/components` directory.

## RepoCard

`src/components/common/RepoCard.tsx`

Displays a repository card, handling favorite toggling and navigation to the sign-in page if the user is not authenticated.

### Props Interface

```typescript
interface RepoCardProps {
  id: string;
  name: string;
  description: string;
  owner: string;
  logoUrl: string;
  tags: string[];
  isVerified: boolean;
  votes: number;
  variant: string;
  isFavorited?: boolean; // Optional
  rank?: number; // Optional
  cardType?: string; // Optional
  isLoading?: boolean; // Optional
}
```

### Usage Example

```typescript jsx
import RepoCard from '@/components/common/RepoCard';

const exampleRepo = {
  id: 'repo123',
  name: 'Devoter App',
  description: 'A platform for discovering and voting on developer projects.',
  owner: 'devoter-xyz',
  logoUrl: '/dev-token-logo.png',
  tags: ['react', 'nextjs', 'web3'],
  isVerified: true,
  votes: 1200,
  variant: 'default',
  isFavorited: true,
  rank: 1,
  cardType: 'featured',
};

<RepoCard {...exampleRepo} isLoading={false} />
```

## Header

`src/components/common/Header.tsx`

The main application header, featuring the logo, a search bar, and user action buttons. It also includes a mobile-friendly sidebar toggle.

### Usage Example

```typescript jsx
import { Header } from '@/components/common/Header';
import { LayoutProvider } from '@/components/providers/LayoutProvider';

// Header must be wrapped in LayoutProvider to access layout context.
// Otherwise, it will throw the error: "useLayout must be used within a LayoutProvider".
<LayoutProvider>
  <Header />
</LayoutProvider>
```

### Context Properties

The `Header` component relies on the following context properties from `LayoutProvider`:

-   `isSidebarOpen`: `boolean` - Indicates if the sidebar is currently open.
-   `toggleSidebar`: `() => void` - Function to toggle the sidebar's open/closed state.
-   `closeSidebar`: `() => void` - Function to explicitly close the sidebar.

### Props Summary

This component does not accept any direct props. It manages its internal state and interactions (e.g., sidebar toggle) via context.

## Search

`src/components/common/Search.tsx`

A reusable search input component with dynamic placeholder text based on the current route and an integrated filter dialog.

### Usage Example

```typescript jsx
import { Search } from '@/components/common/Search';

<Search />
```

### Props Summary

This component does not accept any direct props. It derives its behavior and placeholder text from the current URL path. The integrated filter dialog is currently UI-only and does not apply filtering logic.

## WalletProvider

`src/components/providers/WalletProvider.tsx`

Provides the necessary context for wallet connection and interaction throughout the application using `wagmi` and `RainbowKit`.

### Usage Example

```typescript jsx
import { WalletProvider } from '@/components/providers/WalletProvider';

function App() {
  return (
    <WalletProvider>
      {/* Your application components that need wallet access */}
      <SomeWalletDependentComponent />
    </WalletProvider>
  );
}
```

### Props Summary

-   `children`: `ReactNode` - The child components that will have access to the wallet context provided by `WalletProvider`.