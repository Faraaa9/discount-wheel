import { useState } from 'react';
import { SpinningWheel } from '@/components/SpinningWheel';
import { AdminPanel } from '@/components/AdminPanel';
import { SaleForm } from '@/components/SaleForm';

const initialSegments = [
  { text: '10% OFF', probability: 30, color: '#FF6B6B' },  // Coral Red
  { text: '20% OFF', probability: 20, color: '#4ECDC4' },  // Turquoise
  { text: '30% OFF', probability: 10, color: '#45B7D1' },  // Sky Blue
  { text: 'Try Again', probability: 40, color: '#96CEB4' }, // Sage Green
];

const Index = () => {
  const [segments, setSegments] = useState(initialSegments);
  const [currentDiscount, setCurrentDiscount] = useState('');

  const handleSpinEnd = (segment: typeof initialSegments[0]) => {
    setCurrentDiscount(segment.text);
  };

  const handleSaleSubmit = (saleNumber: string) => {
    console.log('Sale recorded:', { discount: currentDiscount, saleNumber });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Spin & Win Discounts!
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Main Wheel Section */}
          <div className="flex-1 flex flex-col items-center space-y-8">
            <div className="relative w-full max-w-xl mx-auto">
              <SpinningWheel 
                segments={segments}
                onSpinEnd={handleSpinEnd}
              />
            </div>
            {currentDiscount && (
              <div className="w-full max-w-md">
                <SaleForm
                  discount={currentDiscount}
                  onSubmit={handleSaleSubmit}
                />
              </div>
            )}
          </div>

          {/* Configuration Panel */}
          <div className="w-full lg:w-96">
            <AdminPanel
              segments={segments}
              onUpdate={setSegments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;