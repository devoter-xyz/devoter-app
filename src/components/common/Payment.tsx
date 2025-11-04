import React, { memo, useCallback } from "react";
import { createThirdwebClient, toWei } from "thirdweb";
import { base } from "thirdweb/chains";
import { ConnectButton, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareTransaction } from "thirdweb/transaction";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// const contract = getContract({
//   client,
//   chain: base,
//   address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC contract address on Base
// });

interface PaymentProps {
  onPaymentSuccess: (txHash: string) => void;
  isLoading: boolean;
}

function PaymentImpl({ onPaymentSuccess, isLoading }: PaymentProps) {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const handlePayment = useCallback(() => {
    const timerLabel = `Payment_handlePayment_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    if (process.env.NODE_ENV === 'development') {
      console.time(timerLabel);
    }

    if (!account) {
      console.error('No account connected');
      if (process.env.NODE_ENV === 'development') {
        console.timeEnd(timerLabel);
      }
      return;
    }

    const transaction = prepareTransaction({
      to: process.env.NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS!,
      value: toWei("0.01"), // 0.01 USDC
      chain: base,
      client: client,
    });

    sendTransaction(transaction, {
      onSuccess: (result) => {
        onPaymentSuccess(result.transactionHash);
        if (process.env.NODE_ENV === 'development') {
          console.timeEnd(timerLabel);
        }
      }, onError: (error) => {
        console.error('Payment error:', error);
        if (process.env.NODE_ENV === 'development') {
          console.timeEnd(timerLabel);
        }
      }
    });
  }, [account, onPaymentSuccess, sendTransaction]);

  if (!account) {
    return <ConnectButton client={client} />;
  }

  return (
    <button onClick={handlePayment} disabled={isPending || isLoading}>
      {isPending || isLoading ? "Processing..." : "Pay 0.01 USDC & Submit"}
    </button>
  );
}

export const Payment = memo(PaymentImpl); 