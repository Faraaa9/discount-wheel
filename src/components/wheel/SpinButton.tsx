import { Button } from '@/components/ui/button';

interface SpinButtonProps {
  isSpinning: boolean;
  onClick: () => void;
}

export const SpinButton = ({ isSpinning, onClick }: SpinButtonProps) => (
  <Button 
    onClick={onClick} 
    disabled={isSpinning}
    className="spin-button bg-purple-600 hover:bg-purple-700 active:bg-purple-800 
               transition-all duration-300 transform hover:scale-105 active:scale-95
               disabled:bg-purple-400 disabled:cursor-not-allowed"
  >
    {isSpinning ? 'Spinning...' : 'SPIN!'}
  </Button>
);