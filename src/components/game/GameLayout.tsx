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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-purple-900 mb-4">
            Solana Prize Wheel
          </h1>
          <p className="text-xl text-purple-600 max-w-2xl mx-auto">
            Join the excitement! Purchase space on our wheel and spin for amazing prizes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Space Manager */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 transform hover:scale-[1.02] transition-transform duration-300">
              <SpaceManager
                onSpacePurchased={onSpacePurchased}
                remainingSpace={remainingSpace}
                gameInProgress={gameInProgress}
              />
            </div>
          </div>

          {/* Center Column - Wheel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 flex items-center justify-center transform hover:scale-[1.02] transition-transform duration-300">
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
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 transform hover:scale-[1.02] transition-transform duration-300">
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