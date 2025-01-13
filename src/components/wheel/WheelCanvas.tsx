import { useEffect, useRef } from 'react';
import { Canvas, Path, Text, util } from 'fabric';
import { WheelSegment } from './types';

interface WheelCanvasProps {
  segments: WheelSegment[];
  onCanvasReady: (canvas: Canvas) => void;
}

export const WheelCanvas = ({ segments, onCanvasReady }: WheelCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 500,
      height: 500,
    });

    fabricRef.current = canvas;
    onCanvasReady(canvas);
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

  return <canvas ref={canvasRef} className="w-full h-full" />;
};