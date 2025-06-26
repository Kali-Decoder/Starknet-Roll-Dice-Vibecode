'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Play, Loader2, Trophy, X, Share2 } from 'lucide-react';
import DiceRoller from './DiceRoller';
import ResultsDisplay from './ResultsDisplay';
import SocialShare from './SocialShare';
import { useAccount } from '@starknet-react/core';
import { useDiceRollContract } from '@/hooks/useDiceRollContract';
import { toast } from 'react-hot-toast';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameState = 'betting' | 'rolling' | 'result';

export default function BettingModal({ isOpen, onClose }: BettingModalProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>('betting');
  const [rolledNumber, setRolledNumber] = useState<number | null>(null);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [showShare, setShowShare] = useState(false);
  const { account, isConnected } = useAccount();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    setConnected(!!(isConnected && account));
  }, [isConnected, account]);
  const { playDiceRoll, lastResult } = useDiceRollContract(connected, account);
  const [loading, setLoading] = useState(false);

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

  const resetGame = () => {
    setSelectedNumber(null);
    setBetAmount('');
    setGameState('betting');
    setRolledNumber(null);
    setIsWinner(false);
    setShowShare(false);
  };

  const handleClose = () => {
    resetGame();
    onClose();
  };

  const handleRollDice = async () => {
    if (!selectedNumber || !betAmount) return;
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setGameState('rolling');
    setLoading(true);
    try {
      const betInWei = BigInt(betAmount) * BigInt(10 ** 18); // You may want to convert to wei if needed
      const result = await playDiceRoll(selectedNumber, betInWei);
      if (result) {
        setRolledNumber(result.rolled);
        setIsWinner(result.outcome === 1);
        setGameState('result');
      } else {
        setGameState('betting');
      }
    } catch (err) {
      setGameState('betting');
    } finally {
      setLoading(false);
    }
  };

  const canPlay = connected && selectedNumber && betAmount && parseFloat(betAmount) > 0 && !loading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 text-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {gameState === 'betting' && 'Place Your Bet'}
            {gameState === 'rolling' && 'Rolling Dice...'}
            {gameState === 'result' && (isWinner ? '🎉 You Won!' : '😔 You Lost')}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {gameState === 'betting' && (
          <div className="space-y-8">
            {/* Number Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-purple-300">Choose Your Lucky Number</Label>
              <div className="grid grid-cols-6 gap-3">
                {diceIcons.map((DiceIcon, index) => {
                  const number = index + 1;
                  const isSelected = selectedNumber === number;
                  return (
                    <Button
                      key={number}
                      variant={isSelected ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedNumber(number)}
                      className={`aspect-square p-4 rounded-2xl transition-all duration-300 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105' 
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105'
                      }`}
                    >
                      <DiceIcon className="w-6 h-6" />
                    </Button>
                  );
                })}
              </div>
              {selectedNumber && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Selected: {selectedNumber}
                </Badge>
              )}
            </div>

            {/* Bet Amount */}
            <div className="space-y-4">
              <Label htmlFor="bet-amount" className="text-lg font-semibold text-purple-300">
                Bet Amount ($)
              </Label>
              <Input
                id="bet-amount"
                type="number"
                placeholder="Enter amount..."
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 text-lg py-6 rounded-xl"
                min="1"
                step="0.01"
              />
              <div className="flex gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount.toString())}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleRollDice}
              disabled={!canPlay}
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-6 h-6 mr-3" />
              Roll Dice & Play
            </Button>
          </div>
        )}

        {gameState === 'rolling' && (
          <div className="py-12">
            <DiceRoller />
          </div>
        )}

        {gameState === 'result' && (
          <div className="space-y-6">
            <ResultsDisplay
              selectedNumber={selectedNumber!}
              rolledNumber={rolledNumber!}
              betAmount={parseFloat(betAmount)}
              isWinner={isWinner}
            />
            
            <div className="flex gap-4">
              <Button
                onClick={() => setShowShare(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Result
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 py-3 rounded-xl"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}

        {showShare && (
          <SocialShare
            isWinner={isWinner}
            selectedNumber={selectedNumber!}
            rolledNumber={rolledNumber!}
            betAmount={parseFloat(betAmount)}
            onClose={() => setShowShare(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}