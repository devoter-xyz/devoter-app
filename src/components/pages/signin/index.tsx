import { SignInForm } from './components/SignInForm';
import { SignInHeader } from './components/SignInHeader';

export function SignInPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <SignInHeader />
        <SignInForm />
      </div>
    </div>
  );
}