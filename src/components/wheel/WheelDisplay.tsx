import { SpinningWheel } from '@/components/SpinningWheel';
import { Segment } from '@/types/wheel';
import { Dispatch, SetStateAction } from 'react';

interface WheelDisplayProps {
  segments: Segment[];
  onSpinEnd: (segment: Segment) => void;
  showSaleForm: boolean;
  setShowSaleForm: Dispatch<SetStateAction<boolean>>;
  currentDiscount: string;
}

export const WheelDisplay = ({ 
  segments, 
  onSpinEnd,
  showSaleForm,
  setShowSaleForm,
  currentDiscount 
}: WheelDisplayProps) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      {showSaleForm && currentDiscount && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-10 text-center mb-6">
          <h2 className="text-2xl text-gray-600 mb-2">Sveikinu, Jums pasisekė!</h2>
          <div className="text-6xl font-bold text-purple-600 mb-8">
            {currentDiscount}
          </div>
        </div>
      )}
      <SpinningWheel 
        segments={segments}
        onSpinEnd={onSpinEnd}
      />
    </div>
  );
};