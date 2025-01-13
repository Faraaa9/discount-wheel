import { Button } from '@/components/ui/button';

interface SpinButtonProps {
  isSpinning: boolean;
  onClick: () => void;
}

export const SpinButton = ({ isSpinning, onClick }: SpinButtonProps) => (
  <Button 
    onClick={onClick} 
    disabled={isSpinning}
    className="spin-button"
  >
    {isSpinning ? 'Spinning...' : 'SPIN!'}
  </Button>
);