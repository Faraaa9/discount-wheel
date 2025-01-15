import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PurchaseFormProps {
  remainingSpace: number;
  onPurchase: (percentage: number) => void;
  isProcessing: boolean;
  isWalletConnected: boolean;
}

export const PurchaseForm = ({ 
  remainingSpace, 
  onPurchase, 
  isProcessing, 
  isWalletConnected 
}: PurchaseFormProps) => {
  const [spacePercentage, setSpacePercentage] = useState<number>(0);

  return (
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
          onClick={() => onPurchase(spacePercentage)}
          disabled={!isWalletConnected || isProcessing || spacePercentage <= 0 || spacePercentage > remainingSpace}
        >
          {isProcessing ? 'Processing...' : 'Purchase Space'}
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Cost: {(spacePercentage / 100).toFixed(2)} SOL
      </p>
    </div>
  );
};