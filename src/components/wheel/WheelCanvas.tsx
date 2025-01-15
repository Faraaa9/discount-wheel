import { useEffect, useRef } from 'react';
import { Canvas, Path, Text, Shadow, Group } from 'fabric';
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
      width: 500,  // Reduced from 1000
      height: 500, // Reduced from 1000
      centeredRotation: true,
      selection: false,
      renderOnAddRemove: true
    });

    fabricRef.current = canvas;
    onCanvasReady(canvas);
    drawWheel();

    return () => {
      if (fabricRef.current) {
        fabricRef.current.getObjects().forEach(obj => {
          if (obj.angle) {
            obj.set('angle', obj.angle);
            fabricRef.current?.renderAll();
          }
        });
        fabricRef.current.clear();
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, [segments]);

  const drawWheel = () => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    canvas.clear();

    const centerX = canvas.getWidth() / 2;
    const centerY = canvas.getHeight() / 2;
    const radius = (Math.min(centerX, centerY) - 10) * 0.8; // Adjusted padding

    let startAngle = 0;
    const totalSpace = segments.reduce((sum, segment) => sum + segment.spaceAmount, 0);

    const wheelGroup = new Group([], {
      left: centerX,
      top: centerY,
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: false,
    });

    // Draw outer ring (white border)
    const outerRing = new Path([
      'M', -radius - 5, 0,
      'A', radius + 5, radius + 5, 0, 1, 1, radius + 5, 0,
      'A', radius + 5, radius + 5, 0, 1, 1, -radius - 5, 0,
    ].join(' '), {
      fill: 'transparent',
      stroke: '#FFFFFF',
      strokeWidth: 5, // Reduced from 10
      selectable: false
    });
    wheelGroup.add(outerRing);

    segments.forEach((segment) => {
      const angle = (segment.spaceAmount / totalSpace) * 2 * Math.PI;
      
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
        strokeWidth: 1, // Reduced from 2
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.2)',
          blur: 5, // Reduced from 10
          offsetX: 2, // Reduced from 5
          offsetY: 2  // Reduced from 5
        }),
        selectable: false
      });
      wheelGroup.add(path);

      const textAngle = startAngle + angle / 2;
      const textRadius = radius * 0.65;
      const text = new Text(segment.text, {
        left: textRadius * Math.cos(textAngle),
        top: textRadius * Math.sin(textAngle),
        fontSize: 16, // Reduced from 24
        fontWeight: 'bold',
        fill: '#000000',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
        angle: (textAngle * 180 / Math.PI) + 90,
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.3)',
          blur: 1,
          offsetX: 1,
          offsetY: 1
        }),
        selectable: false
      });
      wheelGroup.add(text);
      
      startAngle += angle;
    });

    canvas.add(wheelGroup);
    canvas.centerObject(wheelGroup);
    canvas.renderAll();
  };

  return <canvas ref={canvasRef} className="w-full h-full" />;
};