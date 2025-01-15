import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SpaceManagerProps {
  onSpacePurchased: (percentage: number) => void;
  remainingSpace: number;
  gameInProgress: boolean;
}

export const SpaceManager = ({ onSpacePurchased, remainingSpace, gameInProgress }: SpaceManagerProps) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [spacePercentage, setSpacePercentage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchaseSpace = async () => {
    if (!publicKey || !connection || spacePercentage <= 0 || spacePercentage > remainingSpace) {
      toast.error('Invalid purchase attempt');
      return;
    }

    try {
      setIsProcessing(true);
      const solAmount = spacePercentage / 100; // Convert percentage to SOL
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
      setSpacePercentage(0);
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Failed to purchase space');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Purchase Wheel Space</h3>
        <WalletMultiButton />
      </div>
      
      {!gameInProgress && remainingSpace > 0 && (
        <div className="space-y-2">
          <p>Remaining space: {remainingSpace}%</p>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              max={remainingSpace}
              value={spacePercentage}
              onChange={(e) => setSpacePercentage(Number(e.target.value))}
              placeholder="Enter percentage"
            />
            <Button
              onClick={handlePurchaseSpace}
              disabled={!publicKey || isProcessing || spacePercentage <= 0 || spacePercentage > remainingSpace}
            >
              {isProcessing ? 'Processing...' : 'Purchase Space'}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Cost: {(spacePercentage / 100).toFixed(2)} SOL
          </p>
        </div>
      )}
      
      {gameInProgress && (
        <div className="text-center">
          <p>Game in progress! Please wait for the next round.</p>
        </div>
      )}
    </div>
  );
};