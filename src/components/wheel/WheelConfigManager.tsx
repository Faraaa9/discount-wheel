import { useState, useEffect } from 'react';
import { AdminPanel } from '@/components/AdminPanel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Segment } from '@/types/wheel';
import { Json } from '@/integrations/supabase/types';

interface WheelConfigManagerProps {
  onConfigUpdate: (segments: Segment[]) => void;
  initialSegments: Segment[];
}

export const WheelConfigManager = ({ onConfigUpdate, initialSegments }: WheelConfigManagerProps) => {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [configId, setConfigId] = useState<string | null>(null);

  useEffect(() => {
    loadConfiguration();
  }, []);

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
        const loadedSegments = data[0].segments as unknown as Segment[];
        if (isValidSegmentArray(loadedSegments)) {
          setSegments(loadedSegments);
          setConfigId(data[0].id);
          onConfigUpdate(loadedSegments); // Update parent state
        } else {
          console.error('Invalid segment data structure');
          toast.error('Invalid wheel configuration data');
        }
      } else {
        await createInitialConfiguration();
      }
    } catch (error) {
      console.error('Error in loadConfiguration:', error);
      toast.error('Failed to load wheel configuration');
    }
  };

  const isValidSegmentArray = (segments: any): segments is Segment[] => {
    return Array.isArray(segments) && segments.every(segment => 
      'text' in segment && 
      'probability' in segment && 
      'spaceAmount' in segment && 
      'color' in segment
    );
  };

  const createInitialConfiguration = async () => {
    const { data: newConfig, error: insertError } = await supabase
      .from('wheel_configurations')
      .insert([{ segments: initialSegments as unknown as Json }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating initial configuration:', insertError);
      toast.error('Failed to create initial wheel configuration');
      return;
    }

    if (newConfig) {
      setConfigId(newConfig.id);
      setSegments(initialSegments);
      onConfigUpdate(initialSegments); // Update parent state
    }
  };

  const handleConfigUpdate = async (newSegments: Segment[]) => {
    try {
      let response;
      
      if (configId) {
        response = await supabase
          .from('wheel_configurations')
          .update({ segments: newSegments as unknown as Json })
          .eq('id', configId)
          .select();
      } else {
        response = await supabase
          .from('wheel_configurations')
          .insert([{ segments: newSegments as unknown as Json }])
          .select();
      }

      if (response.error) {
        console.error('Error saving configuration:', response.error);
        toast.error('Failed to save wheel configuration');
        return;
      }

      setSegments(newSegments);
      onConfigUpdate(newSegments); // Update parent state
      toast.success('Wheel configuration saved successfully!');
    } catch (error) {
      console.error('Error in handleConfigUpdate:', error);
      toast.error('Failed to save wheel configuration');
    }
  };

  return (
    <div className="w-full max-w-xl mt-8">
      <AdminPanel
        segments={segments}
        onUpdate={handleConfigUpdate}
      />
    </div>
  );
};