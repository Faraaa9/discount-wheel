import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import type { WheelSegment } from "./types";
import { SaleForm } from "../SaleForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WinningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  segment: WheelSegment | null;
}

export const WinningDialog = ({ isOpen, onClose, segment }: WinningDialogProps) => {
  useEffect(() => {
    if (isOpen && segment) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, segment]);

  const handleSaleSubmit = async (saleNumber: string) => {
    if (!segment) return;

    try {
      const { error } = await supabase
        .from('sale_records')
        .insert([
          {
            sale_number: saleNumber,
            segment_text: segment.text
          }
        ]);

      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error saving sale record:', error);
      toast.error('Failed to save sale record');
    }
  };

  if (!segment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            🎉 Sveikiname! 🎉
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <p className="text-4xl font-bold text-purple-600">
            {segment.text}
          </p>
          <p className="text-center text-gray-600">
            Jūs laimėjote nuostabų prizą! 
          </p>
          <SaleForm onSubmit={handleSaleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};