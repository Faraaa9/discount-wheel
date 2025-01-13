import { useState } from 'react';
import { SpinningWheel } from '@/components/SpinningWheel';
import { AdminPanel } from '@/components/AdminPanel';
import { SaleForm } from '@/components/SaleForm';

const initialSegments = [
  { text: '10% OFF', probability: 30, color: '#8B5CF6' },
  { text: '20% OFF', probability: 20, color: '#0EA5E9' },
  { text: '30% OFF', probability: 10, color: '#10B981' },
  { text: 'Try Again', probability: 40, color: '#6B7280' },
];

const Index = () => {
  const [segments, setSegments] = useState(initialSegments);
  const [currentDiscount, setCurrentDiscount] = useState('');

  const handleSpinEnd = (segment: typeof initialSegments[0]) => {
    setCurrentDiscount(segment.text);
  };

  const handleSaleSubmit = (saleNumber: string) => {
    console.log('Sale recorded:', { discount: currentDiscount, saleNumber });
    // Here you would typically send this data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Spin & Win Discounts!
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center space-y-6">
            <SpinningWheel 
              segments={segments}
              onSpinEnd={handleSpinEnd}
            />
            {currentDiscount && (
              <SaleForm
                discount={currentDiscount}
                onSubmit={handleSaleSubmit}
              />
            )}
          </div>
          
          <div>
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