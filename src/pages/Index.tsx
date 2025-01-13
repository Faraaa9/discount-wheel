import { useState } from 'react';
import { SpinningWheel } from '@/components/SpinningWheel';
import { AdminPanel } from '@/components/AdminPanel';
import { SaleForm } from '@/components/SaleForm';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const initialSegments = [
  { text: 'Choice 6', probability: 1, color: '#FFFFFF' },  // White
  { text: 'Choice 5', probability: 1, color: '#FEF7CD' },  // Yellow
  { text: 'Choice 4', probability: 1, color: '#7E69AB' },  // Purple
  { text: 'Choice 3', probability: 1, color: '#90EE90' },  // Green
  { text: 'Choice 2', probability: 1, color: '#FFA500' },  // Orange
  { text: 'Choice 1', probability: 1, color: '#FF0000' },  // Red
  { text: 'Choice 7', probability: 1, color: '#87CEEB' },  // Light Blue
];

const Index = () => {
  const [segments, setSegments] = useState(initialSegments);
  const [currentDiscount, setCurrentDiscount] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleSpinEnd = (segment: typeof initialSegments[0]) => {
    setCurrentDiscount(segment.text);
  };

  const handleSaleSubmit = (saleNumber: string) => {
    console.log('Sale recorded:', { discount: currentDiscount, saleNumber });
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Spin & Win Discounts!
        </h1>
        
        <div className="flex flex-col items-center justify-center min-h-[800px] relative">
          {/* Configuration Toggle - Moved to top right */}
          <div className="absolute top-0 right-0 z-20 flex items-center space-x-2">
            <Switch
              id="config-mode"
              checked={showConfig}
              onCheckedChange={setShowConfig}
            />
            <Label htmlFor="config-mode">Configuration Mode</Label>
          </div>

          {/* Main Wheel Section - Hidden when config is shown */}
          {!showConfig && (
            <div className="w-full max-w-xl mx-auto mb-8">
              <SpinningWheel 
                segments={segments}
                onSpinEnd={handleSpinEnd}
              />
            </div>
          )}

          {/* Configuration Panel (Conditional) */}
          {showConfig && (
            <div className="w-full max-w-xl mt-8">
              <AdminPanel
                segments={segments}
                onUpdate={setSegments}
              />
            </div>
          )}

          {/* Sale Form (Conditional) */}
          {currentDiscount && !showConfig && (
            <div className="w-full max-w-md mt-8">
              <SaleForm
                discount={currentDiscount}
                onSubmit={handleSaleSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;