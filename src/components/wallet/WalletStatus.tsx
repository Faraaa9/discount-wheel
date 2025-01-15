import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletStatus = () => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Purchase Wheel Space</h3>
      <WalletMultiButton />
    </div>
  );
};