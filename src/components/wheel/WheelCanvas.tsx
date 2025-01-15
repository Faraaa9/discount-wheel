import { useEffect, useRef } from 'react';
import { Canvas, Path, Text, Shadow, Group } from 'fabric';
import { WheelSegment } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

interface WheelCanvasProps {
  segments: WheelSegment[];
  onCanvasReady: (canvas: Canvas) => void;
}

export const WheelCanvas = ({ segments, onCanvasReady }: WheelCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: isMobile ? 350 : 1000,
      height: isMobile ? 350 : 1000,
      centeredRotation: true,
      selection: false,
      renderOnAddRemove: true
    });

    fabricRef.current = canvas;
    onCanvasReady(canvas);
    drawWheel();

    const handleResize = () => {
      if (!canvasRef.current || !fabricRef.current) return;
      const size = window.innerWidth <= 768 ? 350 : 1000;
      canvas.setDimensions({ width: size, height: size });
      drawWheel();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [segments, isMobile]);

  const drawWheel = () => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    canvas.clear();

    const centerX = canvas.getWidth() / 2;
    const centerY = canvas.getHeight() / 2;
    const radius = (Math.min(centerX, centerY) - 20) * 0.8;

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
      lockRotation: true,
    });

    // Draw outer ring (white border)
    const outerRing = new Path([
      'M', -radius - 5, 0,
      'A', radius + 5, radius + 5, 0, 1, 1, radius + 5, 0,
      'A', radius + 5, radius + 5, 0, 1, 1, -radius - 5, 0,
    ].join(' '), {
      fill: 'transparent',
      stroke: '#FFFFFF',
      strokeWidth: 10,
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
        strokeWidth: 2,
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.2)',
          blur: 10,
          offsetX: 5,
          offsetY: 5
        }),
        selectable: false
      });
      wheelGroup.add(path);

      const textAngle = startAngle + angle / 2;
      const textRadius = radius * 0.65;
      const fontSize = isMobile ? 16 : 24;
      
      const text = new Text(segment.text, {
        left: textRadius * Math.cos(textAngle),
        top: textRadius * Math.sin(textAngle),
        fontSize,
        fontWeight: 'bold',
        fill: '#000000',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
        angle: (textAngle * 180 / Math.PI) + 90,
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.3)',
          blur: 2,
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