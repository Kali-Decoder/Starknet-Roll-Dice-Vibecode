'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Twitter, Facebook, Link, Copy, Check, X } from 'lucide-react';

interface SocialShareProps {
  isWinner: boolean;
  selectedNumber: number;
  rolledNumber: number;
  betAmount: number;
  onClose: () => void;
}

export default function SocialShare({ isWinner, selectedNumber, rolledNumber, betAmount, onClose }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const winMessage = `🎉 Just won $${betAmount * 5} on DiceForture! 🎲 Predicted ${selectedNumber} and rolled ${rolledNumber}! Lady Luck is on my side! 💰✨ #DiceForture #Winner #LuckyRoll`;
  
  const loseMessage = `😅 Just tried my luck on DiceForture! 🎲 Predicted ${selectedNumber} but rolled ${rolledNumber}. Sometimes you win, sometimes you learn! 🎯 Next roll will be mine! #DiceForture #GamingLife #NextTime`;

  const shareText = isWinner ? winMessage : loseMessage;
  const shareUrl = 'https://dicefortune.com';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Share Your Result</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Preview Message */}
          <div className="space-y-2">
            <Label className="text-sm text-purple-300">Share Message</Label>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <p className="text-sm text-white leading-relaxed">{shareText}</p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            <Label className="text-sm text-purple-300">Share On</Label>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleTwitterShare}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-3"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              
              <Button
                onClick={handleFacebookShare}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>
            </div>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center justify-center gap-2 py-3"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>

          {/* Result Badge */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isWinner 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              <span className="text-lg">{isWinner ? '🏆' : '🎯'}</span>
              {isWinner ? 'Victory!' : 'Next Time!'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}