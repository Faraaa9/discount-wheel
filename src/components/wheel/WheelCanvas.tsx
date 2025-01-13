import { useEffect, useRef } from 'react';
import { Canvas, Path, Text, Shadow, Circle, Group } from 'fabric';
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
      centeredRotation: true, // Ensure rotation happens around center
      selection: false // Disable selection to prevent accidental moves
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
    const radius = Math.min(centerX, centerY) - 20;

    let startAngle = -Math.PI / 2; // Start from top (12 o'clock position)
    const totalProbability = segments.reduce((sum, segment) => sum + segment.probability, 0);

    // Create a group for the wheel to ensure proper rotation
    const wheelGroup = new Group([], {
      left: centerX,
      top: centerY,
      originX: 'center',
      originY: 'center',
      selectable: false,
    });

    // Add outer ring
    const outerRing = new Path([
      'M', -radius - 5, 0,
      'A', radius + 5, radius + 5, 0, 1, 1, radius + 5, 0,
      'A', radius + 5, radius + 5, 0, 1, 1, -radius - 5, 0,
    ].join(' '), {
      fill: 'transparent',
      stroke: '#FFD700',
      strokeWidth: 10,
      selectable: false
    });
    wheelGroup.addWithUpdate(outerRing);

    segments.forEach((segment) => {
      const angle = (segment.probability / totalProbability) * 2 * Math.PI;
      
      // Draw segment
      const path = new Path([
        'M', 0, 0,
        'L', radius * Math.cos(startAngle), radius * Math.sin(startAngle),
        'A', radius, radius, 0, angle > Math.PI ? 1 : 0, 1,
        radius * Math.cos(startAngle + angle),
        radius * Math.sin(startAngle + angle),
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
      wheelGroup.addWithUpdate(path);

      // Add text
      const textAngle = startAngle + angle / 2;
      const textRadius = radius * 0.65;
      const text = new Text(segment.text, {
        left: textRadius * Math.cos(textAngle),
        top: textRadius * Math.sin(textAngle),
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
      wheelGroup.addWithUpdate(text);
      
      startAngle += angle;
    });

    // Add center decoration
    const centerCircle = new Circle({
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
    wheelGroup.addWithUpdate(centerCircle);

    canvas.add(wheelGroup);
    canvas.renderAll();
  };

  return <canvas ref={canvasRef} className="w-full h-full" />;
};