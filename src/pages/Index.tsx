import { useState } from 'react';
import { SpinningWheel } from '@/components/SpinningWheel';
import { AdminPanel } from '@/components/AdminPanel';
import { SaleForm } from '@/components/SaleForm';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const initialSegments = [
  { text: '10% OFF', probability: 30, color: '#FF6B6B' },
  { text: '20% OFF', probability: 20, color: '#4ECDC4' },
  { text: '30% OFF', probability: 10, color: '#45B7D1' },
  { text: 'Try Again', probability: 40, color: '#96CEB4' },
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
        
        <div className="relative h-[600px] flex flex-col items-center justify-center">
          {/* Main Wheel Section */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <SpinningWheel 
              segments={segments}
              onSpinEnd={handleSpinEnd}
            />
          </div>

          {/* Configuration Toggle */}
          <div className="absolute bottom-0 flex items-center space-x-2">
            <Switch
              id="config-mode"
              checked={showConfig}
              onCheckedChange={setShowConfig}
            />
            <Label htmlFor="config-mode">Configuration Mode</Label>
          </div>

          {/* Configuration Panel (Conditional) */}
          {showConfig && (
            <div className="absolute top-full mt-8 w-full max-w-xl">
              <AdminPanel
                segments={segments}
                onUpdate={setSegments}
              />
            </div>
          )}

          {/* Sale Form (Conditional) */}
          {currentDiscount && !showConfig && (
            <div className="absolute top-full mt-8 w-full max-w-md">
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