import RepoCard from '@/components/common/RepoCard';

export default function Home() {
  const mockRepo = {
    owner: 'jack',
    name: 'devoter-app',
    description:
      'A Next.js application that allows users to submit their GitHub repositories for community voting.',
    tags: ['nextjs', 'prisma', 'tailwind', 'siwe'],
    votes: 123,
  };

  return (
    <main className="container grid grid-cols-1 gap-8 py-10 md:grid-cols-2 lg:grid-cols-3">
      <RepoCard {...mockRepo} variant="default" />
      <RepoCard {...mockRepo} variant="featured" />
      <RepoCard {...mockRepo} variant="first" isVerified />
      <RepoCard {...mockRepo} variant="second" isFavorited />
      <RepoCard {...mockRepo} variant="third" isVerified isFavorited />
    </main>
  );
}