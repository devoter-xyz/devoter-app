import { Calendar, GitBranch } from 'lucide-react';

interface SubmissionStatusProps {
  currentSubmissions: number;
  maxSubmissions: number;
  weekStart: string;
  weekEnd: string;
}

export function SubmissionStatus({ 
  currentSubmissions, 
  maxSubmissions, 
  weekStart, 
  weekEnd 
}: SubmissionStatusProps) {
  const remaining = maxSubmissions - currentSubmissions;
  const isLimitReached = remaining <= 0;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Weekly Submissions
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-900">
            {currentSubmissions}/{maxSubmissions}
          </div>
          <div className="text-xs text-blue-600">
            {remaining > 0 ? `${remaining} remaining` : 'Limit reached'}
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center space-x-2 text-xs text-blue-600">
        <Calendar className="h-3 w-3" />
        <span>
          Week of {weekStart} - {weekEnd}
        </span>
      </div>
      
      {isLimitReached && (
        <div className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-1">
          You&apos;ve reached your weekly submission limit. New submissions will be available next week.
        </div>
      )}
    </div>
  );
} 