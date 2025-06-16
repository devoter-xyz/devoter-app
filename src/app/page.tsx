import { getSession } from '@/lib/session';

export default async function HomePage() {
  const session = await getSession();

  return <div>Welcome to Devoter App {session?.userId}</div>;
}