import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import type { WheelSegment } from "./types";

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
        </div>
      </DialogContent>
    </Dialog>
  );
};