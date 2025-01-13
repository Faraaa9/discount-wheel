import { useEffect, useRef, useState } from 'react';
import { Canvas, Path, Text, util } from 'fabric';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WheelSegment {
  text: string;
  probability: number;
  color: string;
}

interface SpinningWheelProps {
  segments: WheelSegment[];
  onSpinEnd?: (segment: WheelSegment) => void;
}

export const SpinningWheel = ({ segments, onSpinEnd }: SpinningWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 500,
      height: 500,
    });

    fabricRef.current = canvas;
    drawWheel();

    return () => {
      canvas.dispose();
    };
  }, [segments]);

  const drawWheel = () => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    canvas.clear();

    const centerX = canvas.getWidth() / 2;
    const centerY = canvas.getHeight() / 2;
    const radius = Math.min(centerX, centerY) - 10;

    let startAngle = 0;
    const totalProbability = segments.reduce((sum, segment) => sum + segment.probability, 0);

    segments.forEach((segment) => {
      const angle = (segment.probability / totalProbability) * 2 * Math.PI;
      
      // Draw segment
      const path = new Path([
        'M', centerX, centerY,
        'L', centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle),
        'A', radius, radius, 0, angle > Math.PI ? 1 : 0, 1,
        centerX + radius * Math.cos(startAngle + angle),
        centerY + radius * Math.sin(startAngle + angle),
        'Z'
      ].join(' '), {
        fill: segment.color,
        selectable: false
      });

      canvas.add(path);

      // Add text
      const textAngle = startAngle + angle / 2;
      const text = new Text(segment.text, {
        left: centerX + (radius * 0.7) * Math.cos(textAngle),
        top: centerY + (radius * 0.7) * Math.sin(textAngle),
        fontSize: 16,
        fill: '#FFFFFF',
        originX: 'center',
        originY: 'center',
        angle: (textAngle * 180 / Math.PI) + 90,
        selectable: false
      });

      canvas.add(text);
      startAngle += angle;
    });

    canvas.renderAll();
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
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
    const canvas = fabricRef.current;
    if (!canvas) return;

    const currentRotation = canvas.getObjects()[0]?.angle || 0;
    const targetRotation = currentRotation + 1440 + Math.random() * 360; // Spin 4 times + random

    canvas.getObjects().forEach(obj => {
      obj.animate('angle', targetRotation, {
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
      <canvas ref={canvasRef} className="w-full h-full" />
      <Button 
        onClick={spinWheel} 
        disabled={isSpinning}
        className="spin-button"
      >
        {isSpinning ? 'Spinning...' : 'SPIN!'}
      </Button>
    </div>
  );
};