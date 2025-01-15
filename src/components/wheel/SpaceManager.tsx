import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { toast } from 'sonner';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SpaceManagerProps {
  onSpacePurchased: (percentage: number) => void;
  remainingSpace: number;
  gameInProgress: boolean;
}

export const SpaceManager = ({ 
  onSpacePurchased, 
  remainingSpace, 
  gameInProgress 
}: SpaceManagerProps) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [spacePercentage, setSpacePercentage] = useState<number>(0);

  const handlePurchaseSpace = async () => {
    if (!publicKey || !connection || spacePercentage <= 0 || spacePercentage > remainingSpace) {
      return;
    }

    try {
      setIsProcessing(true);
      const gameWallet = new PublicKey('YOUR_GAME_WALLET_ADDRESS');
      const solAmount = spacePercentage / 100;
      const lamports = solAmount * LAMPORTS_PER_SOL;

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-purple-900">Purchase Space</h2>
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Available Space</span>
            <span className="font-medium text-purple-600">{remainingSpace}%</span>
          </div>
          <Progress value={100 - remainingSpace} className="h-2" />
        </div>

        {!gameInProgress && remainingSpace > 0 && (
          <Card className="p-4 space-y-4 bg-purple-50 border-purple-100">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-900">
                Space Percentage
              </label>
              <Input
                type="number"
                min={1}
                max={remainingSpace}
                value={spacePercentage}
                onChange={(e) => setSpacePercentage(Number(e.target.value))}
                placeholder="Enter percentage"
                className="border-purple-200 focus:border-purple-500"
              />
              <p className="text-sm text-purple-600">
                Cost: {(spacePercentage / 100).toFixed(2)} SOL
              </p>
            </div>

            <Button
              onClick={handlePurchaseSpace}
              disabled={!publicKey || isProcessing || spacePercentage <= 0 || spacePercentage > remainingSpace}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? 'Processing...' : 'Purchase Space'}
            </Button>
          </Card>
        )}

        {gameInProgress && (
          <div className="text-center py-6">
            <p className="text-lg font-medium text-purple-900">Game in Progress!</p>
            <p className="text-sm text-purple-600">Wait for the current game to finish</p>
          </div>
        )}
      </div>
    </div>
  );
};