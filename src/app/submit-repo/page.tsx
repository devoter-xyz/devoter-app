import { SubmitRepoPageContent } from '@/components/pages/submit-repo';
import { getSession } from '@/lib/session';

import { redirect } from 'next/navigation';

export default async function SubmitRepoPage() {
  const session = await getSession();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center'>
          <SubmitRepoPageContent />
        </div>
      </main>
    </div>
  );
}
