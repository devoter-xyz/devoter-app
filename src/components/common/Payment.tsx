import { ConnectButton, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { createThirdwebClient, getContract, toWei } from "thirdweb";
import { base } from "thirdweb/chains";
import { prepareTransaction } from "thirdweb/transaction";
import { TransactionResult } from "thirdweb/dist/types/transaction/types";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const contract = getContract({
  client,
  chain: base,
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC contract address on Base
});

interface PaymentProps {
  onPaymentSuccess: (txHash: string) => void;
  isLoading: boolean;
}

export function Payment({ onPaymentSuccess, isLoading }: PaymentProps) {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onSuccess = (result: TransactionResult) => {
    onPaymentSuccess(result.transactionHash);
  };

  const onError = (error: Error) => {
    console.error("Payment error:", error);
  };

  const handlePayment = () => {
    if (!account) {
      console.error("No account connected");
      return;
    }

    const transaction = prepareTransaction({
      to: "0xYourReceiverAddress", // Replace with your receiving address
      value: toWei("1"), // 1 USDC
      chain: base,
      client: client,
    });

    sendTransaction(transaction, { onSuccess, onError });
  };

  if (!account) {
    return <ConnectButton client={client} />;
  }

  return (
    <button onClick={handlePayment} disabled={isPending || isLoading}>
      {isPending || isLoading ? "Processing..." : "Pay 1 USDC & Submit"}
    </button>
  );
} 