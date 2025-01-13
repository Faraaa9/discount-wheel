import { useRef, useState } from 'react';
import { Canvas, util } from 'fabric';
import { toast } from 'sonner';
import { WheelCanvas } from './wheel/WheelCanvas';
import { SpinButton } from './wheel/SpinButton';
import { WinningDialog } from './wheel/WinningDialog';
import type { WheelSegment } from './wheel/types';

interface SpinningWheelProps {
  segments: WheelSegment[];
  onSpinEnd?: (segment: WheelSegment) => void;
}

export const SpinningWheel = ({ segments, onSpinEnd }: SpinningWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [winningSegment, setWinningSegment] = useState<WheelSegment | null>(null);
  const canvasRef = useRef<Canvas | null>(null);

  const handleCanvasReady = (canvas: Canvas) => {
    canvasRef.current = canvas;
  };

  const spinWheel = () => {
    if (isSpinning || !canvasRef.current) return;
    
    setIsSpinning(true);
    const canvas = canvasRef.current;
    
    const totalProbability = segments.reduce((sum, segment) => sum + segment.probability, 0);
    const randomValue = Math.random() * totalProbability;
    
    let currentSum = 0;
    let selectedSegment: WheelSegment | null = null;
    
    for (const segment of segments) {
      currentSum += segment.probability;
      if (randomValue <= currentSum) {
        selectedSegment = segment;
        break;
      }
    }

    if (!selectedSegment) {
      selectedSegment = segments[segments.length - 1];
    }

    // Calculate rotation with added randomness
    const currentRotation = canvas.getObjects()[0]?.angle || 0;
    const minSpins = 4; // Minimum number of full rotations
    const maxSpins = 8; // Maximum number of full rotations
    const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const extraDegrees = Math.random() * 360; // Random additional degrees
    const targetRotation = currentRotation + (randomSpins * 360) + extraDegrees;

    // Apply the spinning animation
    canvas.getObjects().forEach(obj => {
      obj.animate({ angle: targetRotation }, {
        duration: 4000 + Math.random() * 1000, // Random duration between 4-5 seconds
        onChange: () => canvas.renderAll(),
        easing: util.ease.easeOutCubic,
        onComplete: () => {
          setIsSpinning(false);
          if (onSpinEnd && selectedSegment) {
            onSpinEnd(selectedSegment);
          }
          setWinningSegment(selectedSegment);
          setShowWinDialog(true);
          toast.success(`Jūs laimėjote: ${selectedSegment!.text}!`);
        },
      });
    });
  };

  return (
    <div className="wheel-container">
      <WheelCanvas 
        segments={segments}
        onCanvasReady={handleCanvasReady}
      />
      <SpinButton 
        isSpinning={isSpinning}
        onClick={spinWheel}
      />
      <WinningDialog 
        isOpen={showWinDialog}
        onClose={() => setShowWinDialog(false)}
        segment={winningSegment}
      />
    </div>
  );
};