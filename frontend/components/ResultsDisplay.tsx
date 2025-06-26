'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trophy, TrendingDown, ArrowRight } from 'lucide-react';

interface ResultsDisplayProps {
  selectedNumber: number;
  rolledNumber: number;
  betAmount: number;
  isWinner: boolean;
}

export default function ResultsDisplay({ selectedNumber, rolledNumber, betAmount, isWinner }: ResultsDisplayProps) {
  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const SelectedDice = diceIcons[selectedNumber - 1];
  const RolledDice = diceIcons[rolledNumber - 1];
  
  const winnings = isWinner ? betAmount * 5 : 0; // 5x multiplier for winning
  const profit = winnings - betAmount;

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <div className="text-center space-y-2">
        <div className={`text-6xl ${isWinner ? 'animate-bounce' : ''}`}>
          {isWinner ? '🎉' : '😔'}
        </div>
        <h2 className={`text-3xl font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
          {isWinner ? 'Congratulations!' : 'Better Luck Next Time!'}
        </h2>
      </div>

      {/* Dice Comparison */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 rounded-2xl">
        <div className="flex items-center justify-center space-x-8">
          {/* Your Prediction */}
          <div className="text-center space-y-3">
            <p className="text-sm text-purple-300 font-medium">Your Prediction</p>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <SelectedDice className="w-10 h-10 text-white" />
            </div>
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              {selectedNumber}
            </Badge>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-8 h-8 text-white/50" />

          {/* Actual Roll */}
          <div className="text-center space-y-3">
            <p className="text-sm text-green-300 font-medium">Actual Roll</p>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isWinner 
                ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                : 'bg-gradient-to-br from-red-500 to-pink-500'
            }`}>
              <RolledDice className="w-10 h-10 text-white" />
            </div>
            <Badge variant="outline" className={`${
              isWinner 
                ? 'border-green-500/30 text-green-300' 
                : 'border-red-500/30 text-red-300'
            }`}>
              {rolledNumber}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Financial Summary */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-2xl">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Bet Amount</p>
            <p className="text-2xl font-bold text-white">${betAmount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">
              {isWinner ? 'Winnings' : 'Loss'}
            </p>
            <p className={`text-2xl font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
              {isWinner ? `+$${winnings}` : `-$${betAmount}`}
            </p>
          </div>
        </div>
        
        {isWinner && (
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold text-green-400">
                Net Profit: ${profit}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">5x multiplier applied!</p>
          </div>
        )}
      </Card>
    </div>
  );
}