'use client';

import { useParams } from 'next/navigation';

export default function RepositoryPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className='container mx-auto px-6 py-8'>
      <h1 className='text-3xl font-bold mb-4'>Repository Details</h1>
      <p className='text-lg text-muted-foreground'>
        Repository ID: <span className='font-mono'>{id}</span>
      </p>
      <div className='mt-8 p-6 bg-gray-50 rounded-lg'>
        <p className='text-gray-600'>
          This is a placeholder page for repository details. The actual implementation would fetch and display detailed
          information about the repository.
        </p>
      </div>
    </div>
  );
}
