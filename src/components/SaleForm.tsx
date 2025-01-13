import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface SaleFormProps {
  discount: string;
  onSubmit: (saleNumber: string) => void;
}

export const SaleForm = ({ discount, onSubmit }: SaleFormProps) => {
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
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Current Discount</Label>
          <Input value={discount} disabled className="bg-muted" />
        </div>
        <div>
          <Label>Sale/Receipt Number</Label>
          <Input
            value={saleNumber}
            onChange={(e) => setSaleNumber(e.target.value)}
            placeholder="Enter sale number"
            required
          />
        </div>
        <Button type="submit">Record Sale</Button>
      </form>
    </Card>
  );
};