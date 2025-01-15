import { SpaceManager } from '@/components/wheel/SpaceManager';
import { WheelDisplay } from '@/components/wheel/WheelDisplay';
import { PurchasesTable } from '@/components/game/PurchasesTable';
import { Segment } from '@/types/wheel';
import { Dispatch, SetStateAction } from 'react';

interface SpacePurchase {
  wallet: string;
  percentage: number;
  amount: number;
}

interface GameLayoutProps {
  segments: Segment[];
  onSpinEnd: (segment: Segment) => void;
  showSaleForm: boolean;
  setShowSaleForm: Dispatch<SetStateAction<boolean>>;
  currentDiscount: string;
  onSpacePurchased: (percentage: number) => void;
  remainingSpace: number;
  gameInProgress: boolean;
  purchases: SpacePurchase[];
}

export const GameLayout = ({
  segments,
  onSpinEnd,
  showSaleForm,
  setShowSaleForm,
  currentDiscount,
  onSpacePurchased,
  remainingSpace,
  gameInProgress,
  purchases,
}: GameLayoutProps) => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Solana Prize Wheel
        </h1>
        
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="w-full max-w-md">
            <SpaceManager
              onSpacePurchased={onSpacePurchased}
              remainingSpace={remainingSpace}
              gameInProgress={gameInProgress}
            />
          </div>

          <div className="relative w-full flex justify-center">
            <WheelDisplay 
              segments={segments}
              onSpinEnd={onSpinEnd}
              showSaleForm={showSaleForm}
              setShowSaleForm={setShowSaleForm}
              currentDiscount={currentDiscount}
            />
          </div>

          <PurchasesTable 
            purchases={purchases}
            remainingSpace={remainingSpace}
          />
        </div>
      </div>
    </div>
  );
};