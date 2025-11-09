import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RepoCard from '../RepoCard';
import RepoCardSkeleton from '../RepoCardSkeleton';
import { useSession } from '@/components/providers/SessionProvider';
import { useRouter } from 'next/navigation';
import { toggleFavoriteAction } from '@/actions/repository/toggleFavorite';
import { toast } from 'sonner';

// Mock child components and hooks
jest.mock('../RepoCardView', () => ({
  RepoCardView: jest.fn(({ onToggleFavorite, isFavorited, isLoading, ...props }) => (
    <div data-testid="repo-card-view" {...props}>
      <span data-testid="repo-name">{props.name}</span>
      <span data-testid="repo-id">{props.id}</span>
      <span data-testid="repo-href">{props.href}</span>
      <span data-testid="is-favorited">{isFavorited ? 'true' : 'false'}</span>
      <span data-testid="is-loading">{isLoading ? 'true' : 'false'}</span>
      <button data-testid="toggle-favorite-button" onClick={onToggleFavorite}>
        Toggle Favorite
      </button>
    </div>
  )),
}));

jest.mock('@/components/providers/SessionProvider', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/actions/repository/toggleFavorite', () => ({
  toggleFavoriteAction: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockRepo: Repo = {
  id: 'repo123',
  name: 'Test Repo',
  description: 'A test repository',
  url: 'https://github.com/test/test-repo',
  owner: 'testuser',
  ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  stars: 100,
  tags: ['react', 'typescript'],
  href: '/repository/repo123',
  isFeatured: false,
  submissionCount: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastSubmission: new Date().toISOString(),
  totalVotes: 50,
  rank: 1,
  votes: 50,
  logoUrl: 'https://example.com/logo.png',
  isVerified: false,
  variant: 'default' as const,
};

describe('RepoCard', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSession as jest.Mock).mockReturnValue({ user: { id: 'user123' } });
  });

  it('renders RepoCardView with correct props', () => {
    render(<RepoCard {...mockRepo} isFavorited={true} />);

    const repoCardView = screen.getByTestId('repo-card-view');
    expect(repoCardView).toBeInTheDocument();
    expect(screen.getByTestId('repo-name')).toHaveTextContent(mockRepo.name);
    expect(screen.getByTestId('repo-id')).toHaveTextContent(mockRepo.id);
    expect(screen.getByTestId('repo-href')).toHaveTextContent(mockRepo.href);
    expect(screen.getByTestId('is-favorited')).toHaveTextContent('true');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  it('updates localIsFavorited when isFavorited prop changes', () => {
    const { rerender } = render(<RepoCard {...mockRepo} isFavorited={false} />);
    expect(screen.getByTestId('is-favorited')).toHaveTextContent('false');

    rerender(<RepoCard {...mockRepo} isFavorited={true} />);
    expect(screen.getByTestId('is-favorited')).toHaveTextContent('true');
  });

  it('calls toggleFavoriteAction and shows success toast when favorited', async () => {
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');

    await waitFor(() => {
      expect(toggleFavoriteAction).toHaveBeenCalledWith({ repositoryId: mockRepo.id });
      expect(screen.getByTestId('is-favorited')).toHaveTextContent('true');
      expect(toast.success).toHaveBeenCalledWith(`Added ${mockRepo.name} to favorites!`);
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });
  });

  it('calls toggleFavoriteAction and shows success toast when unfavorited', async () => {
    (toggleFavoriteAction as jest.Mock).mockResolvedValue({ data: { isFavorited: false } });

    render(<RepoCard {...mockRepo} isFavorited={true} />);

    fireEvent.click(screen.getByTestId('toggle-favorite-button'));

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
    });

    await waitFor(() => {
      expect(toggleFavoriteAction).toHaveBeenCalledWith({ repositoryId: mockRepo.id });
      expect(screen.getByTestId('is-favorited')).toHaveTextContent('false');
      expect(toast.success).toHaveBeenCalledWith(`Removed ${mockRepo.name} from favorites!`);
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });
  });

  it('shows error toast and redirects to signin if no user', async () => {
    (useSession as jest.Mock).mockReturnValue({ user: null });

    render(<RepoCard {...mockRepo} />);

    fireEvent.click(screen.getByTestId('toggle-favorite-button'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please sign in to favorite repositories');
      expect(mockPush).toHaveBeenCalledWith('/signin');
      expect(toggleFavoriteAction).not.toHaveBeenCalled();
    });
  });

  it('shows error toast on toggleFavoriteAction failure', async () => {
    (toggleFavoriteAction as jest.Mock).mockRejectedValue(new Error('Failed to favorite'));

    render(<RepoCard {...mockRepo} />);

    fireEvent.click(screen.getByTestId('toggle-favorite-button'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to toggle favorite status');
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });
  });

  it('shows error toast and redirects to signin on specific toggleFavoriteAction errors', async () => {
    (toggleFavoriteAction as jest.Mock).mockRejectedValue(new Error('User not logged in'));

    render(<RepoCard {...mockRepo} />);

    fireEvent.click(screen.getByTestId('toggle-favorite-button'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please sign in to favorite repositories');
      expect(mockPush).toHaveBeenCalledWith('/signin');
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });
  });
});

describe('RepoCardSkeleton', () => {
  it('renders skeleton components', () => {
    render(<RepoCardSkeleton />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(9);
  });
});
