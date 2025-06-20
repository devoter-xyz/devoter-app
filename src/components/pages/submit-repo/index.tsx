import { SubmitRepoForm } from './components/SubmitRepoForm';

export function SubmitRepoPageContent() {
  return (
    <>
      <div className="w-full max-w-md border border-gray-200 rounded-lg px-7 py-10 shadow-md bg-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submit Repository
          </h2>
          <p className="text-sm text-gray-600">
            Submit your GitHub repository for community voting
          </p>
        </div>
        <SubmitRepoForm />
      </div>
    </>
  );
} 