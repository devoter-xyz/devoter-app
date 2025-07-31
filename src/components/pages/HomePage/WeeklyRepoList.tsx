import RepoCard from '@/components/common/RepoCard';

const fakeRepos = [
  {
    id: '1',
    owner: 'openai',
    name: 'gpt-repo',
    description: 'A test repo for GPT functionality.',
    tags: ['AI', 'NLP', 'Machine Learning'],
    votes: 42,
  },
  {
    id: '2',
    owner: 'vercel',
    name: 'next.js',
    description: 'The React Framework for the Web.',
    tags: ['React', 'Framework', 'SSR'],
    votes: 35,
  },
  {
    id: '3',
    owner: 'facebook',
    name: 'react',
    description: 'A declarative, efficient, and flexible JavaScript library for building UI.',
    tags: ['JavaScript', 'Library', 'UI'],
    votes: 50,
  },
  {
    id: '4',
    owner: 'd3',
    name: 'd3',
    description: 'Bring data to life with SVG, Canvas and HTML.',
    tags: ['DataViz', 'JavaScript', 'Charts'],
    votes: 20,
  },
];

export default async function WeeklyRepoList() {
  // const repos = await getWeeklyTopRepos();
  const repos = fakeRepos;

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
