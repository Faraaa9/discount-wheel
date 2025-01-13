import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Segment {
  text: string;
  probability: number;
  color: string;
}

interface AdminPanelProps {
  segments: Segment[];
  onUpdate: (segments: Segment[]) => void;
}

export const AdminPanel = ({ segments: initialSegments, onUpdate }: AdminPanelProps) => {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);

  const handleSegmentUpdate = (index: number, field: keyof Segment, value: string) => {
    const newSegments = [...segments];
    if (field === 'probability') {
      newSegments[index][field] = parseFloat(value) || 0;
    } else {
      newSegments[index][field] = value;
    }
    setSegments(newSegments);
  };

  const handleSave = () => {
    onUpdate(segments);
    toast.success('Wheel configuration saved!');
  };

  const addSegment = () => {
    setSegments([...segments, { text: 'New Segment', probability: 1, color: '#' + Math.floor(Math.random()*16777215).toString(16) }]);
  };

  const removeSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
  };

  return (
    <Card className="p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Wheel Configuration</h2>
      <div className="space-y-6">
        {segments.map((segment, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 items-end">
            <div>
              <Label>Text</Label>
              <Input
                value={segment.text}
                onChange={(e) => handleSegmentUpdate(index, 'text', e.target.value)}
              />
            </div>
            <div>
              <Label>Probability</Label>
              <Input
                type="number"
                value={segment.probability}
                onChange={(e) => handleSegmentUpdate(index, 'probability', e.target.value)}
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={segment.color}
                onChange={(e) => handleSegmentUpdate(index, 'color', e.target.value)}
                className="h-10 w-full"
              />
            </div>
            <Button
              variant="destructive"
              onClick={() => removeSegment(index)}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-8">
        <Button 
          onClick={addSegment}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          Add Segment
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          Save Changes
        </Button>
      </div>
    </Card>
  );
};