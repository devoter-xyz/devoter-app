import { getFavoriteRepositories } from '@/actions/repository/getFavoriteRepositories/logic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import FavoritesPageContent from '@/components/pages/favorites/FavoritesPageContent';

export default async function FavoritesPage({
  searchParams
}: { 
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = parseInt(searchParams.page as string) || 1;
  const pageSize = parseInt(searchParams.pageSize as string) || 10;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <section className='py-10 px-6 flex flex-col gap-10'>
        <h1 className='mb-8 flex items-center gap-3 text-3xl font-bold'>
          Favorite Repositories
        </h1>
        <p>Please sign in to view your favorite repositories.</p>
      </section>
    );
  }

  const { repositories, total } = await getFavoriteRepositories(userId, {
    page,
    pageSize
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <FavoritesPageContent
      repositories={repositories}
      total={total}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
    />
  );
}
