'use client';

import React from 'react';
import Link from 'next/link';
import { GameState, GameStats } from '../app/game/page';

interface GameOverlaysProps {
  gameState: GameState;
  countdown: number;
  stats: GameStats;
  getMessage: () => string;
  getMessageClass: () => string;
  getReactionDisplay: () => React.ReactElement | null;
  onResetGame: () => void;
}

export default function GameOverlays({
  gameState,
  countdown,
  stats,
 
  getReactionDisplay,
  onResetGame
}: GameOverlaysProps) {
  return (
    <>

       {gameState === 'levelComplete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a23]/90 backdrop-blur-xl">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] animate-pulse animation-delay-700"></div>
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
            {countdown > 0 ? (
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-6 uppercase tracking-[0.5em] animate-pulse">
                 Loading...
                </div>
                <div className="text-9xl md:text-[15rem] font-black text-white mb-4"
                     style={{
                       textShadow: '0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.3)',
                       filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.4))'
                     }}>
                  {countdown}
                </div>
                <div className="text-xl text-gray-400 font-mono uppercase tracking-widest">
                  Next Level Loading
                </div>
              </div>
            ) : (
              <div className="bg-black/60 border-2 border-green-500/30 p-12 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                {getReactionDisplay()}
              </div>
            )}
          </div>
        </div>
      )}


      {gameState === 'gameOver' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a23]">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
             <div className="cyber-grid absolute inset-0"></div>
          </div>
          
          <div className="text-center max-w-2xl px-8 relative z-10">
            {stats.lives <= 0 ? (
              <>
             
                <div className="text-7xl md:text-8xl font-black text-white mb-4 tracking-tighter uppercase">
                 GAME  <span className="text-red-500">OVER</span>
                </div>
                <div className="text-xl text-red-400/80 mb-8 font-mono uppercase tracking-widest">YOU LOST</div>
              </>
            ) : (
              <>






                <div className="text-7xl md:text-8xl font-black text-white mb-4 tracking-tighter uppercase">
                  YOU<span className="text-green-400">WON</span>
                </div>
                <div className="text-xl text-green-400/80 mb-8 font-mono uppercase tracking-widest">Congratulations</div>
              </>
            )}
            
            <div className="my-12 p-10 bg-black/40 backdrop-blur-md rounded-3xl border-2 border-green-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="text-sm text-green-400/60 mb-2 font-mono uppercase tracking-[0.3em]">YOUR TOTAL POINTS</div>
              <div className="text-8xl font-black text-white tracking-tighter">{stats.totalScore}</div>
             
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <button
                onClick={onResetGame}
                className="w-full sm:w-auto px-12 py-5 bg-green-500 hover:bg-green-600 text-gray-900 text-xl font-black rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)] uppercase tracking-tighter"
              >
               PLAY AGAIN
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-12 py-5 bg-white/5 hover:bg-white/10 text-white text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20 uppercase tracking-tighter"
              >

               Exit GAME
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}