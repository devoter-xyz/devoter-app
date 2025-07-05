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

export function Payment({ onPaymentSuccess, isLoading }: PaymentProps) {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const handlePayment = () => {
    if (!account) {
      console.error("No account connected");
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
      }, onError: (error) => {
        console.error("Payment error:", error);
      }
    });
  };

  if (!account) {
    return <ConnectButton client={client} />;
  }

  return (
    <button onClick={handlePayment} disabled={isPending || isLoading}>
      {isPending || isLoading ? "Processing..." : "Pay 0.01 USDC & Submit"}
    </button>
  );
} 