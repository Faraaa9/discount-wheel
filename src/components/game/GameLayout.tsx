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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-purple-900 mb-2">
            Solana Prize Wheel
          </h1>
          <p className="text-lg text-purple-600">
            Purchase space, spin the wheel, win prizes!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Space Manager */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
              <SpaceManager
                onSpacePurchased={onSpacePurchased}
                remainingSpace={remainingSpace}
                gameInProgress={gameInProgress}
              />
            </div>
          </div>

          {/* Center Column - Wheel */}
          <div className="lg:col-span-4 flex justify-center items-start">
            <div className="relative">
              <WheelDisplay 
                segments={segments}
                onSpinEnd={onSpinEnd}
                showSaleForm={showSaleForm}
                setShowSaleForm={setShowSaleForm}
                currentDiscount={currentDiscount}
              />
            </div>
          </div>

          {/* Right Column - Purchases Table */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
              <PurchasesTable 
                purchases={purchases}
                remainingSpace={remainingSpace}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};