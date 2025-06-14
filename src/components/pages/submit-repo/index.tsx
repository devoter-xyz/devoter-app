import { SubmissionStatus } from './components/SubmissionStatus';
import { SubmitRepoForm } from './components/SubmitRepoForm';

interface RepositoryFormProps {
  currentSubmissions?: number;
  maxSubmissions?: number;
  weekStart?: string;
  weekEnd?: string;
}

export function SubmitRepoPageContent({ 
  currentSubmissions = 0, 
  maxSubmissions = 3, 
  weekStart = "Jan 1", 
  weekEnd = "Jan 7" 
}: RepositoryFormProps) {
  // if (isSubmitted) {
  //   return (
  //     <div className="w-full max-w-md border border-green-200 rounded-lg px-7 py-10 shadow-md bg-green-50">
  //       <div className="text-center">
  //         <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
  //         <h3 className="text-lg font-semibold text-green-800 mb-2">
  //           Repository Submitted!
  //         </h3>
  //         <p className="text-sm text-green-600 mb-4">
  //           Your repository has been successfully submitted for voting.
  //         </p>
  //         <Button
  //           onClick={() => setIsSubmitted(false)}
  //           variant="outline"
  //           className="border-green-300 text-green-700 hover:bg-green-100"
  //         >
  //           Submit Another Repository
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

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

        {/* Submission Status */}
        <SubmissionStatus
          currentSubmissions={currentSubmissions}
          maxSubmissions={maxSubmissions}
          weekStart={weekStart}
          weekEnd={weekEnd}
        />
      </div>
    </>
  );
} 