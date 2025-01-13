import { useRef, useState } from 'react';
import { Canvas, util } from 'fabric';
import { toast } from 'sonner';
import { WheelCanvas } from './wheel/WheelCanvas';
import { SpinButton } from './wheel/SpinButton';
import type { WheelSegment } from './wheel/types';

interface SpinningWheelProps {
  segments: WheelSegment[];
  onSpinEnd?: (segment: WheelSegment) => void;
}

export const SpinningWheel = ({ segments, onSpinEnd }: SpinningWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
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

    // Calculate rotation
    const currentRotation = canvas.getObjects()[0]?.angle || 0;
    const targetRotation = currentRotation + 1440 + Math.random() * 360; // Spin 4 times + random

    canvas.getObjects().forEach(obj => {
      obj.animate({ angle: targetRotation }, {
        duration: 3000,
        onChange: () => canvas.renderAll(),
        easing: util.ease.easeOutCubic,
        onComplete: () => {
          setIsSpinning(false);
          if (onSpinEnd) {
            onSpinEnd(selectedSegment!);
          }
          toast.success(`You won: ${selectedSegment!.text}!`);
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
    </div>
  );
};