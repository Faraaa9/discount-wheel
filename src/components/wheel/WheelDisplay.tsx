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
      <SpinningWheel 
        segments={segments}
        onSpinEnd={onSpinEnd}
      />
    </div>
  );
};