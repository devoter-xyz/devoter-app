import { ConnectWallet } from '@/components/common/Wallet/ConnectWallet';

export function SignInForm() {
  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <ConnectWallet />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By connecting your wallet, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 