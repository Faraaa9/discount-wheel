import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface SaleFormProps {
  onSubmit: (saleNumber: string) => void;
}

export const SaleForm = ({ onSubmit }: SaleFormProps) => {
  const [saleNumber, setSaleNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleNumber.trim()) {
      toast.error('Please enter a sale number');
      return;
    }
    onSubmit(saleNumber);
    setSaleNumber('');
    toast.success('Sale recorded successfully!');
  };

  return (
    <Card className="p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-gray-700">Sale/Receipt Number</Label>
          <Input
            value={saleNumber}
            onChange={(e) => setSaleNumber(e.target.value)}
            placeholder="Enter sale number"
            className="mt-2"
            required
          />
        </div>
        <Button 
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          Record Sale
        </Button>
      </form>
    </Card>
  );
};