import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { WheelConfigManager } from '@/components/wheel/WheelConfigManager';
import { WheelDisplay } from '@/components/wheel/WheelDisplay';
import { Segment } from '@/types/wheel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLatestConfiguration();
  }, []);

  const loadLatestConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('wheel_configurations')
        .select('segments')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading configuration:', error);
        toast.error('Failed to load wheel configuration');
        return;
      }

      if (data && data.length > 0) {
        const loadedSegments = data[0].segments as Segment[];
        setSegments(loadedSegments);
      }
    } catch (error) {
      console.error('Error in loadLatestConfiguration:', error);
      toast.error('Failed to load wheel configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinEnd = (segment: Segment) => {
    setCurrentDiscount(segment.text);
    setShowSaleForm(true);
  };

  const handleConfigUpdate = (newSegments: Segment[]) => {
    setSegments(newSegments);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Laimės ratas
        </h1>
        
        <div className="flex flex-col items-center justify-center min-h-[800px] relative">
          <div className="absolute top-0 right-0 z-20 flex items-center space-x-2">
            <Switch
              id="config-mode"
              checked={showConfig}
              onCheckedChange={setShowConfig}
            />
            <Label htmlFor="config-mode">Configuration Mode</Label>
          </div>

          {showConfig ? (
            <WheelConfigManager
              initialSegments={segments}
              onConfigUpdate={handleConfigUpdate}
            />
          ) : (
            <WheelDisplay 
              segments={segments}
              onSpinEnd={handleSpinEnd}
              showSaleForm={showSaleForm}
              setShowSaleForm={setShowSaleForm}
              currentDiscount={currentDiscount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;