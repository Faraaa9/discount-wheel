import { useState, useEffect } from 'react';
import { Segment } from '@/types/wheel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useWallet } from '@solana/wallet-adapter-react';
import { GameLayout } from '@/components/game/GameLayout';

const initialSegments: Segment[] = [
  { text: 'Choice 6', probability: 1, spaceAmount: 1, color: '#FFFFFF' },
  { text: 'Choice 5', probability: 1, spaceAmount: 1, color: '#FEF7CD' },
  { text: 'Choice 4', probability: 1, spaceAmount: 1, color: '#7E69AB' },
  { text: 'Choice 3', probability: 1, spaceAmount: 1, color: '#90EE90' },
  { text: 'Choice 2', probability: 1, spaceAmount: 1, color: '#FFA500' },
  { text: 'Choice 1', probability: 1, spaceAmount: 1, color: '#FF0000' },
  { text: 'Choice 7', probability: 1, spaceAmount: 1, color: '#87CEEB' },
];

interface SpacePurchase {
  wallet: string;
  percentage: number;
  amount: number;
}

const Index = () => {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [currentDiscount, setCurrentDiscount] = useState('');
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingSpace, setRemainingSpace] = useState(100);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [purchases, setPurchases] = useState<SpacePurchase[]>([]);
  const { publicKey } = useWallet();

  const isValidSegment = (segment: any): segment is Segment => {
    return (
      typeof segment === 'object' &&
      segment !== null &&
      typeof segment.text === 'string' &&
      typeof segment.probability === 'number' &&
      typeof segment.spaceAmount === 'number' &&
      typeof segment.color === 'string'
    );
  };

  const isValidSegmentArray = (segments: any): segments is Segment[] => {
    return Array.isArray(segments) && segments.every(isValidSegment);
  };

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
        const loadedSegments = data[0].segments;
        if (isValidSegmentArray(loadedSegments)) {
          setSegments(loadedSegments);
        } else {
          console.error('Invalid segment data structure');
          toast.error('Invalid wheel configuration data');
        }
      }
    } catch (error) {
      console.error('Error in loadLatestConfiguration:', error);
      toast.error('Failed to load wheel configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpacePurchased = (percentage: number) => {
    if (publicKey) {
      const newPurchase: SpacePurchase = {
        wallet: publicKey.toString().slice(0, 6) + '...' + publicKey.toString().slice(-4),
        percentage,
        amount: percentage / 100,
      };
      setPurchases([...purchases, newPurchase]);
    }
    
    setRemainingSpace(prev => prev - percentage);
    
    if (remainingSpace - percentage <= 0) {
      setGameInProgress(true);
      startGameCountdown();
    }
  };

  const startGameCountdown = () => {
    let countdown = 3;
    const timer = setInterval(() => {
      if (countdown > 0) {
        toast.info(`Game starting in ${countdown}...`);
        countdown--;
      } else {
        clearInterval(timer);
        handleSpinEnd(segments[0]);
        setGameInProgress(false);
        setRemainingSpace(100);
        setPurchases([]); // Clear purchases after game ends
      }
    }, 1000);
  };

  const handleSpinEnd = (segment: Segment) => {
    setCurrentDiscount(segment.text);
    setShowSaleForm(true);
    
    if (publicKey) {
      toast.success(`Congratulations! You've won the prize pool!`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading configuration...</div>
      </div>
    );
  }

  return (
    <GameLayout
      segments={segments}
      onSpinEnd={handleSpinEnd}
      showSaleForm={showSaleForm}
      setShowSaleForm={setShowSaleForm}
      currentDiscount={currentDiscount}
      onSpacePurchased={handleSpacePurchased}
      remainingSpace={remainingSpace}
      gameInProgress={gameInProgress}
      purchases={purchases}
    />
  );
};

export default Index;