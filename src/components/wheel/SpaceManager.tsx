import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { toast } from 'sonner';
import { WalletStatus } from '../wallet/WalletStatus';
import { PurchaseForm } from '../wallet/PurchaseForm';
import { GameStatus } from '../game/GameStatus';

interface SpaceManagerProps {
  onSpacePurchased: (percentage: number) => void;
  remainingSpace: number;
  gameInProgress: boolean;
}

export const SpaceManager = ({ onSpacePurchased, remainingSpace, gameInProgress }: SpaceManagerProps) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchaseSpace = async (spacePercentage: number) => {
    if (!publicKey || !connection || spacePercentage <= 0 || spacePercentage > remainingSpace) {
      toast.error('Invalid purchase attempt');
      return;
    }

    try {
      setIsProcessing(true);
      const solAmount = spacePercentage / 100;
      const lamports = solAmount * LAMPORTS_PER_SOL;

      // Replace with your game wallet address
      const gameWallet = new PublicKey('YOUR_GAME_WALLET_ADDRESS');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: gameWallet,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      onSpacePurchased(spacePercentage);
      toast.success(`Successfully purchased ${spacePercentage}% of wheel space!`);
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Failed to purchase space');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <WalletStatus />
      
      {!gameInProgress && remainingSpace > 0 && (
        <PurchaseForm
          remainingSpace={remainingSpace}
          onPurchase={handlePurchaseSpace}
          isProcessing={isProcessing}
          isWalletConnected={!!publicKey}
        />
      )}
      
      <GameStatus gameInProgress={gameInProgress} />
    </div>
  );
};