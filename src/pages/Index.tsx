import { useState, useEffect } from 'react';
import { SpinningWheel } from '@/components/SpinningWheel';
import { AdminPanel } from '@/components/AdminPanel';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Segment {
  text: string;
  probability: number;
  spaceAmount: number;
  color: string;
}

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
  const [configId, setConfigId] = useState<string | null>(null);

  // Load the latest configuration from the database
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const { data, error } = await supabase
          .from('wheel_configurations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error loading configuration:', error);
          toast.error('Failed to load wheel configuration');
          return;
        }

        if (data && data.length > 0) {
          // Type assertion to ensure the segments match our expected type
          const loadedSegments = data[0].segments as Segment[];
          // Validate that all required properties exist
          if (loadedSegments.every(segment => 
            'text' in segment && 
            'probability' in segment && 
            'spaceAmount' in segment && 
            'color' in segment
          )) {
            setSegments(loadedSegments);
            setConfigId(data[0].id);
          } else {
            console.error('Invalid segment data structure');
            toast.error('Invalid wheel configuration data');
          }
        } else {
          // If no configuration exists, create one with initial segments
          const { data: newConfig, error: insertError } = await supabase
            .from('wheel_configurations')
            .insert([{ segments: initialSegments }])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating initial configuration:', insertError);
            toast.error('Failed to create initial wheel configuration');
            return;
          }

          if (newConfig) {
            setConfigId(newConfig.id);
          }
        }
      } catch (error) {
        console.error('Error in loadConfiguration:', error);
        toast.error('Failed to load wheel configuration');
      }
    };

    loadConfiguration();
  }, []);

  const handleSpinEnd = (segment: Segment) => {
    setCurrentDiscount(segment.text);
    setShowSaleForm(true);
  };

  const handleConfigUpdate = async (newSegments: Segment[]) => {
    try {
      let response;
      
      if (configId) {
        // Update existing configuration
        response = await supabase
          .from('wheel_configurations')
          .update({ segments: newSegments })
          .eq('id', configId)
          .select();
      } else {
        // Create new configuration
        response = await supabase
          .from('wheel_configurations')
          .insert([{ segments: newSegments }])
          .select();
      }

      if (response.error) {
        console.error('Error saving configuration:', response.error);
        toast.error('Failed to save wheel configuration');
        return;
      }

      setSegments(newSegments);
      toast.success('Wheel configuration saved successfully!');
    } catch (error) {
      console.error('Error in handleConfigUpdate:', error);
      toast.error('Failed to save wheel configuration');
    }
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
                onUpdate={handleConfigUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;