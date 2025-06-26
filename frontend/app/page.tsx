'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sparkles, Trophy, Target } from 'lucide-react';
import BettingModal from '@/components/BettingModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DiceFortune
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Test your luck with our premium dice betting experience. Predict, roll, and win big!
          </p>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - CTA */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                  <Trophy className="w-4 h-4 mr-2" />
                  Premium Gaming Experience
                </Badge>
                
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Roll the dice,
                  <br />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Change your fortune
                  </span>
                </h2>
                
                <p className="text-lg text-slate-300 leading-relaxed">
                  Choose your lucky number, place your bet, and watch the magic happen. 
                  Share your victories with the world and climb the leaderboard!
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 group"
                >
                  <Target className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Predict Value & Play
                </Button>
                
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Live Game</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>Social Sharing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Dice Preview */}
            <div className="flex justify-center">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 rounded-3xl shadow-2xl">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {diceIcons.map((DiceIcon, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:from-white/30 hover:to-white/10 transition-all duration-300 cursor-pointer group"
                    >
                      <DiceIcon className="w-8 h-8 text-white mx-auto group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
                
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold text-white">Choose Your Number</h3>
                  <p className="text-slate-300 text-sm">Pick from 1-6 and test your luck</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: Target,
              title: "Predict & Win",
              description: "Choose your number and place your bet"
            },
            {
              icon: Sparkles,
              title: "Instant Results",
              description: "Watch the dice roll with smooth animations"
            },
            {
              icon: Trophy,
              title: "Share Victory",
              description: "Celebrate wins on social media"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <BettingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}