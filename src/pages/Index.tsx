import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { WheelConfigManager } from '@/components/wheel/WheelConfigManager';
import { WheelDisplay } from '@/components/wheel/WheelDisplay';
import { Segment } from '@/types/wheel';

const initialSegments: Segment[] = [
  { text: 'Choice 6', probability: 1, spaceAmount: 1, color: '#FFFFFF' },  // White
  { text: 'Choice 5', probability: 1, spaceAmount: 1, color: '#FEF7CD' },  // Yellow
  { text: 'Choice 4', probability: 1, spaceAmount: 1, color: '#7E69AB' },  // Purple
  { text: 'Choice 3', probability: 1, spaceAmount: 1, color: '#90EE90' },  // Green
  { text: 'Choice 2', probability: 1, spaceAmount: 1, color: '#FFA500' },  // Orange
  { text: 'Choice 1', probability: 1, spaceAmount: 1, color: '#FF0000' },  // Red
  { text: 'Choice 7', probability: 1, spaceAmount: 1, color: '#87CEEB' },  // Light Blue
];

const Index = () => {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [currentDiscount, setCurrentDiscount] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);

  const handleSpinEnd = (segment: Segment) => {
    setCurrentDiscount(segment.text);
    setShowSaleForm(true);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Laimės ratas
        </h1>
        
        <div className="flex flex-col items-center justify-center min-h-[800px] relative">
          {/* Configuration Toggle - Top right */}
          <div className="absolute top-0 right-0 z-20 flex items-center space-x-2">
            <Switch
              id="config-mode"
              checked={showConfig}
              onCheckedChange={setShowConfig}
            />
            <Label htmlFor="config-mode">Configuration Mode</Label>
          </div>

          {/* Current Discount Display */}
          {showSaleForm && !showConfig && currentDiscount && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-10 text-center mb-6">
              <h2 className="text-2xl text-gray-600 mb-2">Sveikinu, Jums pasisekė!</h2>
              <div className="text-6xl font-bold text-purple-600 mb-8">
                {currentDiscount}
              </div>
            </div>
          )}

          {/* Main Wheel Section - Hidden when config is shown */}
          {!showConfig && (
            <WheelDisplay 
              segments={segments}
              onSpinEnd={handleSpinEnd}
            />
          )}

          {/* Configuration Panel (Conditional) */}
          {showConfig && (
            <WheelConfigManager
              initialSegments={initialSegments}
              onConfigUpdate={setSegments}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;