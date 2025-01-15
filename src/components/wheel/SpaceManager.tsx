import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { toast } from 'sonner';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SpaceManagerProps {
  onSpacePurchased: (percentage: number) => void;
  remainingSpace: number;
  gameInProgress: boolean;
}

export const SpaceManager = ({ onSpacePurchased, remainingSpace, gameInProgress }: SpaceManagerProps) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [spacePercentage, setSpacePercentage] = useState<number>(0);

  const handlePurchaseSpace = async () => {
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
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Purchase Wheel Space</h2>
        <WalletMultiButton />
      </div>
      
      {!gameInProgress && remainingSpace > 0 && (
        <div className="space-y-4">
          <p className="text-lg">Remaining space: {remainingSpace}%</p>
          
          <div className="space-y-2">
            <Input
              type="number"
              min={1}
              max={remainingSpace}
              value={spacePercentage}
              onChange={(e) => setSpacePercentage(Number(e.target.value))}
              placeholder="Enter percentage"
              className="text-lg"
            />
            
            <Button
              onClick={handlePurchaseSpace}
              disabled={!publicKey || isProcessing || spacePercentage <= 0 || spacePercentage > remainingSpace}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white text-lg py-6"
            >
              {isProcessing ? 'Processing...' : 'Purchase Space'}
            </Button>
            
            <p className="text-sm text-gray-500">
              Cost: {(spacePercentage / 100).toFixed(2)} SOL
            </p>
          </div>
        </div>
      )}
      
      {gameInProgress && (
        <div className="text-center py-4">
          <p className="text-lg font-semibold text-purple-600">Game in progress!</p>
          <p className="text-sm text-gray-500">Wait for the current game to finish</p>
        </div>
      )}
    </Card>
  );
};