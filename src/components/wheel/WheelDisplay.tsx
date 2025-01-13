import { SpinningWheel } from '@/components/SpinningWheel';
import { Segment } from '@/types/wheel';

interface WheelDisplayProps {
  segments: Segment[];
  onSpinEnd: (segment: Segment) => void;
}

export const WheelDisplay = ({ segments, onSpinEnd }: WheelDisplayProps) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <SpinningWheel 
        segments={segments}
        onSpinEnd={onSpinEnd}
      />
    </div>
  );
};