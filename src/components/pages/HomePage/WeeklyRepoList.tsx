import { getWeeklyTopRepos } from '@/actions/repository/getTopUniqueVotedRepositories/action';
import RepoCard from '@/components/common/RepoCard';

export default async function WeeklyRepoList() {
  const repos = await getWeeklyTopRepos();

  if (repos.length === 0) {
    return (
      <div className="col-span-full flex h-40 items-center justify-center rounded-lg bg-muted/50">
        <p className="text-lg text-muted-foreground">No repositories voted this week</p>
      </div>
    );
  }

  return (
    <>
      {repos.map((repo, index) => (
        <RepoCard
          key={repo.id}
          owner={repo.owner}
          name={repo.name}
          description={repo.description || ''}
          tags={repo.tags}
          votes={repo.votes}
          variant={index < 3 ? (['first', 'second', 'third'] as const)[index] : 'default'}
        />
      ))}
    </>
  );
}
