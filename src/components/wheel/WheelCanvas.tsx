import { useEffect, useRef } from 'react';
import { Canvas, Path, Text } from 'fabric';
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
    const radius = Math.min(centerX, centerY) - 20; // Slightly smaller radius

    let startAngle = 0;
    const totalProbability = segments.reduce((sum, segment) => sum + segment.probability, 0);

    // Add outer ring
    const outerRing = new Path([
      'M', centerX - radius - 5, centerY,
      'A', radius + 5, radius + 5, 0, 1, 1, centerX + radius + 5, centerY,
      'A', radius + 5, radius + 5, 0, 1, 1, centerX - radius - 5, centerY,
    ].join(' '), {
      fill: 'transparent',
      stroke: '#FFD700', // Gold color
      strokeWidth: 10,
      selectable: false
    });
    canvas.add(outerRing);

    segments.forEach((segment, index) => {
      const angle = (segment.probability / totalProbability) * 2 * Math.PI;
      
      // Draw segment with gradient effect
      const path = new Path([
        'M', centerX, centerY,
        'L', centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle),
        'A', radius, radius, 0, angle > Math.PI ? 1 : 0, 1,
        centerX + radius * Math.cos(startAngle + angle),
        centerY + radius * Math.sin(startAngle + angle),
        'Z'
      ].join(' '), {
        fill: segment.color,
        stroke: '#FFFFFF',
        strokeWidth: 2,
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.2)',
          blur: 10,
          offsetX: 5,
          offsetY: 5
        }),
        selectable: false
      });

      canvas.add(path);

      // Add text with enhanced styling
      const textAngle = startAngle + angle / 2;
      const textRadius = radius * 0.65; // Position text closer to center
      const text = new Text(segment.text, {
        left: centerX + textRadius * Math.cos(textAngle),
        top: centerY + textRadius * Math.sin(textAngle),
        fontSize: 20,
        fontWeight: 'bold',
        fill: '#FFFFFF',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
        angle: (textAngle * 180 / Math.PI) + 90,
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.5)',
          blur: 3,
          offsetX: 2,
          offsetY: 2
        }),
        selectable: false
      });

      canvas.add(text);
      startAngle += angle;
    });

    // Add center decoration
    const centerCircle = new Path.Circle({
      left: centerX - 15,
      top: centerY - 15,
      radius: 15,
      fill: '#FFD700',
      stroke: '#FFFFFF',
      strokeWidth: 2,
      selectable: false,
      shadow: new Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 5,
        offsetX: 2,
        offsetY: 2
      })
    });
    canvas.add(centerCircle);

    canvas.renderAll();
  };

  return <canvas ref={canvasRef} className="w-full h-full" />;
};