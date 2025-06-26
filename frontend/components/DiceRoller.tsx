'use client';

import { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

export default function DiceRoller() {
  const [currentDice, setCurrentDice] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDice((prev) => (prev + 1) % 6);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const DiceIcon = diceIcons[currentDice];

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="relative">
        {/* Spinning dice container */}
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl animate-spin">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center">
            <DiceIcon className="w-16 h-16 text-purple-600" />
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">Rolling the dice...</h3>
        <p className="text-purple-300">Your fate is being decided!</p>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}