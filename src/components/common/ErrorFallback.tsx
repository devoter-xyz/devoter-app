import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: (...args: unknown[]) => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="flex flex-col items-center justify-center p-4 space-y-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <h2 className="text-xl font-semibold">Something went wrong:</h2>
      <pre className="text-sm text-red-600 whitespace-pre-wrap break-all">{error.message}</pre>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
