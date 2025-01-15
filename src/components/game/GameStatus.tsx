interface GameStatusProps {
  gameInProgress: boolean;
}

export const GameStatus = ({ gameInProgress }: GameStatusProps) => {
  if (!gameInProgress) return null;
  
  return (
    <div className="text-center">
      <p>Game in progress! Please wait for the next round.</p>
    </div>
  );
};