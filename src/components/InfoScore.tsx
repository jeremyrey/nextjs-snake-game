import { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export default function InfoScore({score}) {
  const [bestScore, setBestScore] = useLocalStorage('bestScore', 0);
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);
  return (
    <div className="opacity-30 p-2">
      <p className="font-bold">Current Score: {score}</p>
      <p className="font-bold">Best Score: {bestScore}</p>
    </div>
  );
}
