# Component Documentation

This document provides a quick overview and usage examples for key components within the `src/components` directory.

## RepoCard

`src/components/common/RepoCard.tsx`

Displays a repository card, handling favorite toggling and navigation to the sign-in page if the user is not authenticated.

### Usage Example

```typescript jsx
import RepoCard from '@/components/common/RepoCard';

// Assuming `repo` is an object conforming to RepoCardViewProps
<RepoCard
  id={repo.id}
  name={repo.name}
  description={repo.description}
  // ... other RepoCardViewProps
  isFavorited={repo.isFavorited}
/>
```

### Props Summary

-   `id`: `string` - Unique identifier for the repository.
-   `name`: `string` - Name of the repository.
-   `description`: `string` - Description of the repository.
-   `isFavorited?`: `boolean` - (Optional) Indicates if the repository is currently favorited by the user. Defaults to `false`.
-   ... (other props inherited from `RepoCardViewProps`)

## Header

`src/components/common/Header.tsx`

The main application header, featuring the logo, a search bar, and user action buttons. It also includes a mobile-friendly sidebar toggle.

### Usage Example

```typescript jsx
import { Header } from '@/components/common/Header';

<Header />
```

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

This component does not accept any direct props. It derives its behavior and placeholder text from the current URL path.

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