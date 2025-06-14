import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { SubmitRepoPageContent } from '@/components/pages/submit-repo';

export default function SubmitRepoPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <SubmitRepoPageContent />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
